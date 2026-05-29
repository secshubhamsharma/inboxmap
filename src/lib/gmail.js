import { detectCategory } from './categorize'
import { buildAccount, isPersonalSender } from './accountDetect'
import { parseUnsubscribeHeader } from './unsubscribe'
import { analyzeSenders } from './authAnalysis'
import { extractBodyHtml, detectTrackersInHtml } from './trackerDetect'

function parseFrom(raw) {
  if (!raw) return { email: 'unknown@unknown.com', name: 'Unknown' }
  const emailMatch = raw.match(/<(.+?)>/) || raw.match(/([^\s]+@[^\s]+)/)
  const nameMatch = raw.match(/^"?([^<"]+)"?\s*</)
  const email = emailMatch?.[1]?.toLowerCase().trim() || raw.toLowerCase().trim()
  const name = nameMatch?.[1]?.trim() || email.split('@')[0] || raw
  return { email, name }
}

async function fetchMessageIds(accessToken, maxResults) {
  const ids = []
  let pageToken = null

  while (ids.length < maxResults) {
    const batch = Math.min(100, maxResults - ids.length)
    let url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${batch}&fields=messages(id),nextPageToken`
    if (pageToken) url += `&pageToken=${pageToken}`

    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
    if (!res.ok) throw new Error(`Gmail API error: ${res.status}`)
    const data = await res.json()
    if (data.messages) ids.push(...data.messages.map((m) => m.id))
    if (!data.nextPageToken) break
    pageToken = data.nextPageToken
  }

  return ids.slice(0, maxResults)
}

async function fetchHeaderBatch(accessToken, ids) {
  return Promise.all(
    ids.map(async (id) => {
      const url = [
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}`,
        `?format=metadata`,
        `&metadataHeaders=From`,
        `&metadataHeaders=Date`,
        `&metadataHeaders=Subject`,
        `&metadataHeaders=List-Unsubscribe`,
        `&metadataHeaders=Authentication-Results`,
        `&metadataHeaders=X-Mailer`,
        `&fields=id,payload/headers`,
      ].join('')

      const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      if (!res.ok) return null
      const data = await res.json()
      const headers = data.payload?.headers || []
      const get = (name) => headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || ''

      const { email: fromEmail, name: fromName } = parseFrom(get('From'))
      return {
        id: data.id,
        from: get('From'),
        fromEmail,
        fromName,
        date: get('Date'),
        subject: get('Subject'),
        listUnsubscribe: get('List-Unsubscribe'),
        authResults: get('Authentication-Results'),
        xMailer: get('X-Mailer'),
      }
    })
  )
}

function buildSenderMap(messages) {
  const map = {}

  for (const msg of messages) {
    if (!msg) continue
    const { email, name } = parseFrom(msg.from)
    if (!email || email === 'unknown@unknown.com') continue

    const dateStr = msg.date ? new Date(msg.date).toISOString() : new Date().toISOString()
    const dateOnly = dateStr.split('T')[0]

    if (!map[email]) {
      map[email] = {
        email,
        name,
        count: 0,
        dates: [],
        subjects: [],
        sampleIds: [],
        firstDate: dateStr,
        lastDate: dateStr,
        unsubscribeUrl: null,
        xMailer: null,
      }
    }

    const entry = map[email]
    entry.count++
    entry.dates.push(dateOnly)
    if (msg.subject) entry.subjects.push({ subject: msg.subject, date: dateStr })
    if (msg.id && entry.sampleIds.length < 3) entry.sampleIds.push(msg.id)
    if (msg.listUnsubscribe && !entry.unsubscribeUrl) {
      entry.unsubscribeUrl = parseUnsubscribeHeader(msg.listUnsubscribe)
    }
    if (msg.xMailer && !entry.xMailer) entry.xMailer = msg.xMailer
    if (dateStr < entry.firstDate) entry.firstDate = dateStr
    if (dateStr > entry.lastDate) entry.lastDate = dateStr
  }

  return map
}

export async function runTrackerScan(accessToken, senders, onProgress) {
  const samples = []
  for (const sender of senders) {
    for (const id of (sender.sampleIds || []).slice(0, 2)) {
      samples.push({ id, senderEmail: sender.email, senderName: sender.name })
    }
  }

  const capped = samples.slice(0, 250)
  const trackerMap = {}
  const BATCH = 8

  for (let i = 0; i < capped.length; i += BATCH) {
    const chunk = capped.slice(i, i + BATCH)

    await Promise.all(
      chunk.map(async ({ id, senderEmail, senderName }) => {
        try {
          const res = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full&fields=payload`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          )
          if (!res.ok) return

          const data = await res.json()
          const html = extractBodyHtml(data.payload)
          const trackers = detectTrackersInHtml(html)

          if (!trackerMap[senderEmail]) {
            trackerMap[senderEmail] = {
              email: senderEmail,
              name: senderName,
              trackers: [],
              sampledCount: 0,
            }
          }

          trackerMap[senderEmail].sampledCount++
          for (const t of trackers) {
            if (!trackerMap[senderEmail].trackers.includes(t)) {
              trackerMap[senderEmail].trackers.push(t)
            }
          }
        } catch {}
      })
    )

    if (onProgress) onProgress(Math.round(((i + chunk.length) / capped.length) * 100))
    if (i + BATCH < capped.length) await new Promise((r) => setTimeout(r, 120))
  }

  return trackerMap
}

export async function scanInbox(accessToken, scanDepth, onProgress) {
  onProgress({ progress: 5, message: 'Fetching message list…' })

  const ids = await fetchMessageIds(accessToken, scanDepth)
  onProgress({ progress: 15, message: `Found ${ids.length} emails. Reading headers…` })

  const BATCH = 20
  const messages = []

  for (let i = 0; i < ids.length; i += BATCH) {
    const chunk = ids.slice(i, i + BATCH)
    const results = await fetchHeaderBatch(accessToken, chunk)
    messages.push(...results)
    const pct = 15 + Math.round(((i + chunk.length) / ids.length) * 70)
    onProgress({
      progress: pct,
      message: `Fetched ${Math.min(i + BATCH, ids.length)} / ${ids.length} emails…`,
    })
    if (i + BATCH < ids.length) await new Promise((r) => setTimeout(r, 100))
  }

  onProgress({ progress: 88, message: 'Analysing authentication & accounts…' })

  const senderMap = buildSenderMap(messages)
  const authStats = analyzeSenders(messages.filter(Boolean))

  const senders = Object.values(senderMap)
    .map((s) => ({ ...s, category: detectCategory(s.email, s.name) }))
    .sort((a, b) => b.count - a.count)

  const accounts = Object.values(senderMap)
    .filter((s) => !isPersonalSender(s.email))
    .map((s) => buildAccount({ ...s, category: detectCategory(s.email, s.name) }))
    .sort((a, b) => new Date(a.firstEmailDate) - new Date(b.firstEmailDate))

  onProgress({ progress: 100, message: 'Done!' })

  return {
    senders,
    accounts,
    authStats,
    totalScanned: messages.filter(Boolean).length,
  }
}

export async function fetchUserInfo(accessToken) {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error('Failed to fetch user info')
  const data = await res.json()
  return { name: data.name, email: data.email, picture: data.picture }
}

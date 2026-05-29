const CACHE_KEY = 'inboxmap_breach_cache'
const CACHE_TTL = 1000 * 60 * 60 * 6

function loadCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { ts, data } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) return null
    return data
  } catch {
    return null
  }
}

function saveCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }))
  } catch {}
}

async function fetchAllBreaches() {
  const cached = loadCache()
  if (cached) return cached
  const res = await fetch('https://haveibeenpwned.com/api/v3/breaches', {
    headers: { 'hibp-api-key': '' },
  })
  if (!res.ok) throw new Error(`HIBP fetch failed: ${res.status}`)
  const data = await res.json()
  saveCache(data)
  return data
}

export async function matchBreaches(accounts) {
  let allBreaches
  try {
    allBreaches = await fetchAllBreaches()
  } catch {
    return []
  }

  const breachMap = {}
  for (const b of allBreaches) {
    if (b.Domain) breachMap[b.Domain.toLowerCase()] = b
  }

  const results = []
  for (const account of accounts) {
    const key = account.domain.toLowerCase()
    const breach = breachMap[key]
    if (breach) {
      results.push({
        account,
        breach: {
          name: breach.Name,
          domain: breach.Domain,
          breachDate: breach.BreachDate,
          pwnCount: breach.PwnCount,
          dataClasses: breach.DataClasses || [],
          description: breach.Description || '',
          isVerified: breach.IsVerified,
          isSensitive: breach.IsSensitive,
        },
      })
    }
  }

  return results.sort((a, b) => new Date(b.breach.breachDate) - new Date(a.breach.breachDate))
}

export function getSeverity(breach) {
  const critical = ['Passwords', 'Credit cards', 'Bank account numbers', 'Social security numbers', 'Passport numbers']
  const hasCritical = breach.dataClasses.some((d) => critical.includes(d))
  if (hasCritical) return 'critical'
  if (breach.pwnCount > 10_000_000) return 'high'
  if (breach.pwnCount > 1_000_000) return 'medium'
  return 'low'
}

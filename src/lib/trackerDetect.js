export const TRACKER_DOMAINS = [
  { domain: 'sendgrid.net',           name: 'SendGrid' },
  { domain: 'click.sendgrid.net',     name: 'SendGrid' },
  { domain: 'track.sendgrid.net',     name: 'SendGrid' },
  { domain: 'u.sendgrid.net',         name: 'SendGrid' },
  { domain: 'mailchimp.com',          name: 'Mailchimp' },
  { domain: 'list-manage.com',        name: 'Mailchimp' },
  { domain: 'mcsv.net',               name: 'Mailchimp' },
  { domain: 'mcusercontent.com',      name: 'Mailchimp' },
  { domain: 'mandrillapp.com',        name: 'Mailchimp (Mandrill)' },
  { domain: 'klaviyo.com',            name: 'Klaviyo' },
  { domain: 'trk.klclick.com',        name: 'Klaviyo' },
  { domain: 'trk.klaviyoemail.com',   name: 'Klaviyo' },
  { domain: 'email.klaviyo.com',      name: 'Klaviyo' },
  { domain: 'hubspot.com',            name: 'HubSpot' },
  { domain: 'hubspotemail.net',       name: 'HubSpot' },
  { domain: 't.sidekickopen.com',     name: 'HubSpot' },
  { domain: 'click.hubspotemail.net', name: 'HubSpot' },
  { domain: 'mailtrack.io',           name: 'Mailtrack' },
  { domain: 'mltrk.io',              name: 'Mailtrack' },
  { domain: 'yesware.com',            name: 'Yesware' },
  { domain: 'mytracks.io',            name: 'Yesware' },
  { domain: 'bananatag.com',          name: 'Bananatag' },
  { domain: 'mixmax.com',             name: 'Mixmax' },
  { domain: 'salesloft.com',          name: 'Salesloft' },
  { domain: 'outreach.io',            name: 'Outreach' },
  { domain: 'cmail1.com',             name: 'Campaign Monitor' },
  { domain: 'cmail2.com',             name: 'Campaign Monitor' },
  { domain: 'createsend.com',         name: 'Campaign Monitor' },
  { domain: 'exacttarget.com',        name: 'Salesforce Marketing' },
  { domain: 'salesforceiq.com',       name: 'Salesforce Marketing' },
  { domain: 'marketo.net',            name: 'Marketo' },
  { domain: 'mktaws.com',             name: 'Marketo' },
  { domain: 'mktomail.com',           name: 'Marketo' },
  { domain: 'sparkpostmail.com',      name: 'SparkPost' },
  { domain: 'sparkpost.com',          name: 'SparkPost' },
  { domain: 'mailgun.org',            name: 'Mailgun' },
  { domain: 'mailgun.net',            name: 'Mailgun' },
  { domain: 'sendinblue.com',         name: 'Brevo' },
  { domain: 'brevo.com',              name: 'Brevo' },
  { domain: 'constantcontact.com',    name: 'Constant Contact' },
  { domain: 'activecampaign.com',     name: 'ActiveCampaign' },
  { domain: 'convertkit.com',         name: 'ConvertKit' },
  { domain: 'convertkit-mail.com',    name: 'ConvertKit' },
  { domain: 'beehiiv.com',            name: 'Beehiiv' },
  { domain: 'customer.io',            name: 'Customer.io' },
  { domain: 'customerio.com',         name: 'Customer.io' },
  { domain: 'drip.com',               name: 'Drip' },
  { domain: 'getdrip.com',            name: 'Drip' },
  { domain: 'omnisend.com',           name: 'Omnisend' },
  { domain: 'getresponse.com',        name: 'GetResponse' },
  { domain: 'aweber.com',             name: 'AWeber' },
  { domain: 'mailerlite.com',         name: 'MailerLite' },
  { domain: 'postmarkapp.com',        name: 'Postmark' },
  { domain: 'mtasv.net',              name: 'Postmark' },
  { domain: 'intercom.io',            name: 'Intercom' },
  { domain: 'intercom-mail.com',      name: 'Intercom' },
  { domain: 'cirrusinsight.com',      name: 'Cirrus Insight' },
  { domain: 'streak.com',             name: 'Streak' },
  { domain: 'opentracking.io',        name: 'Open Tracking' },
  { domain: 'trk.email',              name: 'Generic Tracker' },
]

const TRACKER_DOMAIN_SET = new Map(
  TRACKER_DOMAINS.flatMap((t) => [[t.domain, t.name]])
)

const TRACKING_URL_PATTERNS = [
  /\/track(ing)?(\/|\?|$)/i,
  /\/open(ed)?(\/|\?|$)/i,
  /\/pixel(\/|\?|$)/i,
  /\/beacon(\/|\?|$)/i,
  /[?&](track|open|pixel|beacon)=/i,
  /\/o\/[a-zA-Z0-9]+/,
  /\/wf\/open/i,
]

function matchTrackerDomain(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase()
    for (const [domain, name] of TRACKER_DOMAIN_SET) {
      if (hostname === domain || hostname.endsWith('.' + domain)) {
        return name
      }
    }
  } catch {}
  return null
}

function decodeBodyData(data) {
  if (!data) return ''
  try {
    const binary = atob(data.replace(/-/g, '+').replace(/_/g, '/'))
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return new TextDecoder('utf-8', { fatal: false }).decode(bytes)
  } catch {
    return ''
  }
}

export function extractBodyHtml(payload) {
  if (!payload) return ''

  if (payload.body?.data) return decodeBodyData(payload.body.data)

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/html' && part.body?.data) {
        return decodeBodyData(part.body.data)
      }
    }
    for (const part of payload.parts) {
      if (part.parts) {
        const nested = extractBodyHtml(part)
        if (nested) return nested
      }
    }
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return decodeBodyData(part.body.data)
      }
    }
  }

  return ''
}

export function detectTrackersInHtml(html) {
  if (!html) return []

  const found = new Set()

  const imgRx = /<img[^>]+src=["']([^"']+)["'][^>]*/gi
  let m
  while ((m = imgRx.exec(html)) !== null) {
    const src = m[1]
    const tag  = m[0]

    const knownName = matchTrackerDomain(src)
    if (knownName) {
      found.add(knownName)
      continue
    }

    const is1x1 = (
      (/width=["']?1["']?/i.test(tag) && /height=["']?1["']?/i.test(tag)) ||
      /style="[^"]*display:\s*none/i.test(tag)
    )
    if (is1x1) {
      try {
        found.add(new URL(src).hostname)
      } catch {}
      continue
    }

    if (TRACKING_URL_PATTERNS.some((p) => p.test(src))) {
      try {
        found.add(new URL(src).hostname)
      } catch {}
    }
  }

  return Array.from(found)
}

export function buildTrackerSummary(trackerMap) {
  const entries = Object.values(trackerMap)
  const tracked    = entries.filter((e) => e.trackers.length > 0)
  const notTracked = entries.filter((e) => e.sampledCount > 0 && e.trackers.length === 0)

  const byPlatform = {}
  for (const entry of tracked) {
    for (const t of entry.trackers) {
      byPlatform[t] = (byPlatform[t] || 0) + 1
    }
  }

  const platformList = Object.entries(byPlatform)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }))

  return {
    totalTracked:    tracked.length,
    totalNotTracked: notTracked.length,
    totalSampled:    entries.reduce((s, e) => s + e.sampledCount, 0),
    platformList,
  }
}

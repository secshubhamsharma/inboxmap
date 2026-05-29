const PLATFORMS = [
  { name: 'Mailchimp',        icon: '🐵', color: '#FFE01B', textColor: '#1a1a1a', patterns: [/mailchimp/i, /list-manage\.com/i, /mcsv\.net/i, /mc\.sendgrid\.net/i] },
  { name: 'Klaviyo',          icon: '📊', color: '#1B1B1B', textColor: '#fff',    patterns: [/klaviyo/i, /kx\.cdn/i] },
  { name: 'HubSpot',          icon: '🔶', color: '#FF7A59', textColor: '#fff',    patterns: [/hubspot/i, /hs-email\.com/i, /hssvcs\.com/i, /hubspotemail/i] },
  { name: 'SendGrid',         icon: '📤', color: '#1A82E2', textColor: '#fff',    patterns: [/sendgrid/i, /sendgrid\.net/i] },
  { name: 'Mailgun',          icon: '🔫', color: '#C20000', textColor: '#fff',    patterns: [/mailgun/i] },
  { name: 'Brevo',            icon: '💙', color: '#0092FF', textColor: '#fff',    patterns: [/sendinblue/i, /brevo/i, /sib-api/i] },
  { name: 'Campaign Monitor', icon: '📧', color: '#45A8A8', textColor: '#fff',    patterns: [/cmail\d\.com/i, /createsend\.com/i, /campaignmonitor/i] },
  { name: 'Constant Contact', icon: '📮', color: '#2D9CDB', textColor: '#fff',    patterns: [/constantcontact/i] },
  { name: 'ActiveCampaign',   icon: '⚡', color: '#356AE6', textColor: '#fff',    patterns: [/activecampaign/i] },
  { name: 'ConvertKit',       icon: '✉️', color: '#FB6970', textColor: '#fff',    patterns: [/convertkit/i, /ck\.page/i] },
  { name: 'Beehiiv',          icon: '🐝', color: '#E8FF72', textColor: '#1a1a1a', patterns: [/beehiiv/i] },
  { name: 'Substack',         icon: '📰', color: '#FF6719', textColor: '#fff',    patterns: [/substack/i] },
  { name: 'Amazon SES',       icon: '☁️', color: '#FF9900', textColor: '#1a1a1a', patterns: [/amazonaws\.com/i, /amazonses/i] },
  { name: 'Postmark',         icon: '📬', color: '#FFCD00', textColor: '#1a1a1a', patterns: [/postmark/i, /mtasv\.net/i] },
  { name: 'Marketo',          icon: '🎯', color: '#5E4AD1', textColor: '#fff',    patterns: [/marketo/i, /mktaws/i, /mktomail/i] },
  { name: 'Salesforce',       icon: '☁️', color: '#00A1E0', textColor: '#fff',    patterns: [/exacttarget/i, /salesforceiq/i, /sfmc/i] },
  { name: 'Mailjet',          icon: '✈️', color: '#4BADE9', textColor: '#fff',    patterns: [/mailjet/i] },
  { name: 'Drip',             icon: '💧', color: '#9B59B6', textColor: '#fff',    patterns: [/drip\.com/i, /getdrip/i] },
  { name: 'Omnisend',         icon: '🌐', color: '#00A878', textColor: '#fff',    patterns: [/omnisend/i] },
]

function detectPlatform(unsubscribeUrl, xMailer, senderEmail) {
  const haystack = [unsubscribeUrl, xMailer, senderEmail].filter(Boolean).join(' ').toLowerCase()
  for (const p of PLATFORMS) {
    if (p.patterns.some((rx) => rx.test(haystack))) return p
  }
  return null
}

export function buildPlatformMap(senders) {
  const map = {}

  for (const sender of senders) {
    const platform = detectPlatform(sender.unsubscribeUrl, sender.xMailer, sender.email)
    if (!platform) continue
    if (!map[platform.name]) {
      map[platform.name] = { ...platform, senders: [] }
    }
    map[platform.name].senders.push(sender)
  }

  return Object.values(map).sort((a, b) => b.senders.length - a.senders.length)
}

export function getTotalPlatformExposure(platformMap) {
  return platformMap.reduce((acc, p) => acc + p.senders.length, 0)
}

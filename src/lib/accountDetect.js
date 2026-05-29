const PERSONAL_DOMAINS = new Set([
  'gmail.com','yahoo.com','hotmail.com','outlook.com','icloud.com',
  'protonmail.com','aol.com','live.com','me.com','mac.com','msn.com',
  'ymail.com','pm.me','hey.com','fastmail.com','zoho.com',
])

const ACCOUNT_SUBJECT_PATTERNS = [
  /welcome (to|aboard)/i,
  /you['']re (in|all set|confirmed)/i,
  /thanks for (joining|signing up|registering|creating|subscribing)/i,
  /thank you for (joining|registering|signing up|subscribing)/i,
  /your account (is|has been) (created|activated|confirmed|ready)/i,
  /verify your (email|account|address)/i,
  /confirm your (email|account|subscription|address)/i,
  /please (verify|confirm|activate)/i,
  /activate your account/i,
  /complete your (registration|signup|sign-up|profile|setup)/i,
  /finish (setting up|your setup)/i,
  /get started with/i,
  /you['']ve (successfully )?(signed up|registered|joined|subscribed|created)/i,
  /subscription confirmed/i,
  /account created/i,
  /account (successfully )?created/i,
  /email verified/i,
  /welcome email/i,
  /you['']re on the list/i,
  /you['']re now (a member|subscribed|registered)/i,
]

const SERVICE_NAME_MAP = {
  'google.com': 'Google', 'google': 'Google',
  'amazon.com': 'Amazon', 'amazon': 'Amazon',
  'apple.com': 'Apple', 'apple': 'Apple',
  'microsoft.com': 'Microsoft', 'microsoft': 'Microsoft',
  'github.com': 'GitHub', 'github': 'GitHub',
  'gitlab.com': 'GitLab', 'gitlab': 'GitLab',
  'notion.so': 'Notion', 'notion': 'Notion',
  'linear.app': 'Linear', 'linear': 'Linear',
  'vercel.com': 'Vercel', 'vercel': 'Vercel',
  'netlify.com': 'Netlify', 'netlify': 'Netlify',
  'figma.com': 'Figma', 'figma': 'Figma',
  'slack.com': 'Slack', 'slack': 'Slack',
  'discord.com': 'Discord', 'discord': 'Discord',
  'twitter.com': 'Twitter', 'twitter': 'Twitter',
  'x.com': 'X (Twitter)', 'x': 'X',
  'linkedin.com': 'LinkedIn', 'linkedin': 'LinkedIn',
  'facebook.com': 'Facebook', 'facebook': 'Facebook',
  'instagram.com': 'Instagram', 'instagram': 'Instagram',
  'reddit.com': 'Reddit', 'reddit': 'Reddit',
  'youtube.com': 'YouTube', 'youtube': 'YouTube',
  'spotify.com': 'Spotify', 'spotify': 'Spotify',
  'netflix.com': 'Netflix', 'netflix': 'Netflix',
  'medium.com': 'Medium', 'medium': 'Medium',
  'substack.com': 'Substack', 'substack': 'Substack',
  'mailchimp.com': 'Mailchimp', 'mailchimp': 'Mailchimp',
  'shopify.com': 'Shopify', 'shopify': 'Shopify',
  'stripe.com': 'Stripe', 'stripe': 'Stripe',
  'twilio.com': 'Twilio', 'twilio': 'Twilio',
  'sendgrid.net': 'SendGrid', 'sendgrid': 'SendGrid',
  'hubspot.com': 'HubSpot', 'hubspot': 'HubSpot',
  'salesforce.com': 'Salesforce', 'salesforce': 'Salesforce',
  'dropbox.com': 'Dropbox', 'dropbox': 'Dropbox',
  'zoom.us': 'Zoom', 'zoom': 'Zoom',
  'loom.com': 'Loom', 'loom': 'Loom',
  'intercom.io': 'Intercom', 'intercom': 'Intercom',
  'typeform.com': 'Typeform', 'typeform': 'Typeform',
  'airtable.com': 'Airtable', 'airtable': 'Airtable',
  'trello.com': 'Trello', 'trello': 'Trello',
  'asana.com': 'Asana', 'asana': 'Asana',
  'clickup.com': 'ClickUp', 'clickup': 'ClickUp',
  'monday.com': 'Monday.com', 'monday': 'Monday',
  'framer.com': 'Framer', 'framer': 'Framer',
  'webflow.com': 'Webflow', 'webflow': 'Webflow',
  'canva.com': 'Canva', 'canva': 'Canva',
  'grammarly.com': 'Grammarly', 'grammarly': 'Grammarly',
  'lastpass.com': 'LastPass', 'lastpass': 'LastPass',
  '1password.com': '1Password', '1password': '1Password',
  'bitwarden.com': 'Bitwarden', 'bitwarden': 'Bitwarden',
  'namecheap.com': 'Namecheap', 'namecheap': 'Namecheap',
  'godaddy.com': 'GoDaddy', 'godaddy': 'GoDaddy',
  'cloudflare.com': 'Cloudflare', 'cloudflare': 'Cloudflare',
  'digitalocean.com': 'DigitalOcean', 'digitalocean': 'DigitalOcean',
  'aws.amazon.com': 'Amazon AWS', 'amazonaws': 'Amazon AWS',
  'heroku.com': 'Heroku', 'heroku': 'Heroku',
  'railway.app': 'Railway', 'railway': 'Railway',
  'render.com': 'Render', 'render': 'Render',
  'supabase.com': 'Supabase', 'supabase': 'Supabase',
  'firebase.google.com': 'Firebase', 'firebase': 'Firebase',
  'mongodb.com': 'MongoDB', 'mongodb': 'MongoDB',
  'planetscale.com': 'PlanetScale', 'planetscale': 'PlanetScale',
  'auth0.com': 'Auth0', 'auth0': 'Auth0',
  'twitch.tv': 'Twitch', 'twitch': 'Twitch',
  'paypal.com': 'PayPal', 'paypal': 'PayPal',
  'razorpay.com': 'Razorpay', 'razorpay': 'Razorpay',
  'paytm.com': 'Paytm', 'paytm': 'Paytm',
  'swiggy.com': 'Swiggy', 'swiggy': 'Swiggy',
  'zomato.com': 'Zomato', 'zomato': 'Zomato',
  'flipkart.com': 'Flipkart', 'flipkart': 'Flipkart',
  'myntra.com': 'Myntra', 'myntra': 'Myntra',
  'amazon.in': 'Amazon India', 'quora.com': 'Quora', 'quora': 'Quora',
  'producthunt.com': 'Product Hunt', 'producthunt': 'Product Hunt',
  'hashnode.com': 'Hashnode', 'hashnode': 'Hashnode',
  'dev.to': 'Dev.to', 'devto': 'Dev.to',
  'stackoverflow.com': 'Stack Overflow', 'stackoverflow': 'Stack Overflow',
  'coursera.org': 'Coursera', 'coursera': 'Coursera',
  'udemy.com': 'Udemy', 'udemy': 'Udemy',
  'skillshare.com': 'Skillshare', 'skillshare': 'Skillshare',
  'beehiiv.com': 'Beehiiv', 'beehiiv': 'Beehiiv',
  'convertkit.com': 'ConvertKit', 'convertkit': 'ConvertKit',
}

function extractDomain(email) {
  const match = email.match(/@([^>]+)/)
  return match ? match[1].toLowerCase().trim() : ''
}

function extractRootDomain(domain) {
  const parts = domain.split('.')
  if (parts.length >= 2) return parts.slice(-2).join('.')
  return domain
}

function extractServiceName(email, senderName) {
  const domain = extractDomain(email)
  const rootDomain = extractRootDomain(domain)
  const rootName = rootDomain.split('.')[0]

  if (SERVICE_NAME_MAP[domain]) return SERVICE_NAME_MAP[domain]
  if (SERVICE_NAME_MAP[rootDomain]) return SERVICE_NAME_MAP[rootDomain]
  if (SERVICE_NAME_MAP[rootName]) return SERVICE_NAME_MAP[rootName]

  const cleanName = senderName
    .replace(/^(no.?reply|noreply|hello|hi|support|info|team|notifications?|updates?|newsletter)\s*(from|at|@|via)?\s*/i, '')
    .replace(/\s*(newsletter|updates|notifications?|team|support|noreply|no.?reply)$/i, '')
    .trim()

  if (cleanName && cleanName.length > 1 && !cleanName.includes('@')) return cleanName

  return rootName.charAt(0).toUpperCase() + rootName.slice(1)
}

export function isPersonalSender(email) {
  const domain = extractDomain(email)
  const rootDomain = extractRootDomain(domain)
  return PERSONAL_DOMAINS.has(domain) || PERSONAL_DOMAINS.has(rootDomain)
}

export function isAccountSignalSubject(subject) {
  if (!subject) return false
  return ACCOUNT_SUBJECT_PATTERNS.some((p) => p.test(subject))
}

export function buildAccount(senderData) {
  const { email, name, count, dates, firstDate, lastDate, subjects = [], unsubscribeUrl, category } = senderData
  const domain = extractDomain(email)
  const rootDomain = extractRootDomain(domain)
  const serviceName = extractServiceName(email, name)
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${rootDomain}&sz=64`

  const signupDate = subjects.find((s) => isAccountSignalSubject(s.subject))?.date || firstDate

  const daysSinceLastEmail = Math.floor((Date.now() - new Date(lastDate)) / 86400000)
  let status = 'active'
  if (daysSinceLastEmail > 180) status = 'ghost'
  else if (daysSinceLastEmail > 60) status = 'dormant'

  return {
    id: domain,
    serviceName,
    domain: rootDomain,
    senderEmail: email,
    senderName: name,
    faviconUrl,
    signupDate,
    firstEmailDate: firstDate,
    lastEmailDate: lastDate,
    totalEmails: count,
    unsubscribeUrl,
    hasUnsubscribe: !!unsubscribeUrl,
    isAccountEmail: subjects.some((s) => isAccountSignalSubject(s.subject)),
    status,
    category,
    daysSinceLastEmail,
    dates,
  }
}

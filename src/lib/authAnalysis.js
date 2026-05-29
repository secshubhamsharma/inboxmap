const KNOWN_BRANDS = {
  paypal: 'paypal.com',
  amazon: 'amazon.com',
  google: 'google.com',
  microsoft: 'microsoft.com',
  apple: 'apple.com',
  netflix: 'netflix.com',
  facebook: 'facebook.com',
  instagram: 'instagram.com',
  twitter: 'twitter.com',
  linkedin: 'linkedin.com',
  dropbox: 'dropbox.com',
  stripe: 'stripe.com',
  shopify: 'shopify.com',
  github: 'github.com',
  slack: 'slack.com',
  zoom: 'zoom.us',
  spotify: 'spotify.com',
  airbnb: 'airbnb.com',
  uber: 'uber.com',
  whatsapp: 'whatsapp.com',
  wellsfargo: 'wellsfargo.com',
  chase: 'chase.com',
  hdfc: 'hdfcbank.com',
  icici: 'icicibank.com',
  sbi: 'sbi.co.in',
  flipkart: 'flipkart.com',
  swiggy: 'swiggy.com',
  zomato: 'zomato.com',
  paytm: 'paytm.com',
  razorpay: 'razorpay.com',
}

function parseAuthResult(header) {
  if (!header) return { spf: null, dkim: null, dmarc: null }
  const extract = (key) => {
    const m = header.match(new RegExp(`${key}=(pass|fail|softfail|neutral|none|permerror|temperror)`, 'i'))
    return m ? m[1].toLowerCase() : null
  }
  return {
    spf: extract('spf'),
    dkim: extract('dkim'),
    dmarc: extract('dmarc'),
  }
}

function isAuthFail(auth) {
  const fail = (v) => v && v !== 'pass' && v !== 'none' && v !== 'neutral'
  return fail(auth.spf) || fail(auth.dkim) || fail(auth.dmarc)
}

function checkSpoofing(displayName, senderEmail) {
  if (!displayName || !senderEmail) return false
  const domain = senderEmail.split('@')[1]?.toLowerCase() || ''
  const nameClean = displayName.toLowerCase().replace(/[^a-z0-9]/g, '')

  for (const [brand, trustedDomain] of Object.entries(KNOWN_BRANDS)) {
    if (nameClean.includes(brand) && !domain.endsWith(trustedDomain)) {
      return { brand, trustedDomain, actualDomain: domain }
    }
  }
  return false
}

export function analyzeSenders(rawMessages) {
  const senderStats = {}

  for (const msg of rawMessages) {
    if (!msg) continue
    const email = msg.fromEmail?.toLowerCase()
    if (!email) continue

    const auth = parseAuthResult(msg.authResults)
    const fail = isAuthFail(auth)
    const spoof = checkSpoofing(msg.fromName, email)

    if (!senderStats[email]) {
      senderStats[email] = {
        email,
        name: msg.fromName,
        total: 0,
        authFailCount: 0,
        spf: auth.spf,
        dkim: auth.dkim,
        dmarc: auth.dmarc,
        spoofing: spoof,
        isSuspicious: false,
      }
    }

    senderStats[email].total++
    if (fail) senderStats[email].authFailCount++
  }

  for (const s of Object.values(senderStats)) {
    const failRate = s.total > 0 ? s.authFailCount / s.total : 0
    s.isSuspicious = failRate > 0.3 || !!s.spoofing
  }

  return senderStats
}

export function getSuspiciousSenders(senderStats) {
  return Object.values(senderStats)
    .filter((s) => s.isSuspicious)
    .sort((a, b) => b.authFailCount - a.authFailCount)
}

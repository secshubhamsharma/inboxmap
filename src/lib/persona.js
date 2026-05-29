const PERSONAS = [
  {
    id: 'builder',
    name: 'The Curious Builder',
    emoji: '🔧',
    desc: 'You live in your tools. Most of your inbox is SaaS notifications, developer platforms, and tech newsletters. You sign up for every new product, mostly to explore.',
    conditions: (s) => s.notificationPct > 35 && s.newsletterPct > 20,
  },
  {
    id: 'deal_hunter',
    name: 'The Deal Hunter',
    emoji: '🛍️',
    desc: 'Your inbox is a shopping mall. Promotions dominate — you are on every retailer list, every flash sale, every coupon blast. Your unsubscribe potential is enormous.',
    conditions: (s) => s.promotionPct > 40,
  },
  {
    id: 'information_sponge',
    name: 'The Information Sponge',
    emoji: '🧠',
    desc: 'Newsletters everywhere. You have strong opinions on what content is worth following and you have accumulated a lot of it. Probably half of it goes unread.',
    conditions: (s) => s.newsletterPct > 45,
  },
  {
    id: 'social_butterfly',
    name: 'The Social Butterfly',
    emoji: '🦋',
    desc: 'Your inbox reflects your social life. Notifications from social platforms, community tools, and messaging apps form a big chunk of what arrives daily.',
    conditions: (s) => s.socialPct > 25,
  },
  {
    id: 'hoarder',
    name: 'The Digital Hoarder',
    emoji: '📦',
    desc: 'Years of signups have piled up. Many senders in your inbox are from platforms you probably forgot existed. Your ghost account rate is high — a cleanup session would dramatically change your inbox.',
    conditions: (s) => s.ghostRatio > 0.4 && s.totalAccounts > 40,
  },
  {
    id: 'minimalist',
    name: 'The Inbox Minimalist',
    emoji: '✨',
    desc: 'You keep a tight ship. Relatively few senders, mostly active, with a low noise ratio. You either unsubscribe often or are very selective about what you sign up for.',
    conditions: (s) => s.totalAccounts < 30 && s.ghostRatio < 0.2,
  },
  {
    id: 'professional',
    name: 'The Professional',
    emoji: '💼',
    desc: 'Your inbox is mostly business. Notifications, alerts, and transactional emails dominate. You use email as a utility, not a browsing experience.',
    conditions: (s) => s.notificationPct > 45 && s.newsletterPct < 20,
  },
  {
    id: 'packrat',
    name: 'The Digital Packrat',
    emoji: '🗄️',
    desc: 'High volume across all categories with a long history of signups. Your inbox has grown over many years and reflects every phase of your online life.',
    conditions: (s) => s.totalAccounts > 80 || (s.totalScanned > 1000 && s.ghostRatio > 0.3),
  },
]

const DEFAULT_PERSONA = {
  id: 'explorer',
  name: 'The Explorer',
  emoji: '🗺️',
  desc: 'Your inbox is a mix of everything — you try new things, subscribe broadly, and accumulate a diverse range of senders over time.',
  conditions: () => true,
}

export function generatePersona(senders, accounts, totalScanned) {
  if (!senders.length) return null

  const byCategory = {}
  let total = 0
  for (const s of senders) {
    byCategory[s.category] = (byCategory[s.category] || 0) + s.count
    total += s.count
  }

  const pct = (cat) => total > 0 ? Math.round(((byCategory[cat] || 0) / total) * 100) : 0

  const stats = {
    newsletterPct:   pct('Newsletter'),
    promotionPct:    pct('Promotion'),
    notificationPct: pct('Notification'),
    socialPct:       pct('Social'),
    otherPct:        pct('Other'),
    totalAccounts:   accounts.length,
    ghostRatio:      accounts.length > 0
      ? accounts.filter((a) => a.status === 'ghost').length / accounts.length
      : 0,
    totalScanned,
  }

  const persona = PERSONAS.find((p) => p.conditions(stats)) || DEFAULT_PERSONA

  const traits = []
  if (stats.newsletterPct > 30)   traits.push({ label: 'Newsletter reader',    value: `${stats.newsletterPct}% of inbox` })
  if (stats.promotionPct > 20)    traits.push({ label: 'Deal subscriber',       value: `${stats.promotionPct}% promotions` })
  if (stats.notificationPct > 30) traits.push({ label: 'Tool-heavy workflow',   value: `${stats.notificationPct}% notifications` })
  if (stats.ghostRatio > 0.3)     traits.push({ label: 'Accumulator',           value: `${Math.round(stats.ghostRatio * 100)}% ghost accounts` })
  if (stats.socialPct > 20)       traits.push({ label: 'Social networker',      value: `${stats.socialPct}% social` })
  if (accounts.length > 60)       traits.push({ label: 'Serial signer-upper',   value: `${accounts.length} discovered accounts` })

  return { ...persona, stats, traits }
}

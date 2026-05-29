const RECEIPT_TYPES = [
  {
    id: 'order',
    label: 'Orders',
    icon: '🛒',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    regex: /\b(order (confirmed?|placed|received|summary)|your order|purchase confirm|order #|order no\.?)\b/i,
  },
  {
    id: 'shipping',
    label: 'Shipping',
    icon: '📦',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    regex: /\b(has shipped|out for delivery|delivered|on its way|track your|shipment|dispatch(ed)?|arriving|in transit|picked up)\b/i,
  },
  {
    id: 'receipt',
    label: 'Receipts',
    icon: '🧾',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    regex: /\b(receipt|invoice|payment (received|confirmed|successful)|transaction|charged|billing|paid|statement)\b/i,
  },
  {
    id: 'booking',
    label: 'Bookings',
    icon: '✈️',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    regex: /\b(booking confirm|reservation confirm|itinerary|check.?in|e.?ticket|flight|hotel|your trip|stay confirm)\b/i,
  },
  {
    id: 'subscription',
    label: 'Subscriptions',
    icon: '🔄',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    regex: /\b(subscription (renewed?|confirm|activated|start)|renewal (notice|confirm)|auto.?renew|plan (activated|upgraded|downgraded)|your membership)\b/i,
  },
  {
    id: 'return',
    label: 'Returns',
    icon: '↩️',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    regex: /\b(return (initiated|confirm|approved|received)|refund (issued|processed|confirm)|exchange|credit issued)\b/i,
  },
]

export function analyzeReceipts(senders) {
  const typeMap = {}
  for (const t of RECEIPT_TYPES) typeMap[t.id] = { ...t, count: 0, senders: [] }

  for (const sender of senders) {
    if (!sender.subjects?.length) continue
    const matched = {}

    for (const { subject } of sender.subjects) {
      for (const type of RECEIPT_TYPES) {
        if (type.regex.test(subject)) {
          matched[type.id] = (matched[type.id] || 0) + 1
        }
      }
    }

    for (const [id, count] of Object.entries(matched)) {
      typeMap[id].count += count
      typeMap[id].senders.push({ email: sender.email, name: sender.name, count })
    }
  }

  const types = Object.values(typeMap)
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count)

  const totalTransactional = types.reduce((s, t) => s + t.count, 0)
  const topStores = buildTopStores(senders)

  return { types, totalTransactional, topStores }
}

function buildTopStores(senders) {
  const storeEmails = new Set()

  for (const sender of senders) {
    if (!sender.subjects?.length) continue
    const isTransactional = RECEIPT_TYPES.some((t) =>
      sender.subjects.some(({ subject }) => t.regex.test(subject))
    )
    if (isTransactional) storeEmails.add(sender.email)
  }

  return Array.from(storeEmails)
    .map((email) => senders.find((s) => s.email === email))
    .filter(Boolean)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
}

export function calculateWorthKeepingScore(account, isBreached, isSuspicious) {
  let score = 100
  if (isBreached) score -= 35
  if (isSuspicious) score -= 25
  if (account.status === 'ghost') score -= 20
  else if (account.status === 'dormant') score -= 10
  if (!account.hasUnsubscribe && account.status !== 'active') score -= 5
  if (account.totalEmails > 100 && account.status === 'ghost') score -= 10
  return Math.max(0, Math.min(100, score))
}

export function getRecommendation(score) {
  if (score >= 70) return { label: 'Keep',   color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20' }
  if (score >= 45) return { label: 'Review', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' }
  return                  { label: 'Cut',    color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20' }
}

export function calculateHealthScore(senders, totalScanned) {
  if (!senders.length) return 100
  const bulkSenders = senders.filter((s) => s.count >= 5).length
  const bulkRatio = bulkSenders / senders.length
  const topSenderDominance = senders[0]?.count / totalScanned || 0
  const score = Math.round(100 - bulkRatio * 60 - topSenderDominance * 40)
  return Math.max(5, Math.min(100, score))
}

export function getScoreLabel(score) {
  if (score >= 75)
    return {
      label: 'Healthy Inbox',
      color: 'green',
      desc: 'Your inbox is clean. Great job!',
    }
  if (score >= 50)
    return {
      label: 'Moderate Clutter',
      color: 'yellow',
      desc: 'Some bulk senders are adding noise.',
    }
  return {
    label: 'High Clutter',
    color: 'red',
    desc: 'Many senders are flooding your inbox.',
  }
}

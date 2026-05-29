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

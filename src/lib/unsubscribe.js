export function parseUnsubscribeHeader(header) {
  if (!header) return null
  const urlMatch = header.match(/<(https?:\/\/[^>]+)>/)
  if (urlMatch) return urlMatch[1]
  const bareUrl = header.match(/(https?:\/\/\S+)/)
  if (bareUrl) return bareUrl[1].replace(/[,>].*$/, '').trim()
  return null
}

export function getUnsubscribed() {
  try {
    return JSON.parse(localStorage.getItem('inboxmap_unsubscribed') || '{}')
  } catch {
    return {}
  }
}

export function markUnsubscribed(domain) {
  const current = getUnsubscribed()
  current[domain] = Date.now()
  localStorage.setItem('inboxmap_unsubscribed', JSON.stringify(current))
}

export function isUnsubscribed(domain) {
  return !!getUnsubscribed()[domain]
}

export function getUnsubscribedCount() {
  return Object.keys(getUnsubscribed()).length
}

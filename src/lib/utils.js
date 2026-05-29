import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr, format = 'DD/MM/YYYY') {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d)) return '—'
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  if (format === 'MM/DD/YYYY') return `${month}/${day}/${year}`
  return `${day}/${month}/${year}`
}

export function formatRelative(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now - d) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return formatDate(dateStr)
}

const AVATAR_GRADIENTS = [
  'from-green-500 to-emerald-700',
  'from-blue-500 to-indigo-700',
  'from-purple-500 to-violet-700',
  'from-orange-500 to-amber-700',
  'from-pink-500 to-rose-700',
  'from-teal-500 to-cyan-700',
  'from-red-500 to-orange-700',
]

export function getSenderGradient(email) {
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    hash = (hash * 31 + email.charCodeAt(i)) & 0xffffffff
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length]
}

export function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function exportToCSV(senders, dateFormat = 'DD/MM/YYYY') {
  const header = 'Rank,Name,Email,Category,Count,Last Received,First Seen\n'
  const rows = senders
    .map(
      (s, i) =>
        `${i + 1},"${s.name.replace(/"/g, '""')}","${s.email}","${s.category}",${s.count},"${formatDate(s.lastDate, dateFormat)}","${formatDate(s.firstDate, dateFormat)}"`
    )
    .join('\n')
  const blob = new Blob([header + rows], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `inboxmap-export-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

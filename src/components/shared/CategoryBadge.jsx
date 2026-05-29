const CONFIG = {
  Newsletter: 'bg-green-500/15 text-green-400 border-green-500/20',
  Promotion: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  Social: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  Notification: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Other: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
}

export default function CategoryBadge({ category }) {
  const cls = CONFIG[category] || CONFIG.Other
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${cls}`}>
      {category}
    </span>
  )
}

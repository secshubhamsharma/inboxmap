import { cn } from '@/lib/utils'

const FILTERS = ['All', 'Newsletter', 'Promotion', 'Social', 'Notification', 'Other']

export default function FilterPills({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium transition-colors border',
            value === f
              ? 'bg-green-500/15 text-green-400 border-green-500/30'
              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
          )}
        >
          {f}
        </button>
      ))}
    </div>
  )
}

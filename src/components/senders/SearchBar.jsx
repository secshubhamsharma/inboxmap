import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative flex-1 max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search senders…"
        className="pl-9 pr-8 bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 h-9 text-sm focus-visible:ring-green-500/50"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

import { useState } from 'react'
import { ExternalLink, Check, Loader2 } from 'lucide-react'
import { markUnsubscribed, isUnsubscribed } from '@/lib/unsubscribe'
import { cn } from '@/lib/utils'

export default function UnsubscribeButton({ domain, url, compact = false }) {
  const [done, setDone] = useState(isUnsubscribed(domain))
  const [loading, setLoading] = useState(false)

  if (!url) return null

  async function handle() {
    if (done) return
    setLoading(true)
    window.open(url, '_blank', 'noopener,noreferrer')
    await new Promise((r) => setTimeout(r, 800))
    markUnsubscribed(domain)
    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <span className={cn(
        'inline-flex items-center gap-1.5 rounded-lg font-medium text-green-400 bg-green-500/10 border border-green-500/20',
        compact ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5'
      )}>
        <Check className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} strokeWidth={3} />
        Unsubscribed
      </span>
    )
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg font-medium transition-all border',
        'bg-zinc-800 hover:bg-red-500/10 text-zinc-300 hover:text-red-400 border-zinc-700 hover:border-red-500/30',
        compact ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5'
      )}
    >
      {loading
        ? <Loader2 className={cn('animate-spin', compact ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
        : <ExternalLink className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      }
      Unsubscribe
    </button>
  )
}

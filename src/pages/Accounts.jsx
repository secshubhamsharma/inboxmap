import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Building2, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useApp } from '@/context/AppContext'
import AccountCard from '@/components/accounts/AccountCard'
import EmptyState from '@/components/shared/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const FILTERS = [
  { key: 'all',     label: 'All' },
  { key: 'account', label: 'Confirmed accounts' },
  { key: 'active',  label: 'Active' },
  { key: 'dormant', label: 'Dormant' },
  { key: 'ghost',   label: 'Ghost' },
  { key: 'unsub',   label: 'Has unsubscribe' },
]

export default function Accounts() {
  const { accounts, scanStatus, settings } = useApp()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    let list = accounts

    if (filter === 'account') list = list.filter((a) => a.isAccountEmail)
    else if (filter === 'active')  list = list.filter((a) => a.status === 'active')
    else if (filter === 'dormant') list = list.filter((a) => a.status === 'dormant')
    else if (filter === 'ghost')   list = list.filter((a) => a.status === 'ghost')
    else if (filter === 'unsub')   list = list.filter((a) => a.hasUnsubscribe)

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (a) => a.serviceName.toLowerCase().includes(q) || a.senderEmail.toLowerCase().includes(q)
      )
    }

    return list
  }, [accounts, filter, search])

  const scanning = scanStatus === 'scanning'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="p-6 space-y-5 max-w-5xl mx-auto"
    >
      <div>
        <h1 className="text-xl font-display font-bold text-zinc-50 tracking-tight">Accounts Found</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          {accounts.length} services discovered with your email address
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services…"
            className="pl-9 pr-8 bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 h-9 text-sm focus-visible:ring-green-500/50"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium transition-colors border',
                filter === f.key
                  ? 'bg-green-500/15 text-green-400 border-green-500/30'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {scanning && !accounts.length ? (
        <div className="rounded-xl border border-zinc-800/60 overflow-hidden bg-zinc-900">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-zinc-800/40">
              <Skeleton className="w-10 h-10 rounded-xl bg-zinc-800" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-32 bg-zinc-800" />
                <Skeleton className="h-3 w-48 bg-zinc-800" />
              </div>
              <Skeleton className="h-7 w-24 rounded-lg bg-zinc-800" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Building2} title="No accounts found" description="Try a different filter or search term." />
      ) : (
        <div className="rounded-xl border border-zinc-800/60 overflow-hidden bg-zinc-900">
          {filtered.map((account) => (
            <AccountCard key={account.id} account={account} dateFormat={settings.dateFormat} />
          ))}
        </div>
      )}
    </motion.div>
  )
}

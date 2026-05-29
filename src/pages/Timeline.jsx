import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'
import EmptyState from '@/components/shared/EmptyState'
import UnsubscribeButton from '@/components/accounts/UnsubscribeButton'
import { cn } from '@/lib/utils'

function buildTimeline(accounts) {
  const byYear = {}
  for (const account of accounts) {
    const date = account.signupDate || account.firstEmailDate
    if (!date) continue
    const year = new Date(date).getFullYear()
    if (!byYear[year]) byYear[year] = []
    byYear[year].push(account)
  }
  return Object.entries(byYear)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([year, accs]) => ({
      year: Number(year),
      accounts: accs.sort((a, b) => new Date(a.signupDate || a.firstEmailDate) - new Date(b.signupDate || b.firstEmailDate)),
    }))
}

function AccountPill({ account }) {
  const [imgErr, setImgErr] = useState(false)
  const initial = account.serviceName[0]?.toUpperCase() || '?'

  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-zinc-800/30 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {!imgErr ? (
            <img
              src={account.faviconUrl}
              alt={account.serviceName}
              className="w-4 h-4 object-contain"
              onError={() => setImgErr(true)}
            />
          ) : (
            <span className="text-[10px] font-bold text-zinc-400">{initial}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-zinc-300 truncate">{account.serviceName}</p>
          <p className="text-[10px] text-zinc-600 truncate">{account.totalEmails} emails</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={cn(
          'text-[10px] font-semibold px-1.5 py-0.5 rounded border',
          account.status === 'active'  ? 'bg-green-500/10 text-green-400 border-green-500/20' :
          account.status === 'dormant' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                          'bg-zinc-700/40 text-zinc-500 border-zinc-700/40'
        )}>
          {account.status}
        </span>
        <UnsubscribeButton domain={account.domain} url={account.unsubscribeUrl} compact />
      </div>
    </div>
  )
}

function YearBlock({ yearData, isFirst }) {
  const [open, setOpen] = useState(isFirst)
  const accountCount = yearData.accounts.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative pl-8"
    >
      <div className="absolute left-0 top-3.5 w-4 h-4 rounded-full bg-zinc-800 border-2 border-zinc-600 z-10" />
      <div className="absolute left-[7px] top-6 bottom-0 w-px bg-zinc-800" />

      <div className="rounded-xl border border-zinc-800/60 bg-zinc-900 overflow-hidden">
        <button
          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-zinc-800/30 transition-colors"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-lg font-display font-bold text-zinc-200 tabular-nums">{yearData.year}</span>
          <span className="text-sm text-zinc-500 font-medium flex-1 text-left">
            {accountCount} {accountCount === 1 ? 'service' : 'services'} signed up
          </span>
          {open ? <ChevronUp className="w-4 h-4 text-zinc-600" /> : <ChevronDown className="w-4 h-4 text-zinc-600" />}
        </button>

        {open && (
          <div className="px-5 pb-3 border-t border-zinc-800/40">
            {yearData.accounts.map((account) => (
              <AccountPill key={account.id} account={account} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function Timeline() {
  const { accounts } = useApp()

  const timeline = useMemo(() => buildTimeline(accounts), [accounts])

  const peakYear = useMemo(() => {
    if (!timeline.length) return null
    return timeline.reduce((best, cur) => cur.accounts.length > best.accounts.length ? cur : best)
  }, [timeline])

  const totalYears = timeline.length > 0 ? timeline[timeline.length - 1].year : null
  const earliestYear = timeline.length > 0 ? timeline[timeline.length - 1].year : null

  if (!accounts.length) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-xl font-display font-bold text-zinc-50 tracking-tight mb-6">Timeline</h1>
        <EmptyState icon={CalendarDays} title="No timeline yet" description="Run a scan to see your subscription history." />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="p-6 space-y-6 max-w-5xl mx-auto"
    >
      <div>
        <h1 className="text-xl font-display font-bold text-zinc-50 tracking-tight">Timeline</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Your subscription history — {accounts.length} services since {earliestYear}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-zinc-900 border-zinc-800/60 p-5">
          <p className="text-2xl font-display font-bold text-zinc-50">{accounts.length}</p>
          <p className="text-xs font-medium text-zinc-400 mt-1">Total services</p>
          <p className="text-xs text-zinc-600 mt-0.5">since {earliestYear}</p>
        </Card>
        {peakYear && (
          <Card className="bg-zinc-900 border-zinc-800/60 p-5">
            <p className="text-2xl font-display font-bold text-zinc-50">{peakYear.year}</p>
            <p className="text-xs font-medium text-zinc-400 mt-1">Busiest year</p>
            <p className="text-xs text-zinc-600 mt-0.5">{peakYear.accounts.length} new signups</p>
          </Card>
        )}
        <Card className="bg-zinc-900 border-zinc-800/60 p-5">
          <p className="text-2xl font-display font-bold text-zinc-50">{timeline.length}</p>
          <p className="text-xs font-medium text-zinc-400 mt-1">Active years</p>
          <p className="text-xs text-zinc-600 mt-0.5">years with email signups</p>
        </Card>
      </div>

      {peakYear && (
        <div className="rounded-xl border border-zinc-800/40 bg-zinc-900/40 p-4 flex items-center gap-3">
          <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0" />
          <p className="text-xs text-zinc-400">
            Your busiest signup year was <span className="text-zinc-200 font-semibold">{peakYear.year}</span> with{' '}
            <span className="text-zinc-200 font-semibold">{peakYear.accounts.length} new services</span> getting your email address.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {timeline.map((yearData, i) => (
          <YearBlock key={yearData.year} yearData={yearData} isFirst={i === 0} />
        ))}
      </div>
    </motion.div>
  )
}

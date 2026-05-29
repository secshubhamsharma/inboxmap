import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, ShieldCheck, ScanSearch } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'
import { buildTrackerSummary } from '@/lib/trackerDetect'
import UnsubscribeButton from '@/components/accounts/UnsubscribeButton'
import EmptyState from '@/components/shared/EmptyState'
import { cn } from '@/lib/utils'

function FaviconImg({ domain, name }) {
  const [err, setErr] = useState(false)
  if (err) return <span className="text-xs font-bold text-zinc-500">{name[0]}</span>
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
      alt={name}
      className="w-5 h-5 object-contain"
      onError={() => setErr(true)}
    />
  )
}

function TrackerRow({ entry, senders }) {
  const sender = senders.find((s) => s.email === entry.email)
  const domain = entry.email.split('@')[1] || ''
  const rootDomain = domain.split('.').slice(-2).join('.')

  return (
    <div className="flex items-center gap-4 px-5 py-3.5 border-b border-zinc-800/40 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
        <FaviconImg domain={rootDomain} name={entry.name} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-200 truncate">{entry.name}</p>
        <p className="text-xs text-zinc-600 truncate">{entry.email}</p>
      </div>

      <div className="hidden sm:flex flex-wrap gap-1.5 max-w-[220px]">
        {entry.trackers.slice(0, 3).map((t) => (
          <span key={t} className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-[10px] font-medium">
            {t}
          </span>
        ))}
        {entry.trackers.length > 3 && (
          <span className="px-2 py-0.5 bg-zinc-800 text-zinc-500 border border-zinc-700/50 rounded text-[10px]">
            +{entry.trackers.length - 3} more
          </span>
        )}
      </div>

      <div className="flex-shrink-0">
        <UnsubscribeButton domain={rootDomain} url={sender?.unsubscribeUrl} compact />
      </div>
    </div>
  )
}

function SafeRow({ entry }) {
  const domain = entry.email.split('@')[1] || ''
  const rootDomain = domain.split('.').slice(-2).join('.')

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800/30 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/40 flex items-center justify-center flex-shrink-0 overflow-hidden">
        <FaviconImg domain={rootDomain} name={entry.name} />
      </div>
      <span className="text-xs text-zinc-400 flex-1 truncate">{entry.name}</span>
      <span className="flex items-center gap-1 text-[10px] text-green-400 font-medium flex-shrink-0">
        <ShieldCheck className="w-3 h-3" /> No tracker
      </span>
    </div>
  )
}

export default function Trackers() {
  const { trackers, trackerScanStatus, senders } = useApp()
  const [showSafe, setShowSafe] = useState(false)

  const summary = useMemo(() => buildTrackerSummary(trackers), [trackers])

  const tracked    = useMemo(() => Object.values(trackers).filter((e) => e.trackers.length > 0).sort((a, b) => b.trackers.length - a.trackers.length), [trackers])
  const notTracked = useMemo(() => Object.values(trackers).filter((e) => e.sampledCount > 0 && e.trackers.length === 0), [trackers])

  const isScanning = trackerScanStatus === 'scanning'
  const isDone     = trackerScanStatus === 'done'
  const noData     = trackerScanStatus === 'idle' && !tracked.length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="p-6 space-y-6 max-w-5xl mx-auto"
    >
      <div>
        <h1 className="text-xl font-display font-bold text-zinc-50 tracking-tight">Email Trackers</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Which senders monitor when you open their emails
        </p>
      </div>

      {noData ? (
        <EmptyState icon={ScanSearch} title="No tracker scan yet" description="Run a scan — tracker detection happens automatically in the background after the main scan." />
      ) : (
        <>
          {isScanning && (
            <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800/60 rounded-xl px-5 py-4">
              <Loader2 className="w-4 h-4 text-green-400 animate-spin flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-zinc-200">Reading email content for trackers…</p>
                <p className="text-xs text-zinc-500 mt-0.5">Sampling emails in the background — results appear as they come in</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="bg-red-500/5 border-red-500/20 p-5">
              <p className="text-2xl font-display font-bold text-red-400">{summary.totalTracked}</p>
              <p className="text-xs font-medium text-zinc-400 mt-1">Tracked senders</p>
              <p className="text-xs text-zinc-600 mt-0.5">monitoring your opens</p>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800/60 p-5">
              <p className="text-2xl font-display font-bold text-green-400">{summary.totalNotTracked}</p>
              <p className="text-xs font-medium text-zinc-400 mt-1">No tracker found</p>
              <p className="text-xs text-zinc-600 mt-0.5">in sampled emails</p>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800/60 p-5">
              <p className="text-2xl font-display font-bold text-zinc-200">{summary.platformList.length}</p>
              <p className="text-xs font-medium text-zinc-400 mt-1">Tracking platforms</p>
              <p className="text-xs text-zinc-600 mt-0.5">detected in inbox</p>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800/60 p-5">
              <p className="text-2xl font-display font-bold text-zinc-200">{summary.totalSampled}</p>
              <p className="text-xs font-medium text-zinc-400 mt-1">Emails read</p>
              <p className="text-xs text-zinc-600 mt-0.5">to detect trackers</p>
            </Card>
          </div>

          {summary.platformList.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-zinc-200 mb-3">Tracking platforms in your inbox</h2>
              <div className="space-y-2">
                {summary.platformList.map((p) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400 w-32 flex-shrink-0 truncate">{p.name}</span>
                    <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${Math.round((p.count / summary.totalTracked) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500 w-16 text-right flex-shrink-0">
                      {p.count} sender{p.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tracked.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-red-400" />
                <h2 className="text-sm font-semibold text-zinc-200">Senders tracking your opens</h2>
              </div>
              <div className="rounded-xl border border-red-500/15 overflow-hidden bg-zinc-900">
                {tracked.map((entry) => (
                  <TrackerRow key={entry.email} entry={entry} senders={senders} />
                ))}
              </div>
            </div>
          )}

          {notTracked.length > 0 && (
            <div>
              <button
                className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-3"
                onClick={() => setShowSafe((v) => !v)}
              >
                <EyeOff className="w-3.5 h-3.5" />
                {showSafe ? 'Hide' : 'Show'} {notTracked.length} senders with no tracker detected
              </button>
              {showSafe && (
                <div className="rounded-xl border border-zinc-800/60 overflow-hidden bg-zinc-900">
                  {notTracked.map((entry) => (
                    <SafeRow key={entry.email} entry={entry} />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="rounded-xl border border-zinc-800/40 bg-zinc-900/40 p-5">
            <p className="text-xs font-semibold text-zinc-400 mb-2">How tracker detection works</p>
            <p className="text-xs text-zinc-600 leading-relaxed">
              After the main header scan completes, InboxMap reads the body content of a sample of emails (up to 2 per sender, capped at 250 total). It scans for tracking pixels — tiny 1×1 images loaded from known tracker domains when you open an email. This is the only part of InboxMap that reads email body content. The content is processed entirely in your browser and never stored or transmitted anywhere.
            </p>
          </div>
        </>
      )}
    </motion.div>
  )
}

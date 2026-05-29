import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, Lock, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'
import { getSeverity } from '@/lib/breach'
import { getSuspiciousSenders } from '@/lib/authAnalysis'
import EmptyState from '@/components/shared/EmptyState'
import { formatDate } from '@/lib/utils'

const SEVERITY_CONFIG = {
  critical: { label: 'Critical', cls: 'bg-red-500/15 text-red-400 border-red-500/25', dot: 'bg-red-400' },
  high:     { label: 'High',     cls: 'bg-orange-500/15 text-orange-400 border-orange-500/25', dot: 'bg-orange-400' },
  medium:   { label: 'Medium',   cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25', dot: 'bg-yellow-400' },
  low:      { label: 'Low',      cls: 'bg-zinc-700/50 text-zinc-400 border-zinc-700/50', dot: 'bg-zinc-400' },
}

function BreachCard({ item }) {
  const [expanded, setExpanded] = useState(false)
  const sev = getSeverity(item.breach)
  const cfg = SEVERITY_CONFIG[sev]
  const hasPasswords = item.breach.dataClasses.some((d) => d.toLowerCase().includes('password'))

  return (
    <div className="border-b border-zinc-800/40 last:border-0">
      <button
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-zinc-800/20 transition-colors text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img
            src={`https://www.google.com/s2/favicons?domain=${item.account.domain}&sz=64`}
            alt={item.account.serviceName}
            className="w-6 h-6 object-contain"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-zinc-200">{item.account.serviceName}</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${cfg.cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
            {hasPasswords && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border bg-red-500/10 text-red-400 border-red-500/25">
                Passwords exposed
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Breached {formatDate(item.breach.breachDate)} · {(item.breach.pwnCount / 1_000_000).toFixed(1)}M records
          </p>
        </div>
        <div className="flex-shrink-0 text-zinc-600">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-1 bg-zinc-900/40">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {item.breach.dataClasses.map((d) => (
              <span key={d} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded border border-zinc-700/50">
                {d}
              </span>
            ))}
          </div>
          <p
            className="text-xs text-zinc-500 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: item.breach.description.replace(/<[^>]+>/g, '') }}
          />
          <a
            href={`https://haveibeenpwned.com/PwnedWebsites#${item.breach.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-3 transition-colors"
          >
            View on HIBP <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  )
}

function SuspiciousSenderRow({ sender }) {
  return (
    <div className="flex items-start gap-4 px-5 py-4 border-b border-zinc-800/40 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <AlertTriangle className="w-4 h-4 text-orange-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-200">{sender.name || sender.email}</p>
        <p className="text-xs text-zinc-500 truncate">{sender.email}</p>
        {sender.spoofing && (
          <p className="text-xs text-orange-400 mt-1">
            Claims to be <span className="font-semibold">{sender.spoofing.brand}</span> but sent from <span className="font-semibold">{sender.spoofing.actualDomain}</span>
          </p>
        )}
        {sender.authFailCount > 0 && (
          <p className="text-xs text-zinc-500 mt-0.5">
            {sender.authFailCount} of {sender.total} emails failed authentication (SPF/DKIM/DMARC)
          </p>
        )}
      </div>
      <div className="flex-shrink-0">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
          {sender.spoofing ? 'Spoofing' : 'Auth fail'}
        </span>
      </div>
    </div>
  )
}

export default function Security() {
  const { breaches, authStats, accounts, scanStatus, settings } = useApp()

  const suspiciousSenders = useMemo(() => getSuspiciousSenders(authStats), [authStats])

  const criticalBreaches = breaches.filter((b) => getSeverity(b.breach) === 'critical')
  const highBreaches     = breaches.filter((b) => getSeverity(b.breach) === 'high')

  const securityScore = useMemo(() => {
    if (!accounts.length) return null
    let score = 100
    score -= Math.min(50, criticalBreaches.length * 15)
    score -= Math.min(30, highBreaches.length * 8)
    score -= Math.min(20, suspiciousSenders.length * 5)
    return Math.max(0, score)
  }, [breaches, suspiciousSenders, accounts])

  const hasData = accounts.length > 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="p-6 space-y-6 max-w-5xl mx-auto"
    >
      <div>
        <h1 className="text-xl font-display font-bold text-zinc-50 tracking-tight">Security Report</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Breach exposure, authentication failures, and spoofing detection
        </p>
      </div>

      {!hasData ? (
        <EmptyState icon={ShieldAlert} title="No data yet" description="Run a scan to generate your security report." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className={`p-5 border col-span-1 sm:col-span-1 ${
              securityScore >= 80 ? 'bg-green-500/5 border-green-500/20' :
              securityScore >= 50 ? 'bg-yellow-500/5 border-yellow-500/20' :
              'bg-red-500/5 border-red-500/20'
            }`}>
              <div className="flex items-center gap-3">
                {securityScore >= 70
                  ? <ShieldCheck className="w-8 h-8 text-green-400" />
                  : <ShieldAlert className="w-8 h-8 text-red-400" />
                }
                <div>
                  <p className={`text-3xl font-display font-bold ${
                    securityScore >= 80 ? 'text-green-400' :
                    securityScore >= 50 ? 'text-yellow-400' : 'text-red-400'
                  }`}>{securityScore}</p>
                  <p className="text-xs text-zinc-400 font-medium">Security score</p>
                </div>
              </div>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800/60 p-5">
              <p className="text-2xl font-display font-bold text-red-400">{breaches.length}</p>
              <p className="text-xs font-medium text-zinc-400 mt-1">Breached accounts</p>
              <p className="text-xs text-zinc-600 mt-0.5">{criticalBreaches.length} critical, {highBreaches.length} high</p>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800/60 p-5">
              <p className="text-2xl font-display font-bold text-orange-400">{suspiciousSenders.length}</p>
              <p className="text-xs font-medium text-zinc-400 mt-1">Suspicious senders</p>
              <p className="text-xs text-zinc-600 mt-0.5">spoofing or auth failures</p>
            </Card>
          </div>

          {breaches.length > 0 ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-red-400" />
                <h2 className="text-sm font-semibold text-zinc-200">Data breaches involving your accounts</h2>
              </div>
              <div className="rounded-xl border border-zinc-800/60 overflow-hidden bg-zinc-900">
                {breaches.map((item) => (
                  <BreachCard key={item.account.id + item.breach.name} item={item} />
                ))}
              </div>
              <p className="text-xs text-zinc-600 mt-2">
                Breach data from{' '}
                <a href="https://haveibeenpwned.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2">
                  Have I Been Pwned
                </a>
                {' '}· Updated regularly · No email addresses sent to HIBP
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-5 py-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-400">No known breaches found</p>
                <p className="text-xs text-zinc-500 mt-0.5">None of your {accounts.length} discovered services appear in the HIBP breach database</p>
              </div>
            </div>
          )}

          {suspiciousSenders.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <h2 className="text-sm font-semibold text-zinc-200">Suspicious senders</h2>
              </div>
              <div className="rounded-xl border border-zinc-800/60 overflow-hidden bg-zinc-900">
                {suspiciousSenders.slice(0, 20).map((s) => (
                  <SuspiciousSenderRow key={s.email} sender={s} />
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-zinc-800/40 bg-zinc-900/40 p-5">
            <p className="text-xs font-semibold text-zinc-400 mb-2">How this works</p>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Breach detection cross-references your account domains against the public HIBP database — your email address is never sent to any external service.
              Authentication analysis reads SPF, DKIM, and DMARC results from Gmail's own headers on each message.
              Spoofing detection compares the sender's display name against their actual email domain.
              Everything runs in your browser, nothing is stored.
            </p>
          </div>
        </>
      )}
    </motion.div>
  )
}

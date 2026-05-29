import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Leaf, ShoppingBag, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'
import { generatePersona } from '@/lib/persona'
import { calculateCarbon } from '@/lib/carbon'
import { analyzeReceipts } from '@/lib/receipts'
import EmptyState from '@/components/shared/EmptyState'

function PersonaCard({ persona }) {
  const { stats } = persona
  const categories = [
    { label: 'Newsletters',   pct: stats.newsletterPct,   color: 'bg-green-500' },
    { label: 'Promotions',    pct: stats.promotionPct,    color: 'bg-orange-500' },
    { label: 'Notifications', pct: stats.notificationPct, color: 'bg-blue-500' },
    { label: 'Social',        pct: stats.socialPct,       color: 'bg-purple-500' },
    { label: 'Other',         pct: stats.otherPct,        color: 'bg-zinc-500' },
  ].filter((c) => c.pct > 0)

  return (
    <Card className="bg-zinc-900 border-zinc-800/60 p-6 col-span-full">
      <div className="flex items-start gap-5">
        <div className="text-5xl flex-shrink-0 mt-1">{persona.emoji}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">Your Inbox Persona</p>
          <h2 className="text-2xl font-display font-bold text-zinc-50 tracking-tight">{persona.name}</h2>
          <p className="text-zinc-400 text-sm mt-2 leading-relaxed max-w-xl">{persona.desc}</p>

          <div className="mt-5 space-y-2.5">
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Email breakdown</p>
            <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
              {categories.map((c) => (
                <div
                  key={c.label}
                  className={`${c.color} transition-all`}
                  style={{ width: `${c.pct}%` }}
                  title={`${c.label}: ${c.pct}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              {categories.map((c) => (
                <div key={c.label} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${c.color}`} />
                  <span className="text-xs text-zinc-400">{c.label} <span className="text-zinc-500">{c.pct}%</span></span>
                </div>
              ))}
            </div>
          </div>

          {persona.traits.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {persona.traits.map((t) => (
                <span key={t.label} className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800 border border-zinc-700/50 rounded-full text-xs text-zinc-300">
                  <span className="font-medium">{t.label}</span>
                  <span className="text-zinc-500">·</span>
                  <span className="text-zinc-500">{t.value}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

function CarbonCard({ carbon }) {
  const eq = carbon.equivalents[0]
  return (
    <Card className="bg-zinc-900 border-zinc-800/60 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
          <Leaf className="w-4 h-4 text-green-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200">Carbon Footprint</h3>
      </div>
      <p className="text-3xl font-display font-bold text-green-400">{carbon.totalKg} kg</p>
      <p className="text-xs text-zinc-500 mt-1">CO₂ from your inbox this scan</p>

      {eq && (
        <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
          Equivalent to driving <span className="text-zinc-200 font-medium">{eq.value} km</span> or watching <span className="text-zinc-200 font-medium">{carbon.equivalents[2]?.value}h</span> of streaming video.
        </p>
      )}

      {carbon.savingsKg > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <p className="text-xs text-zinc-500">Cutting dead-weight senders saves</p>
          <p className="text-lg font-display font-bold text-green-400 mt-0.5">{carbon.savingsKg} kg <span className="text-sm font-medium text-zinc-400">CO₂ / year</span></p>
          <div className="mt-2 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${carbon.savingsPct}%` }} />
          </div>
          <p className="text-xs text-zinc-600 mt-1">{carbon.savingsPct}% reduction possible</p>
        </div>
      )}
    </Card>
  )
}

function ReceiptsCard({ receipts }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800/60 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <ShoppingBag className="w-4 h-4 text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200">Transactional Intelligence</h3>
      </div>
      <p className="text-3xl font-display font-bold text-zinc-50">{receipts.totalTransactional}</p>
      <p className="text-xs text-zinc-500 mt-1">transactional emails detected</p>

      <div className="mt-4 space-y-2.5">
        {receipts.types.slice(0, 4).map((t) => (
          <div key={t.id} className="flex items-center gap-2">
            <span className="text-base w-5 flex-shrink-0">{t.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-xs text-zinc-400">{t.label}</span>
                <span className="text-xs font-medium text-zinc-300">{t.count}</span>
              </div>
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${t.bg.replace('bg-', 'bg-').replace('/10', '')}`}
                  style={{ width: `${Math.round((t.count / receipts.totalTransactional) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {receipts.topStores.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <p className="text-xs text-zinc-500 mb-2.5">Top stores by email volume</p>
          <div className="space-y-1.5">
            {receipts.topStores.slice(0, 4).map((s) => (
              <div key={s.email} className="flex items-center justify-between gap-2">
                <span className="text-xs text-zinc-400 truncate">{s.name}</span>
                <span className="text-xs text-zinc-600 flex-shrink-0">{s.count} emails</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

export default function Insights() {
  const { senders, accounts, totalScanned } = useApp()

  const persona  = useMemo(() => generatePersona(senders, accounts, totalScanned), [senders, accounts, totalScanned])
  const carbon   = useMemo(() => calculateCarbon(senders), [senders])
  const receipts = useMemo(() => analyzeReceipts(senders), [senders])

  if (!senders.length) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-xl font-display font-bold text-zinc-50 tracking-tight mb-6">Insights</h1>
        <EmptyState icon={Zap} title="No insights yet" description="Run a scan to generate your inbox insights." />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="p-6 space-y-5 max-w-5xl mx-auto"
    >
      <div>
        <h1 className="text-xl font-display font-bold text-zinc-50 tracking-tight">Insights</h1>
        <p className="text-xs text-zinc-500 mt-0.5">What your inbox says about you</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {persona && <PersonaCard persona={persona} />}
        <CarbonCard carbon={carbon} />
        {receipts.totalTransactional > 0 && <ReceiptsCard receipts={receipts} />}
      </div>
    </motion.div>
  )
}

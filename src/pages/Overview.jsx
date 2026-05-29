import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, Ghost, Clock4, Unlink, ArrowRight, Mail, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'
import { useGmailScan } from '@/hooks/useGmailScan'
import { getUnsubscribedCount } from '@/lib/unsubscribe'
import AccountCard from '@/components/accounts/AccountCard'
import VolumeLineChart from '@/components/charts/VolumeLineChart'
import LoadingScreen from '@/components/shared/LoadingScreen'
import EmptyState from '@/components/shared/EmptyState'
import { formatRelative } from '@/lib/utils'

function AttentionCost({ totalEmails }) {
  const seconds = totalEmails * 8
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return hours > 0 ? `~${hours}h ${minutes}m` : `~${minutes} min`
}

export default function Overview() {
  const { scanStatus, accounts, senders, totalScanned, lastScanned, settings } = useApp()
  const { startScan } = useGmailScan()
  const navigate = useNavigate()

  useEffect(() => {
    if (scanStatus === 'idle' && settings.autoRescan) startScan()
  }, [])

  if (scanStatus === 'scanning' && !accounts.length) return <LoadingScreen />

  const ghostAccounts   = accounts.filter((a) => a.status === 'ghost')
  const dormantAccounts = accounts.filter((a) => a.status === 'dormant')
  const activeAccounts  = accounts.filter((a) => a.status === 'active')
  const unsubCount      = getUnsubscribedCount()
  const unsubAvailable  = accounts.filter((a) => a.hasUnsubscribe).length

  const STATS = [
    {
      icon: Building2,
      value: accounts.length,
      label: 'Services found',
      sub: 'companies with your email',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      to: '/app/accounts',
    },
    {
      icon: Ghost,
      value: ghostAccounts.length,
      label: 'Ghost senders',
      sub: 'inactive 6+ months',
      color: 'text-zinc-400',
      bg: 'bg-zinc-500/10',
      to: '/app/dead-weight',
    },
    {
      icon: Clock4,
      value: <AttentionCost totalEmails={totalScanned} />,
      label: 'Attention spent',
      sub: 'estimated at 8s/email',
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      to: null,
    },
    {
      icon: Unlink,
      value: `${unsubCount} / ${unsubAvailable}`,
      label: 'Unsubscribed',
      sub: 'this session',
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      to: '/app/accounts',
    },
  ]

  const isEmpty = scanStatus === 'done' && !accounts.length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="p-6 space-y-8 max-w-5xl mx-auto"
    >
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-zinc-50 tracking-tight">Dashboard</h1>
          {lastScanned && (
            <p className="text-xs text-zinc-500 mt-0.5">Last scanned {formatRelative(lastScanned)}</p>
          )}
        </div>
      </div>

      {isEmpty ? (
        <EmptyState icon={Mail} title="No data yet" description="Run a scan to discover accounts in your inbox." />
      ) : (
        <>
          {accounts.length > 0 && (
            <div className="rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-900/60 border border-zinc-800/60 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-2xl font-display font-bold text-zinc-50 tracking-tight">
                    {accounts.length} services have your email address
                  </p>
                  <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed">
                    We scanned {totalScanned.toLocaleString()} emails and found{' '}
                    <span className="text-zinc-200 font-medium">{ghostAccounts.length} ghost senders</span> that haven't emailed you in 6+ months,{' '}
                    <span className="text-zinc-200 font-medium">{dormantAccounts.length} dormant</span>, and{' '}
                    <span className="text-zinc-200 font-medium">{unsubAvailable} with one-click unsubscribe</span>.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map(({ icon: Icon, value, label, sub, color, bg, to }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Card
                  className={`bg-zinc-900 border-zinc-800/60 p-5 ${to ? 'cursor-pointer hover:bg-zinc-800/60 transition-colors' : ''}`}
                  onClick={() => to && navigate(to)}
                >
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <p className="text-2xl font-display font-bold text-zinc-50">{value}</p>
                  <p className="text-xs font-semibold text-zinc-300 mt-1">{label}</p>
                  <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {ghostAccounts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-200">Ghost senders to clean up</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Haven't emailed you in 6+ months — safe to unsubscribe</p>
                </div>
                <button
                  onClick={() => navigate('/app/dead-weight')}
                  className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="rounded-xl border border-zinc-800/60 overflow-hidden bg-zinc-900">
                {ghostAccounts.slice(0, 5).map((account) => (
                  <AccountCard key={account.id} account={account} dateFormat={settings.dateFormat} />
                ))}
              </div>
            </div>
          )}

          {activeAccounts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-200">Recently active accounts</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Services emailing you in the last 30 days</p>
                </div>
                <button
                  onClick={() => navigate('/app/accounts')}
                  className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="rounded-xl border border-zinc-800/60 overflow-hidden bg-zinc-900">
                {activeAccounts.slice(0, 5).map((account) => (
                  <AccountCard key={account.id} account={account} dateFormat={settings.dateFormat} />
                ))}
              </div>
            </div>
          )}

          <VolumeLineChart />
        </>
      )}
    </motion.div>
  )
}

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Ghost, Trash2, ExternalLink } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import AccountCard from '@/components/accounts/AccountCard'
import EmptyState from '@/components/shared/EmptyState'
import { Card } from '@/components/ui/card'
import { markUnsubscribed, isUnsubscribed } from '@/lib/unsubscribe'
import { toast } from 'sonner'

export default function DeadWeight() {
  const { accounts, settings } = useApp()
  const [bulkDone, setBulkDone] = useState(false)

  const deadAccounts = useMemo(
    () => accounts.filter((a) => a.status === 'ghost' || a.status === 'dormant').sort((a, b) => b.daysSinceLastEmail - a.daysSinceLastEmail),
    [accounts]
  )

  const unsubscribable = deadAccounts.filter((a) => a.hasUnsubscribe && !isUnsubscribed(a.domain))
  const emailsFreed = deadAccounts.reduce((sum, a) => sum + a.totalEmails, 0)
  const hoursFreed = Math.round((emailsFreed * 8) / 3600 * 10) / 10

  async function bulkUnsubscribe() {
    const todo = unsubscribable.slice(0, 5)
    for (const account of todo) {
      window.open(account.unsubscribeUrl, '_blank', 'noopener,noreferrer')
      markUnsubscribed(account.domain)
      await new Promise((r) => setTimeout(r, 600))
    }
    setBulkDone(true)
    toast.success(`Opened ${todo.length} unsubscribe pages`)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="p-6 space-y-6 max-w-5xl mx-auto"
    >
      <div>
        <h1 className="text-xl font-display font-bold text-zinc-50 tracking-tight">Dead Weight</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Services that are silently cluttering your inbox
        </p>
      </div>

      {deadAccounts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-zinc-900 border-zinc-800/60 p-5">
            <p className="text-2xl font-display font-bold text-zinc-50">{deadAccounts.length}</p>
            <p className="text-xs font-medium text-zinc-400 mt-1">Dead accounts</p>
            <p className="text-xs text-zinc-600 mt-0.5">ghost + dormant combined</p>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800/60 p-5">
            <p className="text-2xl font-display font-bold text-zinc-50">{emailsFreed.toLocaleString()}</p>
            <p className="text-xs font-medium text-zinc-400 mt-1">Emails cluttering inbox</p>
            <p className="text-xs text-zinc-600 mt-0.5">from these senders alone</p>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800/60 p-5">
            <p className="text-2xl font-display font-bold text-orange-400">{hoursFreed}h</p>
            <p className="text-xs font-medium text-zinc-400 mt-1">Attention wasted</p>
            <p className="text-xs text-zinc-600 mt-0.5">time you'll never get back</p>
          </Card>
        </div>
      )}

      {unsubscribable.length > 0 && !bulkDone && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-zinc-200">
              {unsubscribable.length} dead accounts have a one-click unsubscribe link
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              We'll open up to 5 unsubscribe pages for you in new tabs.
            </p>
          </div>
          <button
            onClick={bulkUnsubscribe}
            className="flex items-center gap-2 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            Clean up now
          </button>
        </div>
      )}

      {deadAccounts.length === 0 ? (
        <EmptyState icon={Ghost} title="No dead weight found" description="Your inbox looks clean! Run a scan to check." />
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
              Sorted by longest inactive first
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800/60 overflow-hidden bg-zinc-900">
            {deadAccounts.map((account) => (
              <AccountCard key={account.id} account={account} dateFormat={settings.dateFormat} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

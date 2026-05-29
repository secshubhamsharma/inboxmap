import { motion } from 'framer-motion'
import { Mail, Users, TrendingUp, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'
import { formatRelative } from '@/lib/utils'

export default function StatCards() {
  const { senders, totalScanned, lastScanned } = useApp()

  const categories = senders.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1
    return acc
  }, {})

  const noiseCount = (categories.Newsletter || 0) + (categories.Promotion || 0) + (categories.Notification || 0)
  const noiseRatio = senders.length ? Math.round((noiseCount / senders.length) * 100) : 0

  const stats = [
    { icon: Mail, label: 'Emails Scanned', value: totalScanned.toLocaleString(), sub: 'total messages' },
    { icon: Users, label: 'Unique Senders', value: senders.length.toLocaleString(), sub: 'distinct addresses' },
    { icon: TrendingUp, label: 'Noise Ratio', value: `${noiseRatio}%`, sub: 'bulk sender share' },
    { icon: Calendar, label: 'Last Scanned', value: lastScanned ? formatRelative(lastScanned) : '—', sub: 'inbox refresh' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, label, value, sub }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <Card className="bg-zinc-900 border-zinc-800/60 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-display font-bold text-zinc-50 mt-1.5">{value}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{sub}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-green-400" />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

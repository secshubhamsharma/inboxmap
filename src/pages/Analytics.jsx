import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import CategoryDonutChart from '@/components/charts/CategoryDonutChart'
import TopSendersBarChart from '@/components/charts/TopSendersBarChart'
import VolumeLineChart from '@/components/charts/VolumeLineChart'
import DayHeatmap from '@/components/charts/DayHeatmap'
import { Card } from '@/components/ui/card'

export default function Analytics() {
  const { senders, totalScanned } = useApp()

  const allDates = senders.flatMap((s) => s.dates)
  const avgPerDay = allDates.length
    ? Math.round(allDates.length / 30)
    : 0

  const noiseCount = senders.filter((s) =>
    ['Newsletter', 'Promotion', 'Notification'].includes(s.category)
  ).length
  const noiseRatio = senders.length
    ? Math.round((noiseCount / senders.length) * 100)
    : 0

  const topSender = senders[0]

  const dateCounts = {}
  allDates.forEach((d) => (dateCounts[d] = (dateCounts[d] || 0) + 1))
  const peakEntry = Object.entries(dateCounts).sort((a, b) => b[1] - a[1])[0]
  const peakDay = peakEntry ? peakEntry[0] : '—'

  const stats = [
    { label: 'Avg emails/day', value: avgPerDay },
    { label: 'Noise ratio', value: `${noiseRatio}%` },
    { label: 'Top sender', value: topSender?.name?.split(' ')[0] || '—' },
    { label: 'Peak day', value: peakDay.slice(5) || '—' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="p-6 space-y-6 max-w-6xl mx-auto"
    >
      <div>
        <h1 className="text-xl font-display font-bold text-zinc-50 tracking-tight">Analytics</h1>
        <p className="text-xs text-zinc-500 mt-0.5">{totalScanned.toLocaleString()} emails analyzed</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CategoryDonutChart />
        <TopSendersBarChart />
      </div>

      <VolumeLineChart />
      <DayHeatmap />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value }) => (
          <Card key={label} className="bg-zinc-900 border-zinc-800/60 p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{label}</p>
            <p className="text-xl font-display font-bold text-zinc-50 mt-1.5">{value}</p>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}

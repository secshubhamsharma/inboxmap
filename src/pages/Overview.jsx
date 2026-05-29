import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { useGmailScan } from '@/hooks/useGmailScan'
import HealthScoreRing from '@/components/dashboard/HealthScoreRing'
import StatCards from '@/components/dashboard/StatCards'
import CategoryGrid from '@/components/dashboard/CategoryGrid'
import TopSendersTable from '@/components/dashboard/TopSendersTable'
import VolumeLineChart from '@/components/charts/VolumeLineChart'
import LoadingScreen from '@/components/shared/LoadingScreen'
import EmptyState from '@/components/shared/EmptyState'
import { Mail } from 'lucide-react'
import { formatRelative } from '@/lib/utils'

export default function Overview() {
  const { scanStatus, senders, lastScanned, settings } = useApp()
  const { startScan } = useGmailScan()

  useEffect(() => {
    if (scanStatus === 'idle' && settings.autoRescan) {
      startScan()
    }
  }, [])

  if (scanStatus === 'scanning' && !senders.length) {
    return <LoadingScreen />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="p-6 space-y-6 max-w-5xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-zinc-50 tracking-tight">Overview</h1>
          {lastScanned && (
            <p className="text-xs text-zinc-500 mt-0.5">Last scanned {formatRelative(lastScanned)}</p>
          )}
        </div>
      </div>

      {scanStatus === 'done' && !senders.length ? (
        <EmptyState icon={Mail} title="No senders found" description="Your inbox appears to be empty or the scan returned no results." />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex justify-center items-start">
              <HealthScoreRing />
            </div>
            <div className="lg:col-span-2">
              <StatCards />
            </div>
          </div>

          <CategoryGrid />
          <VolumeLineChart />
          <TopSendersTable />
        </>
      )}
    </motion.div>
  )
}

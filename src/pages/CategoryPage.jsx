import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useSenders } from '@/hooks/useSenders'
import { useApp } from '@/context/AppContext'
import { exportToCSV } from '@/lib/utils'
import SendersTable from '@/components/senders/SendersTable'
import SearchBar from '@/components/senders/SearchBar'
import SortControls from '@/components/senders/SortControls'

const EMOJI = {
  Newsletter: '📰',
  Promotion: '🛍️',
  Notification: '🔔',
  Social: '💬',
}

export default function CategoryPage({ category }) {
  const { settings } = useApp()
  const { senders, allFiltered, total, search, setSearch, sortBy, setSortBy, page, setPage, totalPages, pageSize } = useSenders({ category })

  function handleExport() {
    exportToCSV(allFiltered, settings.dateFormat)
    toast.success('CSV exported successfully')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="p-6 space-y-5 max-w-6xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-zinc-50 tracking-tight">
            {EMOJI[category]} {category}s
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">{total.toLocaleString()} senders</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="border-zinc-700 text-zinc-300 hover:text-zinc-50 hover:bg-zinc-800 text-xs gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchBar value={search} onChange={setSearch} />
        <SortControls value={sortBy} onChange={setSortBy} />
      </div>

      <SendersTable
        senders={senders}
        allFiltered={allFiltered}
        showCategory={false}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        pageSize={pageSize}
      />
    </motion.div>
  )
}

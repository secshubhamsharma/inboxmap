import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import SenderAvatar from '@/components/shared/SenderAvatar'
import CategoryBadge from '@/components/shared/CategoryBadge'
import EmptyState from '@/components/shared/EmptyState'
import { useApp } from '@/context/AppContext'
import { formatDate } from '@/lib/utils'
import { Users } from 'lucide-react'

export default function SendersTable({ senders, allFiltered, showCategory = true, page, totalPages, setPage, pageSize }) {
  const { scanStatus, settings } = useApp()
  const scanning = scanStatus === 'scanning'
  const max = allFiltered?.[0]?.count || 1

  if (scanning) {
    return (
      <div className="space-y-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-900/40">
            <Skeleton className="w-4 h-3 bg-zinc-800" />
            <Skeleton className="w-9 h-9 rounded-lg bg-zinc-800" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-40 bg-zinc-800" />
              <Skeleton className="h-3 w-28 bg-zinc-800" />
            </div>
            <Skeleton className="h-5 w-20 bg-zinc-800 rounded-full" />
            <Skeleton className="h-3.5 w-10 bg-zinc-800" />
            <Skeleton className="h-3 w-16 bg-zinc-800" />
          </div>
        ))}
      </div>
    )
  }

  if (!senders.length) {
    return <EmptyState icon={Users} title="No senders found" description="Try adjusting your search or filters." />
  }

  const globalOffset = (page - 1) * pageSize

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-800/60 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800/60 bg-zinc-900/50">
              <th className="text-left text-xs text-zinc-500 font-medium px-4 py-3 w-10">#</th>
              <th className="text-left text-xs text-zinc-500 font-medium px-3 py-3">Sender</th>
              {showCategory && (
                <th className="text-left text-xs text-zinc-500 font-medium px-3 py-3 hidden sm:table-cell">Category</th>
              )}
              <th className="text-left text-xs text-zinc-500 font-medium px-3 py-3">Count</th>
              <th className="text-left text-xs text-zinc-500 font-medium px-3 py-3 hidden md:table-cell">Last received</th>
              <th className="text-left text-xs text-zinc-500 font-medium px-3 py-3 hidden lg:table-cell">First seen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40">
            {senders.map((sender, i) => (
              <tr key={sender.email} className="hover:bg-zinc-800/20 transition-colors">
                <td className="px-4 py-3 text-xs text-zinc-600">{globalOffset + i + 1}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <SenderAvatar name={sender.name} email={sender.email} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate max-w-[180px]">{sender.name}</p>
                      <p className="text-xs text-zinc-500 truncate max-w-[180px]">
                        {settings.showFullEmails ? sender.email : `@${sender.email.split('@')[1]}`}
                      </p>
                    </div>
                  </div>
                </td>
                {showCategory && (
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <CategoryBadge category={sender.category} />
                  </td>
                )}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-200">{sender.count}</span>
                    <div className="h-1 w-16 bg-zinc-800 rounded-full hidden sm:block">
                      <div
                        className="h-1 bg-green-500 rounded-full"
                        style={{ width: `${Math.max(4, (sender.count / max) * 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-xs text-zinc-400 hidden md:table-cell">
                  {formatDate(sender.lastDate, settings.dateFormat)}
                </td>
                <td className="px-3 py-3 text-xs text-zinc-500 hidden lg:table-cell">
                  {formatDate(sender.firstDate, settings.dateFormat)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-zinc-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="border-zinc-700 text-zinc-400 hover:text-zinc-200 h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="border-zinc-700 text-zinc-400 hover:text-zinc-200 h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

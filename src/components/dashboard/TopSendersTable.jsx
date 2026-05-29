import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import SenderAvatar from '@/components/shared/SenderAvatar'
import CategoryBadge from '@/components/shared/CategoryBadge'
import { useApp } from '@/context/AppContext'
import { formatDate } from '@/lib/utils'

export default function TopSendersTable() {
  const { senders, scanStatus, settings } = useApp()
  const navigate = useNavigate()
  const scanning = scanStatus === 'scanning'
  const top = senders.slice(0, 10)
  const max = top[0]?.count || 1

  return (
    <Card className="bg-zinc-900 border-zinc-800/60">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-sm font-semibold text-zinc-200">Top Senders</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/app/senders')}
          className="text-xs text-zinc-400 hover:text-zinc-200 h-7"
        >
          View all →
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {scanning ? (
          <div className="px-6 pb-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-lg bg-zinc-800" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-32 bg-zinc-800" />
                  <Skeleton className="h-3 w-24 bg-zinc-800" />
                </div>
                <Skeleton className="h-3.5 w-10 bg-zinc-800" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {top.map((sender, i) => (
              <div key={sender.email} className="flex items-center gap-3 px-6 py-3 hover:bg-zinc-800/30 transition-colors">
                <span className="text-xs text-zinc-600 w-4 text-right">{i + 1}</span>
                <SenderAvatar name={sender.name} email={sender.email} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{sender.name}</p>
                  <p className="text-xs text-zinc-500 truncate">
                    {settings.showFullEmails ? sender.email : sender.email.split('@')[1]}
                  </p>
                </div>
                <CategoryBadge category={sender.category} />
                <div className="text-right min-w-[40px]">
                  <p className="text-sm font-semibold text-zinc-200">{sender.count}</p>
                  <div className="h-1 bg-zinc-800 rounded-full mt-1 w-16">
                    <div
                      className="h-1 bg-green-500 rounded-full"
                      style={{ width: `${(sender.count / max) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-zinc-500 min-w-[70px] text-right hidden sm:block">
                  {formatDate(sender.lastDate, settings.dateFormat)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

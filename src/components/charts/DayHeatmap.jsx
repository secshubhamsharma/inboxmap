import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const WEEKS = 4

function getIntensity(count, max) {
  if (!count || !max) return 0
  return Math.ceil((count / max) * 4)
}

const INTENSITY_CLASSES = [
  'bg-zinc-800',
  'bg-green-900/60',
  'bg-green-700/60',
  'bg-green-600/70',
  'bg-green-500',
]

export default function DayHeatmap() {
  const { senders } = useApp()

  const grid = Array.from({ length: 7 }, () => Array(WEEKS).fill(0))

  senders.forEach((s) => {
    s.dates.forEach((dateStr) => {
      const d = new Date(dateStr)
      const now = new Date()
      const diffDays = Math.floor((now - d) / 86400000)
      if (diffDays < 0 || diffDays >= WEEKS * 7) return
      const dayOfWeek = (d.getDay() + 6) % 7
      const weekIdx = Math.floor(diffDays / 7)
      if (weekIdx < WEEKS) grid[dayOfWeek][WEEKS - 1 - weekIdx]++
    })
  })

  const max = Math.max(...grid.flat(), 1)

  return (
    <Card className="bg-zinc-900 border-zinc-800/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-zinc-200">Email Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <div className="flex flex-col gap-2 pt-0.5">
            {DAYS.map((d) => (
              <span key={d} className="text-xs text-zinc-500 w-8 leading-none" style={{ height: 20, lineHeight: '20px' }}>
                {d}
              </span>
            ))}
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: WEEKS }).map((_, wi) => (
              <div key={wi} className="flex flex-col gap-2">
                {DAYS.map((_, di) => {
                  const count = grid[di][wi]
                  const level = getIntensity(count, max)
                  return (
                    <div
                      key={di}
                      title={`${count} emails`}
                      className={`w-5 h-5 rounded-sm ${INTENSITY_CLASSES[level]}`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
          <div className="flex items-end gap-1 pb-0.5 pl-2">
            <span className="text-xs text-zinc-600">Less</span>
            {INTENSITY_CLASSES.map((cls, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${cls}`} />
            ))}
            <span className="text-xs text-zinc-600">More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

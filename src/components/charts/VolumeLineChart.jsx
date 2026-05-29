import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'

function getLast30Days() {
  const days = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

export default function VolumeLineChart() {
  const { senders } = useApp()

  const days = getLast30Days()
  const countMap = {}
  days.forEach((d) => (countMap[d] = 0))

  senders.forEach((s) => {
    s.dates.forEach((date) => {
      if (countMap[date] !== undefined) countMap[date]++
    })
  })

  const data = days.map((d) => ({
    date: d.slice(5),
    count: countMap[d],
  }))

  return (
    <Card className="bg-zinc-900 border-zinc-800/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-zinc-200">Email Volume — Last 30 Days</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ left: 0, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#71717a', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={4}
            />
            <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
            <Tooltip
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: 8 }}
              labelStyle={{ color: '#e4e4e7' }}
              itemStyle={{ color: '#a1a1aa' }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#22c55e' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'

export default function TopSendersBarChart() {
  const { senders } = useApp()
  const data = senders.slice(0, 20).map((s) => ({
    name: s.name.length > 18 ? s.name.slice(0, 18) + '…' : s.name,
    count: s.count,
  }))

  return (
    <Card className="bg-zinc-900 border-zinc-800/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-zinc-200">Top 20 Senders</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <XAxis type="number" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: 8 }}
              labelStyle={{ color: '#e4e4e7' }}
              itemStyle={{ color: '#a1a1aa' }}
              cursor={{ fill: '#27272a' }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === 0 ? '#22c55e' : i < 3 ? '#16a34a' : '#166534'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'

const COLORS = {
  Newsletter: '#22c55e',
  Promotion: '#f97316',
  Social: '#a855f7',
  Notification: '#3b82f6',
  Other: '#71717a',
}

export default function CategoryDonutChart() {
  const { senders } = useApp()

  const data = Object.entries(
    senders.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1
      return acc
    }, {})
  )
    .map(([name, value]) => ({ name, value }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)

  return (
    <Card className="bg-zinc-900 border-zinc-800/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-zinc-200">Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name] || '#71717a'} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: 8 }}
              labelStyle={{ color: '#e4e4e7' }}
              itemStyle={{ color: '#a1a1aa' }}
            />
            <Legend
              formatter={(value) => <span style={{ color: '#a1a1aa', fontSize: 12 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

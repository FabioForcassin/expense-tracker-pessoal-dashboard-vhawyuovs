import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts'
import { useFilteredExpenses } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { History } from 'lucide-react'

export function YearlyHistoryChart() {
  // Pass applyMonthFilter = false to get full year history ignoring Month & Year selects
  const allExpenses = useFilteredExpenses(false).filter((e) => e.primaryCategory !== 'Receitas')

  const years = ['2024', '2025', '2026']
  const data = years.map((year) => {
    const yearExpenses = allExpenses.filter((e) => e.date.startsWith(year))
    const total = yearExpenses.reduce((sum, e) => sum + e.value, 0)
    return { year, value: total, fill: 'hsl(var(--chart-3))' }
  })

  const chartConfig = {
    value: { label: 'Gasto Total' },
  }

  const formatK = (val: number) => (val > 0 ? `${(val / 1000).toFixed(1).replace('.0', '')}k` : '')

  return (
    <Card className="glass h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <History className="w-4 h-4 text-chart-3" />
          Histórico Realizado (Anual)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px] w-full mt-2">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="text-sm font-medium fill-muted-foreground"
              />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                content={<ChartTooltipContent />}
                cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.value > 0 ? entry.fill : 'hsl(var(--muted))'}
                    opacity={entry.value > 0 ? 1 : 0.2}
                  />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={formatK}
                  className="fill-foreground font-semibold text-xs"
                  offset={6}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

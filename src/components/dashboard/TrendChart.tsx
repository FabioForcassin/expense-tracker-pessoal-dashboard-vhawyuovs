import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useFilteredExpenses } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { LineChart as LineChartIcon } from 'lucide-react'

const monthNames: Record<string, string> = {
  '01': 'Jan',
  '02': 'Fev',
  '03': 'Mar',
  '04': 'Abr',
  '05': 'Mai',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Ago',
  '09': 'Set',
  '10': 'Out',
  '11': 'Nov',
  '12': 'Dez',
}

export function TrendChart() {
  const allExpenses = useFilteredExpenses(false).filter((e) => e.primaryCategory !== 'Receitas')

  const monthsMap: Record<string, number> = {}
  allExpenses.forEach((e) => {
    const month = e.date.substring(0, 7) // YYYY-MM
    monthsMap[month] = (monthsMap[month] || 0) + e.value
  })

  const sortedMonths = Object.keys(monthsMap).sort().slice(-6)

  const data = sortedMonths.map((month) => {
    const [y, m] = month.split('-')
    const daysInMonth = new Date(parseInt(y), parseInt(m), 0).getDate()
    const avgDaily = monthsMap[month] / daysInMonth

    return {
      name: `${monthNames[m]} ${y.slice(2)}`,
      avgDaily,
    }
  })

  const chartConfig = {
    avgDaily: { label: 'Média Diária', color: 'hsl(var(--chart-3))' },
  }

  return (
    <Card className="glass h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <LineChartIcon className="w-4 h-4 text-chart-3" />
          Média Diária de Gastos
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-[280px] w-full mt-2">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">Sem dados suficientes.</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-avgDaily)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-avgDaily)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  className="text-xs font-medium fill-muted-foreground"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    `R$${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`
                  }
                  className="text-xs font-medium"
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="avgDaily"
                  stroke="var(--color-avgDaily)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAvg)"
                  activeDot={{
                    r: 6,
                    fill: 'var(--color-avgDaily)',
                    stroke: 'hsl(var(--background))',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

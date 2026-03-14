import {
  Area,
  AreaChart,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  YAxis,
  ReferenceLine,
} from 'recharts'
import { useFilteredExpenses } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Activity } from 'lucide-react'

export function CumulativeSpendingChart() {
  const filteredExpenses = useFilteredExpenses(true).filter((e) => e.primaryCategory !== 'Receitas')

  const daysInMonth = 30
  let cumulative = 0

  const data = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const dailyExpenses = filteredExpenses.filter((e) => {
      const d = parseInt(e.date.split('-')[2], 10)
      return d === day
    })
    const dailyTotal = dailyExpenses.reduce((sum, e) => sum + e.value, 0)
    cumulative += dailyTotal

    return { day, value: cumulative }
  })

  const chartConfig = {
    value: { label: 'Gasto Acumulado', color: 'hsl(var(--primary))' },
  }

  return (
    <Card className="glass h-full flex flex-col">
      <CardHeader className="pb-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Evolução do Gasto (30 Dias)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 w-full min-h-[350px] mt-4 pb-2">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={3}
                tickFormatter={(val) => `${val}d`}
                className="text-xs font-medium fill-muted-foreground"
              />
              <YAxis hide domain={['dataMin', 'dataMax + 1000']} />
              <Tooltip
                content={<ChartTooltipContent />}
                cursor={{
                  stroke: 'hsl(var(--primary)/0.2)',
                  strokeWidth: 2,
                  strokeDasharray: '4 4',
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
                activeDot={{
                  r: 6,
                  fill: 'var(--color-value)',
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 2,
                }}
              />
              <ReferenceLine
                y={data[data.length - 1].value}
                stroke="hsl(var(--muted-foreground)/0.2)"
                strokeDasharray="3 3"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

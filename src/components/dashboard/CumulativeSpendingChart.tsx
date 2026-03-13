import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from 'recharts'
import { useDashboard } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

export function CumulativeSpendingChart() {
  const { expenses, selectedMonths, selectedPrimaryCat, selectedSecondaryCats, categories } =
    useDashboard()

  const allMonthExpenses = expenses.filter((e) => selectedMonths.some((m) => e.date.startsWith(m)))
  const totalReceitas =
    allMonthExpenses
      .filter((e) => e.primaryCategory === 'Receitas')
      .reduce((sum, e) => sum + e.value, 0) || 10000

  let filteredExpenses = allMonthExpenses.filter((e) => e.primaryCategory !== 'Receitas')
  let activeBudget = totalReceitas

  if (selectedPrimaryCat && selectedPrimaryCat !== 'cat_receitas') {
    const cat = categories.find((c) => c.id === selectedPrimaryCat)
    filteredExpenses = filteredExpenses.filter((e) => e.primaryCategory === cat?.name)
    activeBudget = totalReceitas * 0.2

    if (selectedSecondaryCats.length > 0) {
      filteredExpenses = filteredExpenses.filter((e) =>
        selectedSecondaryCats.includes(e.secondaryCategory),
      )
      activeBudget = totalReceitas * 0.05
    }
  }

  // Calculate days in month (max of selected months or standard 31)
  const daysInMonth = 31

  const data = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const dailyExpenses = filteredExpenses.filter((e) => parseInt(e.date.split('-')[2]) <= day)
    const cumulative = dailyExpenses.reduce((sum, e) => sum + e.value, 0)
    const ideal = (activeBudget / daysInMonth) * day

    return { day, cumulative, ideal }
  })

  const chartConfig = {
    cumulative: { label: 'Acumulado', color: 'hsl(var(--primary))' },
    ideal: { label: 'Ritmo Seguro', color: 'hsl(var(--success)/0.5)' },
  }

  return (
    <Card className="glass mb-6 w-full h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Evolução de Gastos (Dias do Mês)</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 w-full min-h-[260px]">
        <ChartContainer config={chartConfig} className="h-full w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                minTickGap={20}
                className="text-xs font-medium"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  `R$${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`
                }
                className="text-xs font-medium"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="cumulative"
                name="cumulative"
                stroke="var(--color-cumulative)"
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: 'var(--color-cumulative)',
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 2,
                }}
              />
              <Line
                type="dashed"
                dataKey="ideal"
                name="ideal"
                stroke="var(--color-ideal)"
                strokeWidth={2}
                strokeDasharray="6 6"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

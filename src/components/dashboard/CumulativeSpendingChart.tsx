import { Line, LineChart, CartesianGrid, XAxis, Tooltip } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { useDashboard } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function CumulativeSpendingChart() {
  const { expenses, budget, selectedCategories, categories } = useDashboard()

  const activeCategories =
    selectedCategories.length > 0
      ? categories.filter((c) => selectedCategories.includes(c.id)).map((c) => c.name)
      : categories.map((c) => c.name)

  const totalBudget = activeCategories.reduce((acc, cat) => acc + (budget[cat] || 0), 0)
  const filteredExpenses = expenses.filter((e) => activeCategories.includes(e.category))

  const data = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1
    const dailyExpenses = filteredExpenses.filter((e) => parseInt(e.date.split('-')[2]) <= day)
    const cumulative = dailyExpenses.reduce((sum, e) => sum + e.value, 0)
    const ideal = (totalBudget / 31) * day

    return { day, cumulative, ideal }
  })

  const config = {
    cumulative: { label: 'Gasto Acumulado', color: 'hsl(var(--primary))' },
    ideal: { label: 'Ritmo Ideal', color: 'hsl(var(--muted-foreground)/0.5)' },
  }

  return (
    <Card className="shadow-subtle mb-6 border-border/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Evolução Diária de Gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[260px] w-full mt-4">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" opacity={0.4} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              minTickGap={20}
              className="text-xs font-medium"
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="cumulative"
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
              stroke="var(--color-ideal)"
              strokeWidth={2}
              strokeDasharray="6 6"
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

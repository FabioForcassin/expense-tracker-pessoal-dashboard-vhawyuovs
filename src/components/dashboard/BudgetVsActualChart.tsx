import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { useDashboard } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function BudgetVsActualChart() {
  const { categories, budget, expenses, selectedCategories } = useDashboard()

  const data = categories
    .filter((c) => selectedCategories.length === 0 || selectedCategories.includes(c.id))
    .map((c) => {
      const budgeted = budget[c.name] || 0
      const actual = expenses
        .filter((e) => e.category === c.name)
        .reduce((acc, e) => acc + e.value, 0)
      return { category: c.name, budgeted, actual }
    })

  const config = {
    budgeted: { label: 'Orçado', color: 'hsl(var(--muted-foreground)/0.3)' },
    actual: { label: 'Realizado', color: 'hsl(var(--primary))' },
  }

  return (
    <Card className="h-full shadow-subtle border-border/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Orçado vs Realizado</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[280px] w-full mt-4">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.4} />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              className="text-xs font-medium"
            />
            <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--muted)/0.4)' }} />
            <Bar
              dataKey="budgeted"
              fill="var(--color-budgeted)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="actual"
              fill="var(--color-actual)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

import { Pie, PieChart, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { useDashboard } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { formatCurrency } from '@/lib/format'

export function CategoryDistributionChart() {
  const { categories, expenses, selectedPrimaryCat, selectedMonths } = useDashboard()

  const filteredExpenses = expenses.filter(
    (e) => selectedMonths.some((m) => e.date.startsWith(m)) && e.primaryCategory !== 'Receitas',
  )

  let rawData = []

  if (!selectedPrimaryCat || selectedPrimaryCat === 'cat_receitas') {
    rawData = categories
      .filter((c) => c.name !== 'Receitas')
      .map((c) => ({
        name: c.name,
        value: filteredExpenses
          .filter((e) => e.primaryCategory === c.name)
          .reduce((a, b) => a + b.value, 0),
        color: c.color,
      }))
      .filter((d) => d.value > 0)
  } else {
    const cat = categories.find((c) => c.id === selectedPrimaryCat)
    if (cat && cat.name !== 'Receitas') {
      const baseHue = 262
      rawData = cat.subcategories
        .map((sub, idx) => ({
          name: sub,
          value: filteredExpenses
            .filter((e) => e.primaryCategory === cat.name && e.secondaryCategory === sub)
            .reduce((a, b) => a + b.value, 0),
          color: `hsl(${baseHue}, ${70 - idx * 5}%, ${50 + idx * 5}%)`,
        }))
        .filter((d) => d.value > 0)
    }
  }

  const chartConfig: Record<string, any> = {}
  const data = rawData.map((d, i) => {
    const key = `cat_${i}`
    chartConfig[key] = { label: d.name, color: d.color }
    return { ...d, fill: `var(--color-${key})` }
  })

  const total = data.reduce((a, b) => a + b.value, 0)

  if (total === 0) {
    return (
      <Card className="h-full glass flex flex-col">
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-semibold">Distribuição</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center min-h-[250px]">
          <p className="text-muted-foreground text-sm">Sem despesas no período.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full glass flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-semibold">Composição de Gastos</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center pb-6 min-h-[250px] relative w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="65%"
                outerRadius="90%"
                strokeWidth={4}
                stroke="hsl(var(--background))"
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
          <span className="text-xl font-bold tracking-tight text-foreground">
            {formatCurrency(total).split(',')[0]}
          </span>
          <span className="text-xs font-medium text-muted-foreground">Total</span>
        </div>
      </CardContent>
    </Card>
  )
}

import { Pie, PieChart, Tooltip, Cell, Label } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { useDashboard } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'

export function CategoryDistributionChart() {
  const { categories, expenses, selectedCategories } = useDashboard()

  const activeCategories =
    selectedCategories.length > 0
      ? categories.filter((c) => selectedCategories.includes(c.id)).map((c) => c.name)
      : categories.map((c) => c.name)

  const data = categories
    .filter((c) => activeCategories.includes(c.name))
    .map((c) => ({
      chartKey: `cat_${c.id}`,
      value: expenses.filter((e) => e.category === c.name).reduce((a, b) => a + b.value, 0),
      fill: `var(--color-cat_${c.id})`,
    }))
    .filter((d) => d.value > 0)

  const total = data.reduce((a, b) => a + b.value, 0)

  const config: Record<string, any> = {}
  categories.forEach((c) => {
    config[`cat_${c.id}`] = { label: c.name, color: c.color }
  })

  return (
    <Card className="h-full flex flex-col shadow-subtle border-border/40">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-semibold">Distribuição</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center pb-6">
        <ChartContainer config={config} className="mx-auto aspect-square max-h-[240px] mt-2">
          <PieChart>
            <Tooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="chartKey"
              innerRadius={70}
              outerRadius={95}
              strokeWidth={3}
              stroke="hsl(var(--background))"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-bold tracking-tight"
                        >
                          {formatCurrency(total).split(',')[0]}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-xs font-medium"
                        >
                          Total Gasto
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

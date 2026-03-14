import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Cell, LabelList } from 'recharts'
import { useDashboard, useFilteredExpenses } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Layers } from 'lucide-react'
import { formatCurrency } from '@/lib/format'

export function CategoryDistributionChart() {
  const { categories, selectedPrimaryCat } = useDashboard()
  const filteredExpenses = useFilteredExpenses(true).filter((e) => e.primaryCategory !== 'Receitas')

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
      .sort((a, b) => b.value - a.value)
  } else {
    const cat = categories.find((c) => c.id === selectedPrimaryCat)
    if (cat && cat.name !== 'Receitas') {
      const baseHue = 221 // Match Fintech Blue
      rawData = cat.subcategories
        .map((sub, idx) => ({
          name: sub,
          value: filteredExpenses
            .filter((e) => e.primaryCategory === cat.name && e.secondaryCategory === sub)
            .reduce((a, b) => a + b.value, 0),
          color: `hsl(${baseHue}, ${70 - idx * 5}%, ${50 + idx * 5}%)`,
        }))
        .filter((d) => d.value > 0)
        .sort((a, b) => b.value - a.value)
    }
  }

  const totalValue = rawData.reduce((acc, curr) => acc + curr.value, 0)

  const data = rawData.map((d, i) => {
    const key = `cat_${i}`
    const percentage = totalValue > 0 ? (d.value / totalValue) * 100 : 0
    return { ...d, fill: d.color, percentage, key }
  })

  const chartConfig: Record<string, any> = {
    value: { label: 'Gasto' },
  }
  data.forEach((d) => {
    chartConfig[d.key] = { label: d.name, color: d.color }
  })

  if (data.length === 0) {
    return (
      <Card className="h-full glass flex flex-col">
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Composição de Gastos
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center min-h-[280px]">
          <p className="text-muted-foreground text-sm">Sem despesas no período.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full glass flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          Composição de Gastos
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px] w-full mt-2 pr-6">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 60, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke="hsl(var(--border))"
              opacity={0.4}
            />
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              width={100}
              tickLine={false}
              axisLine={false}
              className="text-xs font-medium"
              tick={{ fill: 'hsl(var(--foreground))' }}
            />
            <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--muted)/0.3)' }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              {/* Percentage strictly inside */}
              <LabelList
                dataKey="percentage"
                position="inside"
                fill="#ffffff"
                formatter={(val: number) => `${val.toFixed(1)}%`}
                className="font-bold text-[11px]"
              />
              {/* Absolute value strictly outside right */}
              <LabelList
                dataKey="value"
                position="right"
                fill="hsl(var(--foreground))"
                formatter={(val: number) => formatCurrency(val)}
                className="font-semibold text-xs"
                offset={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

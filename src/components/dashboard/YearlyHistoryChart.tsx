import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, LabelList, Legend } from 'recharts'
import { useDashboard, useFilteredExpenses } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart'
import { History } from 'lucide-react'

export function YearlyHistoryChart() {
  const allExpenses = useFilteredExpenses(false).filter((e) => e.primaryCategory !== 'Receitas')
  const { budget, selectedPrimaryCat, selectedSecondaryCats, categories } = useDashboard()

  const years = ['2024', '2025', '2026']
  const data = years.map((year) => {
    const yearExpenses = allExpenses.filter((e) => e.date.startsWith(year))
    const realizado = yearExpenses.reduce((sum, e) => sum + e.value, 0)

    let orcamento = 0
    Object.entries(budget).forEach(([key, value]) => {
      if (key.includes(`|${year}-`)) {
        const [catName, subCatName] = key.split('|')
        if (selectedPrimaryCat) {
          const cat = categories.find((c) => c.id === selectedPrimaryCat)
          if (cat && cat.name !== catName) return
          if (selectedSecondaryCats.length > 0 && !selectedSecondaryCats.includes(subCatName))
            return
        } else {
          if (catName === 'Receitas') return
        }
        orcamento += value
      }
    })

    return { year, realizado, orcamento }
  })

  const chartConfig = {
    realizado: { label: 'Realizado', color: 'hsl(var(--destructive))' },
    orcamento: { label: 'Orçamento', color: 'hsl(var(--primary))' },
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
            <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--muted)/0.3)' }} />
            <Legend content={<ChartLegendContent />} />
            <Bar
              dataKey="realizado"
              fill="var(--color-realizado)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            >
              <LabelList
                dataKey="realizado"
                position="top"
                formatter={formatK}
                className="fill-foreground font-semibold text-xs"
                offset={6}
              />
            </Bar>
            <Bar
              dataKey="orcamento"
              fill="var(--color-orcamento)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            >
              <LabelList
                dataKey="orcamento"
                position="top"
                formatter={formatK}
                className="fill-foreground font-semibold text-xs"
                offset={6}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from 'recharts'
import { useDashboard, useFilteredExpenses } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart'
import { Scale } from 'lucide-react'

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

export function RealizedVsPredictedChart() {
  const { budget, selectedYear, categories, selectedPrimaryCat, selectedSecondaryCats } =
    useDashboard()
  const expenses = useFilteredExpenses(false).filter((e) => e.primaryCategory !== 'Receitas')

  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

  const data = months.map((m) => {
    const monthStr = `${selectedYear}-${m}`

    // Realizado
    const monthExpenses = expenses.filter((e) => e.date.startsWith(monthStr))
    const realizado = monthExpenses.reduce((sum, e) => sum + e.value, 0)

    // Orçamento/Previsto
    let previsto = 0
    Object.entries(budget).forEach(([key, value]) => {
      if (key.endsWith(`|${monthStr}`)) {
        const [catName, subCatName] = key.split('|')
        if (selectedPrimaryCat) {
          const cat = categories.find((c) => c.id === selectedPrimaryCat)
          if (cat && cat.name !== catName) return
          if (selectedSecondaryCats.length > 0 && !selectedSecondaryCats.includes(subCatName))
            return
        } else {
          if (catName === 'Receitas') return
        }
        previsto += value
      }
    })

    return {
      name: monthNames[m],
      realizado,
      previsto,
    }
  })

  const chartConfig = {
    realizado: { label: 'Realizado (Despesas)', color: 'hsl(var(--destructive))' },
    previsto: { label: 'Previsto (Orçamento)', color: 'hsl(var(--primary))' },
  }

  const formatK = (val: number) => (val > 0 ? `${(val / 1000).toFixed(1).replace('.0', '')}k` : '')

  return (
    <Card className="glass flex flex-col mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Scale className="w-5 h-5 text-primary" />
          Realizado vs. Previsto ({selectedYear})
        </CardTitle>
        <CardDescription>
          Comparação mensal entre as despesas efetivamente pagas e a meta orçamentária estabelecida.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[400px] w-full mt-2">
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
                dataKey="name"
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
              <Legend content={<ChartLegendContent />} />
              <Bar
                dataKey="realizado"
                fill="var(--color-realizado)"
                radius={[4, 4, 0, 0]}
                maxBarSize={30}
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
                dataKey="previsto"
                fill="var(--color-previsto)"
                radius={[4, 4, 0, 0]}
                maxBarSize={30}
              >
                <LabelList
                  dataKey="previsto"
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

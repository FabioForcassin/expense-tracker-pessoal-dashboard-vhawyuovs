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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart'
import { BarChart3 } from 'lucide-react'

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

export function MoMChart() {
  const allExpenses = useFilteredExpenses(false)
  const { budget, selectedPrimaryCat, selectedSecondaryCats, categories } = useDashboard()

  const allMonths = Array.from(
    new Set(
      allExpenses.map((e) => {
        const [y, m] = e.date.split('-')
        return `${y}-${m}`
      }),
    ),
  ).sort()

  const displayMonths = allMonths.slice(-6)

  const data = displayMonths.map((monthStr) => {
    const [y, m] = monthStr.split('-')
    const monthExpenses = allExpenses.filter((e) => e.date.startsWith(monthStr))

    const receitas = monthExpenses
      .filter((e) => e.primaryCategory === 'Receitas')
      .reduce((a, b) => a + b.value, 0)
    const realizado = monthExpenses
      .filter((e) => e.primaryCategory !== 'Receitas')
      .reduce((a, b) => a + b.value, 0)

    let orcamento = 0
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
        orcamento += value
      }
    })

    return {
      name: `${monthNames[m]} ${y.slice(2)}`,
      receitas,
      realizado,
      orcamento,
    }
  })

  const chartConfig = {
    receitas: { label: 'Receitas', color: 'hsl(var(--success))' },
    realizado: { label: 'Realizado', color: 'hsl(var(--destructive))' },
    orcamento: { label: 'Orçamento', color: 'hsl(var(--primary))' },
  }

  const formatK = (val: number) => (val > 0 ? `${(val / 1000).toFixed(1).replace('.0', '')}k` : '')

  return (
    <Card className="glass h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          Análise MoM (Mês a Mês)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-[280px] w-full mt-2">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">Sem dados históricos suficientes.</p>
          </div>
        ) : (
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
                  className="text-xs font-medium fill-muted-foreground"
                />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip
                  content={<ChartTooltipContent />}
                  cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                />
                <Legend content={<ChartLegendContent />} />
                <Bar
                  dataKey="receitas"
                  fill="var(--color-receitas)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={30}
                >
                  <LabelList
                    dataKey="receitas"
                    position="top"
                    formatter={formatK}
                    className="fill-foreground font-semibold text-[10px]"
                    offset={4}
                  />
                </Bar>
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
                    className="fill-foreground font-semibold text-[10px]"
                    offset={4}
                  />
                </Bar>
                <Bar
                  dataKey="orcamento"
                  fill="var(--color-orcamento)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={30}
                >
                  <LabelList
                    dataKey="orcamento"
                    position="top"
                    formatter={formatK}
                    className="fill-foreground font-semibold text-[10px]"
                    offset={4}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

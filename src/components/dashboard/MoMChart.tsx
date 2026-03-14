import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useFilteredExpenses } from '@/stores/DashboardContext'
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
    const despesas = monthExpenses
      .filter((e) => e.primaryCategory !== 'Receitas')
      .reduce((a, b) => a + b.value, 0)

    return {
      name: `${monthNames[m]} ${y.slice(2)}`,
      receitas,
      despesas,
    }
  })

  const chartConfig = {
    receitas: { label: 'Receitas', color: 'hsl(var(--success))' },
    despesas: { label: 'Despesas', color: 'hsl(var(--destructive))' },
  }

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
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    `R$${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`
                  }
                  className="text-xs font-medium"
                />
                <Tooltip
                  content={<ChartTooltipContent />}
                  cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                />
                <Legend content={<ChartLegendContent />} />
                <Bar
                  dataKey="receitas"
                  fill="var(--color-receitas)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  dataKey="despesas"
                  fill="var(--color-despesas)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

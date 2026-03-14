import { useDashboard } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart'
import {
  Area,
  ComposedChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Activity, Info } from 'lucide-react'
import { BudgetAlert } from '@/components/dashboard/BudgetAlert'

export default function Insights() {
  const { expenses, goals } = useDashboard()

  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
  const currentDay = today.getDate()

  const currentMonthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`
  const currentGoal =
    goals.find((g) => g.month === currentMonth && g.year === currentYear)?.amount || 0

  // Calculate historical average (last 3 months)
  let past3MonthsTotal = 0
  let monthsCount = 0

  for (let i = 1; i <= 3; i++) {
    let m = currentMonth - i
    let y = currentYear
    if (m <= 0) {
      m += 12
      y -= 1
    }
    const mStr = `${y}-${String(m).padStart(2, '0')}`
    const monthSpent = expenses
      .filter((e) => e.date.startsWith(mStr) && e.primaryCategory !== 'Receitas')
      .reduce((sum, e) => sum + e.value, 0)

    if (monthSpent > 0) {
      past3MonthsTotal += monthSpent
      monthsCount++
    }
  }

  const avgMonthly = monthsCount > 0 ? past3MonthsTotal / monthsCount : 0
  const projectedDaily = avgMonthly / daysInMonth

  const currentMonthExpenses = expenses.filter(
    (e) => e.date.startsWith(currentMonthStr) && e.primaryCategory !== 'Receitas',
  )

  let cumulative = 0
  const data = []

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentMonthStr}-${String(d).padStart(2, '0')}`
    const daySpent = currentMonthExpenses
      .filter((e) => e.date === dateStr)
      .reduce((sum, e) => sum + e.value, 0)

    if (d <= currentDay) {
      cumulative += daySpent
    }

    data.push({
      day: d.toString().padStart(2, '0'),
      realizado: d <= currentDay ? cumulative : null,
      projetado: projectedDaily * d,
    })
  }

  const chartConfig = {
    realizado: { label: 'Realizado (Acumulado)', color: 'hsl(var(--primary))' },
    projetado: { label: 'Tendência Projetada', color: 'hsl(var(--muted-foreground))' },
  }

  return (
    <div className="max-w-[1400px] w-full mx-auto flex flex-col gap-6 animate-fade-in pb-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 text-foreground">
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          Análise de Tendências
        </h2>
        <p className="text-muted-foreground text-sm mt-2 flex items-center gap-1.5">
          <Info className="w-4 h-4 opacity-70" />
          Visualize o ritmo dos seus gastos no mês atual e identifique tendências com base no seu
          histórico.
        </p>
      </div>

      <BudgetAlert />

      <Card className="glass overflow-hidden shadow-sm flex flex-col">
        <CardHeader className="bg-muted/30 border-b border-border/40 py-4">
          <CardTitle className="text-lg font-bold">Projeção de Gastos do Mês Atual</CardTitle>
          <CardDescription>
            Comparativo do seu gasto acumulado diário contra a projeção média dos últimos 3 meses e
            a meta definida.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 min-h-[450px]">
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="day"
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
                <Tooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                {currentGoal > 0 && (
                  <ReferenceLine
                    y={currentGoal}
                    stroke="hsl(var(--destructive))"
                    strokeDasharray="4 4"
                    label={{
                      position: 'insideTopLeft',
                      value: 'Meta do Mês',
                      fill: 'hsl(var(--destructive))',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="realizado"
                  name="Realizado (Acumulado)"
                  fill="var(--color-realizado)"
                  stroke="var(--color-realizado)"
                  strokeWidth={3}
                  fillOpacity={0.2}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="projetado"
                  name="Tendência Projetada"
                  stroke="var(--color-projetado)"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

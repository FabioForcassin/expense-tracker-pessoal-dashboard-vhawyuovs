import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from 'recharts'
import { useDashboard } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'

export function CumulativeSpendingChart() {
  const {
    expenses,
    monthlyIncome,
    currentMonth,
    selectedPrimaryCat,
    selectedSecondaryCats,
    categories,
  } = useDashboard()

  let filteredExpenses = expenses.filter((e) => e.date.startsWith(currentMonth))

  // Calculate budget proportion for the filter
  let activeBudget = monthlyIncome
  if (selectedPrimaryCat) {
    const cat = categories.find((c) => c.id === selectedPrimaryCat)
    filteredExpenses = filteredExpenses.filter((e) => e.primaryCategory === cat?.name)
    // Rough estimate of budget for category if filtered
    activeBudget = monthlyIncome * 0.3

    if (selectedSecondaryCats.length > 0) {
      filteredExpenses = filteredExpenses.filter((e) =>
        selectedSecondaryCats.includes(e.secondaryCategory),
      )
      activeBudget = monthlyIncome * 0.1
    }
  }

  // Get days in current month
  const [year, month] = currentMonth.split('-').map(Number)
  const daysInMonth = new Date(year, month, 0).getDate()

  const data = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const dailyExpenses = filteredExpenses.filter((e) => parseInt(e.date.split('-')[2]) <= day)
    const cumulative = dailyExpenses.reduce((sum, e) => sum + e.value, 0)
    const ideal = (activeBudget / daysInMonth) * day

    return { day, cumulative, ideal }
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/90 backdrop-blur-md border border-border/50 p-3 rounded-lg shadow-xl text-sm">
          <p className="font-semibold mb-2">Dia {label}</p>
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center justify-between gap-4 mb-1">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <div className="w-2 h-0.5 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name === 'cumulative' ? 'Acumulado' : 'Ritmo Ideal'}
              </span>
              <span className="font-medium text-foreground">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="glass mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Evolução Diária de Gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                minTickGap={20}
                className="text-xs font-medium"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  `R$${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`
                }
                className="text-xs font-medium"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="cumulative"
                name="cumulative"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: 'hsl(var(--primary))',
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 2,
                }}
              />
              <Line
                type="dashed"
                dataKey="ideal"
                name="ideal"
                stroke="hsl(var(--muted-foreground)/0.5)"
                strokeWidth={2}
                strokeDasharray="6 6"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

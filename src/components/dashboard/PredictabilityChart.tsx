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
import { useFilteredExpenses } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart'
import { CalendarClock } from 'lucide-react'
import { formatCurrencyK } from '@/lib/format'

const COLORS = [
  'hsl(221, 83%, 53%)',
  'hsl(180, 70%, 40%)',
  'hsl(262, 83%, 58%)',
  'hsl(199, 89%, 48%)',
  'hsl(280, 65%, 60%)',
  'hsl(160, 84%, 39%)',
  'hsl(230, 60%, 45%)',
]

const sanitizeKey = (key: string) => key.replace(/[^a-zA-Z0-9_]/g, '_')

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

export function PredictabilityChart() {
  const expenses = useFilteredExpenses(false)

  const now = new Date()
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const lastDayStr = `${lastDayOfMonth.getFullYear()}-${(lastDayOfMonth.getMonth() + 1).toString().padStart(2, '0')}-${lastDayOfMonth.getDate().toString().padStart(2, '0')}`

  const futureExpenses = expenses.filter(
    (e) => e.primaryCategory !== 'Receitas' && e.date > lastDayStr,
  )

  const methods = new Set<string>()
  const monthGroups: Record<string, Record<string, number>> = {}

  futureExpenses.forEach((e) => {
    const monthStr = e.date.substring(0, 7)
    const method = e.paymentMethod || 'Outros'
    methods.add(method)

    if (!monthGroups[monthStr]) monthGroups[monthStr] = {}
    monthGroups[monthStr][method] = (monthGroups[monthStr][method] || 0) + e.value
  })

  const sortedMonths = Object.keys(monthGroups).sort()

  const data = sortedMonths.map((monthStr) => {
    const [y, m] = monthStr.split('-')
    const item: Record<string, any> = { name: `${monthNames[m]} ${y.slice(2)}`, rawMonth: monthStr }
    Array.from(methods).forEach((method) => {
      item[sanitizeKey(method)] = monthGroups[monthStr][method] || 0
    })
    return item
  })

  const chartConfig: Record<string, any> = {}
  Array.from(methods).forEach((method, idx) => {
    chartConfig[sanitizeKey(method)] = {
      label: method,
      color: COLORS[idx % COLORS.length],
    }
  })

  return (
    <Card className="glass h-full flex flex-col border-l-4 border-l-chart-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-chart-4" />
          Previsibilidade de Parcelamento
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-[280px] w-full mt-2">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm text-center px-4">
              Nenhuma despesa futura registrada.
              <br />
              <span className="text-xs">
                Cadastre compromissos com data superior ao fim do mês atual.
              </span>
            </p>
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
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrencyK(value)}
                  className="text-xs font-medium"
                />
                <Tooltip
                  content={
                    <ChartTooltipContent formatter={(value) => formatCurrencyK(value as number)} />
                  }
                  cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                />
                <Legend content={<ChartLegendContent />} />
                {Array.from(methods).map((method) => {
                  const key = sanitizeKey(method)
                  return (
                    <Bar
                      key={key}
                      dataKey={key}
                      stackId="a"
                      fill={`var(--color-${key})`}
                      maxBarSize={40}
                    >
                      <LabelList
                        dataKey={key}
                        position="top"
                        formatter={(val: number) => (val > 0 ? formatCurrencyK(val) : '')}
                        className="fill-foreground font-semibold text-[10px]"
                        offset={4}
                      />
                    </Bar>
                  )
                })}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

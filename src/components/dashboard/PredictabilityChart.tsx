import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts'
import { useFilteredExpenses } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { CalendarClock } from 'lucide-react'
import { formatCurrency } from '@/lib/format'

export function PredictabilityChart() {
  const allExpenses = useFilteredExpenses(false).filter((e) => e.primaryCategory !== 'Receitas')

  // Future expenses logic
  const now = new Date()
  const futureExpenses = allExpenses.filter((e) => new Date(e.date) > now)

  const groups: Record<string, number> = {}
  futureExpenses.forEach((e) => {
    const acc = e.paymentMethod || 'Outros'
    groups[acc] = (groups[acc] || 0) + e.value
  })

  const data = Object.entries(groups)
    .map(([name, value]) => ({ name, value, fill: 'hsl(var(--chart-4))' }))
    .sort((a, b) => b.value - a.value)

  const chartConfig = {
    value: { label: 'Compromisso' },
  }

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
              <span className="text-xs">Cadastre compromissos com data superior a hoje.</span>
            </p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 0, right: 60, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  horizontal={true}
                  vertical={false}
                  strokeDasharray="3 3"
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
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={28}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="right"
                    formatter={(val: number) => formatCurrency(val)}
                    className="font-semibold text-xs fill-foreground"
                    offset={8}
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

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Cell, LabelList } from 'recharts'
import { useFilteredExpenses } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { CreditCard } from 'lucide-react'
import { formatCurrencyK } from '@/lib/format'

export function PaymentTypeChart() {
  const filteredExpenses = useFilteredExpenses(true).filter((e) => e.primaryCategory !== 'Receitas')

  const groups: Record<string, number> = {}
  filteredExpenses.forEach((e) => {
    const acc = e.paymentMethod || 'Outros'
    groups[acc] = (groups[acc] || 0) + e.value
  })

  const rawData = Object.entries(groups)
    .map(([name, value], idx) => ({
      name,
      value,
      fill: `hsl(221, 83%, ${53 - idx * 5}%)`,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  const chartConfig = {
    value: { label: 'Gasto' },
  }

  return (
    <Card className="glass h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" />
          Gastos por Tipo de Pgto/Conta
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-[280px] w-full mt-2">
        {rawData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">Sem dados suficientes.</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart data={rawData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
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
                tickFormatter={(val) => (val.length > 10 ? val.substring(0, 10) + '...' : val)}
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
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48}>
                {rawData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(val: number) => (val > 0 ? formatCurrencyK(val) : '')}
                  className="fill-foreground font-semibold text-[10px]"
                  offset={4}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

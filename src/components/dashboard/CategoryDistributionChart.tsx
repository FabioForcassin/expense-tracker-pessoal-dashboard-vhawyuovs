import { Pie, PieChart, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { useDashboard } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'

export function CategoryDistributionChart() {
  const { categories, expenses, selectedPrimaryCat, currentMonth } = useDashboard()

  const filteredExpenses = expenses.filter((e) => e.date.startsWith(currentMonth))

  let data = []

  if (!selectedPrimaryCat) {
    data = categories
      .map((c) => ({
        name: c.name,
        value: filteredExpenses
          .filter((e) => e.primaryCategory === c.name)
          .reduce((a, b) => a + b.value, 0),
        color: c.color,
      }))
      .filter((d) => d.value > 0)
  } else {
    const cat = categories.find((c) => c.id === selectedPrimaryCat)
    if (cat) {
      // Use different shades of primary color for subcategories
      const baseHue = 262
      data = cat.subcategories
        .map((sub, idx) => ({
          name: sub,
          value: filteredExpenses
            .filter((e) => e.primaryCategory === cat.name && e.secondaryCategory === sub)
            .reduce((a, b) => a + b.value, 0),
          color: `hsl(${baseHue}, ${70 - idx * 10}%, ${50 + idx * 5}%)`,
        }))
        .filter((d) => d.value > 0)
    }
  }

  const total = data.reduce((a, b) => a + b.value, 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0
      return (
        <div className="bg-background/90 backdrop-blur-md border border-border/50 p-3 rounded-lg shadow-xl text-sm flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span className="font-semibold">{data.name}</span>
          </div>
          <div className="flex justify-between items-center gap-4 mt-1 pl-4">
            <span className="text-foreground font-medium">{formatCurrency(data.value)}</span>
            <span className="text-muted-foreground text-xs">{percentage}%</span>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="h-full glass flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-semibold">Distribuição</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center pb-6 min-h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="65%"
              outerRadius="90%"
              strokeWidth={4}
              stroke="hsl(var(--background))"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label Custom implementation for better control */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
          <span className="text-xl font-bold tracking-tight text-foreground">
            {formatCurrency(total).split(',')[0]}
          </span>
          <span className="text-xs font-medium text-muted-foreground">Total</span>
        </div>
      </CardContent>
    </Card>
  )
}

import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, YAxis } from 'recharts'
import { useDashboard } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'

export function BudgetVsActualChart() {
  const { categories, expenses, selectedPrimaryCat, currentMonth, monthlyIncome } = useDashboard()

  const filteredExpenses = expenses.filter((e) => e.date.startsWith(currentMonth))

  // Determine what to show on X axis
  let data = []

  if (!selectedPrimaryCat) {
    // Show primary categories
    data = categories.map((c) => {
      // Create a mock planned budget per category based on total income (just for visualization purposes if no strict budget per cat exists)
      const mockWeight = {
        Moradia: 0.3,
        Alimentação: 0.25,
        Transporte: 0.15,
        Pessoal: 0.2,
        Saúde: 0.1,
      }
      const budgeted = monthlyIncome * (mockWeight[c.name as keyof typeof mockWeight] || 0.1)
      const actual = filteredExpenses
        .filter((e) => e.primaryCategory === c.name)
        .reduce((acc, e) => acc + e.value, 0)
      return { name: c.name, budgeted, actual }
    })
  } else {
    // Show secondary categories for the selected primary
    const cat = categories.find((c) => c.id === selectedPrimaryCat)
    if (cat) {
      data = cat.subcategories
        .map((sub) => {
          const actual = filteredExpenses
            .filter((e) => e.primaryCategory === cat.name && e.secondaryCategory === sub)
            .reduce((acc, e) => acc + e.value, 0)
          // Mock a budget for subcategories
          const budgeted = actual > 0 ? actual * 1.2 : 100
          return { name: sub, budgeted, actual }
        })
        .filter((d) => d.actual > 0 || d.budgeted > 0)
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/90 backdrop-blur-md border border-border/50 p-3 rounded-lg shadow-xl text-sm">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center justify-between gap-4 mb-1">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name === 'budgeted' ? 'Planejado' : 'Realizado'}
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
    <Card className="h-full glass flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Planejado vs Realizado</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-[250px]">
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
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.3)' }} />
            {/* Soft Gray for Planned */}
            <Bar
              dataKey="budgeted"
              fill="hsl(var(--muted-foreground)/0.2)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            {/* Vibrant Lilac for Actual */}
            <Bar
              dataKey="actual"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

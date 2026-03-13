import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, YAxis } from 'recharts'
import { useDashboard } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'

export function BudgetVsActualChart() {
  const { categories, expenses, selectedPrimaryCat, currentMonth } = useDashboard()

  const filteredExpenses = expenses.filter(
    (e) => e.date.startsWith(currentMonth) && e.primaryCategory !== 'Receitas',
  )
  const totalReceitas =
    expenses
      .filter((e) => e.date.startsWith(currentMonth) && e.primaryCategory === 'Receitas')
      .reduce((a, b) => a + b.value, 0) || 10000 // Fallback to avoid 0 budget

  // Determine what to show on X axis
  let data = []

  if (!selectedPrimaryCat || selectedPrimaryCat === 'cat_receitas') {
    // Show top primary expense categories
    const expenseCategories = categories.filter((c) => c.name !== 'Receitas')
    data = expenseCategories
      .map((c) => {
        // Mock planned budget per category based on historical averages or total revenue
        const mockWeight = {
          Moradia: 0.3,
          Alimentação: 0.2,
          Transporte: 0.15,
          Pessoal: 0.15,
          Saúde: 0.1,
          Educação: 0.05,
        }
        const budgeted = totalReceitas * (mockWeight[c.name as keyof typeof mockWeight] || 0.05)
        const actual = filteredExpenses
          .filter((e) => e.primaryCategory === c.name)
          .reduce((acc, e) => acc + e.value, 0)
        return { name: c.name, budgeted, actual }
      })
      .filter((d) => d.actual > 0 || d.budgeted > 0)
      .sort((a, b) => b.actual - a.actual)
      .slice(0, 6)
  } else {
    // Show secondary categories for the selected primary
    const cat = categories.find((c) => c.id === selectedPrimaryCat)
    if (cat && cat.name !== 'Receitas') {
      data = cat.subcategories
        .map((sub) => {
          const actual = filteredExpenses
            .filter((e) => e.primaryCategory === cat.name && e.secondaryCategory === sub)
            .reduce((acc, e) => acc + e.value, 0)
          // Mock a budget for subcategories based on actuals for visualization
          const budgeted = actual > 0 ? actual * 1.15 : 50
          return { name: sub, budgeted, actual }
        })
        .filter((d) => d.actual > 0 || d.budgeted > 0)
        .sort((a, b) => b.actual - a.actual)
        .slice(0, 8)
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/90 backdrop-blur-md border border-border/50 p-3 rounded-lg shadow-xl text-sm z-50">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center justify-between gap-4 mb-1">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name === 'budgeted' ? 'Planejado (Orçamento)' : 'Realizado'}
              </span>
              <span className="font-medium text-foreground">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  if (data.length === 0) {
    return (
      <Card className="h-full glass flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-muted-foreground text-sm">Sem dados de despesa para exibir.</p>
      </Card>
    )
  }

  return (
    <Card className="h-full glass flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Orçamento vs Realizado (Despesas)</CardTitle>
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

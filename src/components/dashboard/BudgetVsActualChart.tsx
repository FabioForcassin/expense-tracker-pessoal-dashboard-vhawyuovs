import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, YAxis } from 'recharts'
import { useDashboard } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

export function BudgetVsActualChart() {
  const { categories, expenses, selectedPrimaryCat, selectedMonths } = useDashboard()

  const filteredExpenses = expenses.filter(
    (e) => selectedMonths.some((m) => e.date.startsWith(m)) && e.primaryCategory !== 'Receitas',
  )
  const totalReceitas =
    expenses
      .filter(
        (e) => selectedMonths.some((m) => e.date.startsWith(m)) && e.primaryCategory === 'Receitas',
      )
      .reduce((a, b) => a + b.value, 0) || 10000

  let data = []

  if (!selectedPrimaryCat || selectedPrimaryCat === 'cat_receitas') {
    const expenseCategories = categories.filter((c) => c.name !== 'Receitas')
    data = expenseCategories
      .map((c) => {
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
    const cat = categories.find((c) => c.id === selectedPrimaryCat)
    if (cat && cat.name !== 'Receitas') {
      data = cat.subcategories
        .map((sub) => {
          const actual = filteredExpenses
            .filter((e) => e.primaryCategory === cat.name && e.secondaryCategory === sub)
            .reduce((acc, e) => acc + e.value, 0)
          const budgeted = actual > 0 ? actual * 1.15 : 50
          return { name: sub, budgeted, actual }
        })
        .filter((d) => d.actual > 0 || d.budgeted > 0)
        .sort((a, b) => b.actual - a.actual)
        .slice(0, 8)
    }
  }

  const chartConfig = {
    budgeted: { label: 'Orçamento', color: 'hsl(var(--muted-foreground)/0.2)' },
    actual: { label: 'Realizado', color: 'hsl(var(--primary))' },
  }

  if (data.length === 0) {
    return (
      <Card className="h-full glass flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-muted-foreground text-sm">
          Sem dados de despesa para exibir no período.
        </p>
      </Card>
    )
  }

  return (
    <Card className="h-full glass flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Orçamento vs Realizado (Despesas)</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-[250px] w-full">
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
              <Tooltip
                content={<ChartTooltipContent />}
                cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
              />
              <Bar
                dataKey="budgeted"
                fill="var(--color-budgeted)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey="actual"
                fill="var(--color-actual)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

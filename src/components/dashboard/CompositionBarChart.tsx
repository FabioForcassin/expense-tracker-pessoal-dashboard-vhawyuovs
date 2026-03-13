import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useDashboard } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

export function CompositionBarChart() {
  const { categories, expenses, selectedMonths, selectedPrimaryCat } = useDashboard()

  const filteredExpenses = expenses.filter(
    (e) => selectedMonths.some((m) => e.date.startsWith(m)) && e.primaryCategory !== 'Receitas',
  )

  let chartData: any[] = []
  let allSubCats = new Set<string>()

  if (!selectedPrimaryCat || selectedPrimaryCat === 'cat_receitas') {
    const expenseCategories = categories.filter((c) => c.name !== 'Receitas')
    chartData = expenseCategories
      .map((c) => {
        const catExpenses = filteredExpenses.filter((e) => e.primaryCategory === c.name)
        const dataPoint: any = { name: c.name, total: 0 }
        catExpenses.forEach((e) => {
          dataPoint[e.secondaryCategory] = (dataPoint[e.secondaryCategory] || 0) + e.value
          dataPoint.total += e.value
          allSubCats.add(e.secondaryCategory)
        })
        return dataPoint
      })
      .filter((d) => d.total > 0)
      .sort((a, b) => b.total - a.total)
  } else {
    const cat = categories.find((c) => c.id === selectedPrimaryCat)
    if (cat) {
      chartData = cat.subcategories
        .map((sub) => {
          const total = filteredExpenses
            .filter((e) => e.primaryCategory === cat.name && e.secondaryCategory === sub)
            .reduce((acc, e) => acc + e.value, 0)
          if (total > 0) allSubCats.add(sub)
          return { name: sub, [sub]: total, total }
        })
        .filter((d) => d.total > 0)
        .sort((a, b) => b.total - a.total)
    }
  }

  const subCatArray = Array.from(allSubCats)
  const baseColors = [
    'hsl(262, 83%, 58%)',
    'hsl(280, 65%, 60%)',
    'hsl(310, 65%, 60%)',
    'hsl(230, 70%, 65%)',
    'hsl(200, 80%, 50%)',
    'hsl(180, 70%, 40%)',
    'hsl(150, 84%, 40%)',
    'hsl(40, 90%, 50%)',
    'hsl(25, 95%, 50%)',
    'hsl(350, 89%, 60%)',
  ]

  const safeKey = (key: string) => key.replace(/[^a-zA-Z0-9]/g, '_')
  const chartConfig: Record<string, any> = {}

  subCatArray.forEach((sub, i) => {
    chartConfig[safeKey(sub)] = { label: sub, color: baseColors[i % baseColors.length] }
  })

  // Rename keys in data to match safe keys for ChartContainer compatibility
  const safeChartData = chartData.map((d) => {
    const safeData: any = { name: d.name, total: d.total }
    subCatArray.forEach((sub) => {
      if (d[sub]) safeData[safeKey(sub)] = d[sub]
    })
    return safeData
  })

  if (safeChartData.length === 0) {
    return (
      <Card className="h-full glass flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-muted-foreground text-sm">Sem dados de composição para exibir.</p>
      </Card>
    )
  }

  return (
    <Card className="glass h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Composição Detalhada</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={safeChartData}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={90}
                tickLine={false}
                axisLine={false}
                className="text-xs font-medium"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                content={<ChartTooltipContent />}
                cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
              />
              {subCatArray.map((sub) => (
                <Bar
                  key={sub}
                  dataKey={safeKey(sub)}
                  stackId="a"
                  fill={`var(--color-${safeKey(sub)})`}
                  radius={safeChartData.length === 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]}
                  maxBarSize={40}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

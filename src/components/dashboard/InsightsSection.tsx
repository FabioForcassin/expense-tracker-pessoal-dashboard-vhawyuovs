import { Card, CardContent } from '@/components/ui/card'
import { Lightbulb, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react'
import { useFilteredExpenses, useDashboard } from '@/stores/DashboardContext'
import { formatCurrency } from '@/lib/format'

export function InsightsSection() {
  const { selectedMonths } = useDashboard()
  const expenses = useFilteredExpenses(true).filter((e) => e.primaryCategory !== 'Receitas')
  const allExpenses = useFilteredExpenses(false).filter((e) => e.primaryCategory !== 'Receitas')

  // Fixed vs Variable (current period)
  const fixed = expenses.filter((e) => e.type === 'Fixa').reduce((a, b) => a + b.value, 0)
  const variable = expenses.filter((e) => e.type === 'Variável').reduce((a, b) => a + b.value, 0)
  const total = fixed + variable
  const fixedPerc = total > 0 ? ((fixed / total) * 100).toFixed(1) : '0'

  // Critical Alerts (Highest Category Spend)
  const categorySpend: Record<string, number> = {}
  expenses.forEach((e) => {
    categorySpend[e.primaryCategory] = (categorySpend[e.primaryCategory] || 0) + e.value
  })

  const sortedCategories = Object.entries(categorySpend).sort((a, b) => b[1] - a[1])
  const topCategory = sortedCategories.length > 0 ? sortedCategories[0] : null

  // MoM Analysis
  let momText = 'Selecione um mês para comparar o crescimento.'
  let MoMIcon = Lightbulb
  let iconColor = 'text-primary'

  if (selectedMonths.length === 1) {
    const currentMonth = selectedMonths[0]
    const [y, m] = currentMonth.split('-')
    const currentTotal = total

    let prevMonth = `${y}-${String(parseInt(m) - 1).padStart(2, '0')}`
    if (parseInt(m) === 1) {
      prevMonth = `${parseInt(y) - 1}-12`
    }

    const prevTotal = allExpenses
      .filter((e) => e.date.startsWith(prevMonth))
      .reduce((a, b) => a + b.value, 0)

    if (prevTotal > 0) {
      const growth = ((currentTotal - prevTotal) / prevTotal) * 100
      const isUp = growth > 0
      MoMIcon = isUp ? TrendingUp : TrendingDown
      iconColor = isUp ? 'text-destructive' : 'text-success'
      momText = `Despesas estão ${Math.abs(growth).toFixed(1)}% ${isUp ? 'maiores' : 'menores'} em relação a ${prevMonth}.`
    }
  } else if (selectedMonths.length > 1) {
    momText = `Análise sobre o total de ${formatCurrency(total)} no período selecionado.`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="glass border-l-4 border-l-primary">
        <CardContent className="p-4">
          <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 text-muted-foreground">
            <MoMIcon className={`w-4 h-4 ${iconColor}`} /> Comportamento M/M
          </h4>
          <p className="text-lg font-bold text-foreground truncate">{momText}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Baseado no histórico do período comparado ao mês anterior.
          </p>
        </CardContent>
      </Card>

      <Card className="glass border-l-4 border-l-destructive">
        <CardContent className="p-4">
          <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 text-muted-foreground">
            <AlertTriangle className="w-4 h-4 text-destructive" /> Ponto Crítico
          </h4>
          {topCategory ? (
            <>
              <p className="text-lg font-bold text-foreground truncate">{topCategory[0]}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                Maior impacto: {formatCurrency(topCategory[1])}. Acompanhe de perto os gastos nesta
                categoria.
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Sem dados suficientes.</p>
          )}
        </CardContent>
      </Card>

      <Card className="glass border-l-4 border-l-success">
        <CardContent className="p-4">
          <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 text-muted-foreground">
            <Lightbulb className="w-4 h-4 text-amber-500" /> Insight de Redução
          </h4>
          <p className="text-lg font-bold text-foreground">Ajuste Gastos Variáveis</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            Com {fixedPerc}% de gastos fixos, concentre-se nos {formatCurrency(variable)} flexíveis
            para fazer sobrar caixa.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

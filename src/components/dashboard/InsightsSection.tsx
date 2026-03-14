import { Card, CardContent } from '@/components/ui/card'
import { Lightbulb, TrendingDown, TrendingUp, Sparkles, Activity } from 'lucide-react'
import { useFilteredExpenses, useDashboard } from '@/stores/DashboardContext'
import { formatCurrency } from '@/lib/format'

export function InsightsSection() {
  const { selectedYear, selectedMonthValues } = useDashboard()

  // Use month filter to compute current period stats
  const expenses = useFilteredExpenses(true).filter((e) => e.primaryCategory !== 'Receitas')

  // Need all expenses to compute YoY and MoM accurately
  const allExpenses = useFilteredExpenses(false).filter((e) => e.primaryCategory !== 'Receitas')

  // Fixed vs Variable (current period)
  const fixed = expenses.filter((e) => e.type === 'Fixa').reduce((a, b) => a + b.value, 0)
  const variable = expenses.filter((e) => e.type === 'Variável').reduce((a, b) => a + b.value, 0)
  const total = fixed + variable
  const fixedPerc = total > 0 ? ((fixed / total) * 100).toFixed(1) : '0'

  const currentTotal = total

  // MoM, YoY and Fixed Growth Logic
  let momGrowth = 0
  let yoyGrowth = 0
  let fixedGrowth = 0
  let momText = 'Sem dados suficientes'
  let yoyText = 'Sem dados suficientes'
  let fixedGrowthText = 'S/ dados do mês anterior'

  let MoMIcon = Activity
  let momColor = 'text-muted-foreground'
  let YoYIcon = Activity
  let yoyColor = 'text-muted-foreground'

  if (selectedMonthValues.length === 1 && selectedYear) {
    const m = parseInt(selectedMonthValues[0])
    const y = parseInt(selectedYear)

    // Previous Month
    let prevM = m - 1
    let prevY = y
    if (prevM === 0) {
      prevM = 12
      prevY = y - 1
    }

    const prevMonthStr = `${prevY}-${String(prevM).padStart(2, '0')}`
    const prevMonthExpenses = allExpenses.filter((e) => e.date.startsWith(prevMonthStr))
    const prevTotal = prevMonthExpenses.reduce((a, b) => a + b.value, 0)
    const prevFixed = prevMonthExpenses
      .filter((e) => e.type === 'Fixa')
      .reduce((a, b) => a + b.value, 0)

    if (prevTotal > 0) {
      momGrowth = ((currentTotal - prevTotal) / prevTotal) * 100
      MoMIcon = momGrowth > 0 ? TrendingUp : TrendingDown
      momColor = momGrowth > 0 ? 'text-destructive' : 'text-success'
      momText = `${Math.abs(momGrowth).toFixed(1)}% vs Mês Anterior`
    }

    if (prevFixed > 0) {
      fixedGrowth = ((fixed - prevFixed) / prevFixed) * 100
      const isFixedUp = fixedGrowth > 0
      fixedGrowthText = `${isFixedUp ? '+' : ''}${fixedGrowth.toFixed(1)}% vs Mês Anterior`
    } else if (fixed > 0) {
      fixedGrowthText = '+100% vs Mês Anterior'
    }

    // Last Year Same Month
    const lastYearStr = `${y - 1}-${String(m).padStart(2, '0')}`
    const lastYearTotal = allExpenses
      .filter((e) => e.date.startsWith(lastYearStr))
      .reduce((a, b) => a + b.value, 0)

    if (lastYearTotal > 0) {
      yoyGrowth = ((currentTotal - lastYearTotal) / lastYearTotal) * 100
      YoYIcon = yoyGrowth > 0 ? TrendingUp : TrendingDown
      yoyColor = yoyGrowth > 0 ? 'text-destructive' : 'text-success'
      yoyText = `${Math.abs(yoyGrowth).toFixed(1)}% vs Ano Anterior`
    }
  } else if (selectedMonthValues.length > 1) {
    momText = 'Selecione apenas 1 mês p/ comparar M/M'
    yoyText = 'Selecione apenas 1 mês p/ comparar A/A'
    fixedGrowthText = 'Selecione apenas 1 mês'
  }

  // Savings Recommendation
  const categorySpend: Record<string, number> = {}
  expenses
    .filter((e) => e.type === 'Variável')
    .forEach((e) => {
      categorySpend[e.primaryCategory] = (categorySpend[e.primaryCategory] || 0) + e.value
    })
  const topVarCategory = Object.entries(categorySpend).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
      <Card className="glass">
        <CardContent className="p-4 flex flex-col justify-center h-full">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Crescimento M/M
          </h4>
          <div className="flex items-center gap-2 mb-1">
            <MoMIcon className={`w-5 h-5 ${momColor}`} />
            <p className={`text-2xl font-bold ${momColor}`}>
              {momGrowth > 0 ? '+' : ''}
              {momGrowth ? momGrowth.toFixed(1) : '0.0'}%
            </p>
          </div>
          <p className="text-xs text-muted-foreground">{momText}</p>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardContent className="p-4 flex flex-col justify-center h-full">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Crescimento A/A (YoY)
          </h4>
          <div className="flex items-center gap-2 mb-1">
            <YoYIcon className={`w-5 h-5 ${yoyColor}`} />
            <p className={`text-2xl font-bold ${yoyColor}`}>
              {yoyGrowth > 0 ? '+' : ''}
              {yoyGrowth ? yoyGrowth.toFixed(1) : '0.0'}%
            </p>
          </div>
          <p className="text-xs text-muted-foreground">{yoyText}</p>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardContent className="p-4 flex flex-col justify-center h-full">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Perfil de Gasto Fixo
          </h4>
          <p className="text-xl font-bold text-foreground mb-1">{fixedPerc}% Fixo</p>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden flex">
              <div style={{ width: `${fixedPerc}%` }} className="bg-primary h-full" />
              <div
                style={{ width: `${100 - parseFloat(fixedPerc)}%` }}
                className="bg-amber-500 h-full opacity-80"
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">Evolução Fixa:</span>
            <span
              className={`font-semibold ${fixedGrowth > 0 ? 'text-destructive' : 'text-success'}`}
            >
              {fixedGrowthText}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="glass bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardContent className="p-4 flex flex-col justify-center h-full">
          <h4 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 text-primary mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Recomendação IA
          </h4>
          {topVarCategory ? (
            <>
              <p className="text-sm font-medium text-foreground leading-tight">
                Reduza 15% em <span className="font-bold">{topVarCategory[0]}</span>.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Isso pode gerar uma economia de{' '}
                <span className="font-semibold text-success">
                  {formatCurrency(topVarCategory[1] * 0.15)}
                </span>{' '}
                no período.
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Continue assim! Não há gastos variáveis críticos.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

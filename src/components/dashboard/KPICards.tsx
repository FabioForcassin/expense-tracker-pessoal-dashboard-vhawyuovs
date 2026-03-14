import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Target, Activity } from 'lucide-react'
import { useDashboard } from '@/stores/DashboardContext'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

export function KPICards() {
  const { expenses, selectedMonths, selectedPrimaryCat, categories, selectedSecondaryCats } =
    useDashboard()

  let filteredTransactions = expenses.filter((e) =>
    selectedMonths.some((m) => e.date.startsWith(m)),
  )

  if (selectedPrimaryCat && selectedPrimaryCat !== 'cat_receitas') {
    const cat = categories.find((c) => c.id === selectedPrimaryCat)
    filteredTransactions = filteredTransactions.filter((e) => e.primaryCategory === cat?.name)

    if (selectedSecondaryCats.length > 0) {
      filteredTransactions = filteredTransactions.filter((e) =>
        selectedSecondaryCats.includes(e.secondaryCategory),
      )
    }
  }

  const totalReceitas =
    expenses
      .filter(
        (e) => selectedMonths.some((m) => e.date.startsWith(m)) && e.primaryCategory === 'Receitas',
      )
      .reduce((acc, e) => acc + e.value, 0) || 15000

  const totalDespesas = filteredTransactions
    .filter((e) => e.primaryCategory !== 'Receitas')
    .reduce((acc, e) => acc + e.value, 0)

  let orcadoGlobal = totalReceitas * 0.8
  if (selectedPrimaryCat && selectedPrimaryCat !== 'cat_receitas') {
    orcadoGlobal = totalReceitas * 0.2
    if (selectedSecondaryCats.length > 0) {
      orcadoGlobal = totalReceitas * 0.05
    }
  }

  const saldo = orcadoGlobal - totalDespesas
  const progressPerc = orcadoGlobal > 0 ? (totalDespesas / orcadoGlobal) * 100 : 0
  const isOverBudget = progressPerc > 100

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
      <Card className="glass overflow-hidden relative">
        <div className="absolute -right-6 -top-6 p-4 opacity-[0.03] pointer-events-none">
          <Target className="w-32 h-32" />
        </div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase">
              Orçado Global
            </h3>
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl backdrop-blur-sm border border-primary/10">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">
            {formatCurrency(orcadoGlobal)}
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            Meta para o período selecionado
          </p>
        </CardContent>
      </Card>

      <Card className="glass overflow-hidden relative">
        <div className="absolute -right-6 -top-6 p-4 opacity-[0.03] pointer-events-none">
          <Activity className="w-32 h-32" />
        </div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase">
              Realizado Global
            </h3>
            <div className="p-2.5 bg-orange-500/10 text-orange-600 rounded-xl backdrop-blur-sm border border-orange-500/10">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">
            {formatCurrency(totalDespesas)}
          </div>
          <div className="flex items-center gap-2">
            <Progress
              value={Math.min(progressPerc, 100)}
              className={cn(
                'h-2 flex-1',
                isOverBudget
                  ? '[&>div]:bg-destructive bg-destructive/20'
                  : '[&>div]:bg-primary bg-primary/20',
              )}
            />
            <span
              className={cn(
                'text-xs font-bold w-12 text-right',
                isOverBudget ? 'text-destructive' : 'text-primary',
              )}
            >
              {progressPerc.toFixed(1)}%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card
        className={cn(
          'glass overflow-hidden relative border-t-4',
          saldo >= 0 ? 'border-t-success' : 'border-t-destructive',
        )}
      >
        <CardContent className="p-6 relative z-10 flex flex-col justify-center h-full">
          <h3 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase mb-2">
            Diferença (Orçado - Realizado)
          </h3>
          <div
            className={cn(
              'text-2xl md:text-3xl font-bold tracking-tight mb-2 transition-colors',
              saldo >= 0 ? 'text-success' : 'text-destructive',
            )}
          >
            {saldo > 0 ? '+' : ''}
            {formatCurrency(saldo)}
          </div>
          <div>
            <span
              className={cn(
                'text-xs font-semibold px-2.5 py-1 rounded-full transition-colors',
                saldo >= 0
                  ? 'bg-success/15 text-success border border-success/20'
                  : 'bg-destructive/15 text-destructive border border-destructive/20',
              )}
            >
              {saldo >= 0 ? 'Dentro do orçamento' : 'Orçamento estourado'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

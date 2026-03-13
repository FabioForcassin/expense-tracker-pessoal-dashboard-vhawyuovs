import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, PiggyBank, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { useDashboard } from '@/stores/DashboardContext'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

export function KPICards() {
  const { expenses, currentMonth, selectedPrimaryCat, categories, selectedSecondaryCats } =
    useDashboard()

  // Filter expenses by month
  let filteredTransactions = expenses.filter((e) => e.date.startsWith(currentMonth))

  // Apply category filters
  if (selectedPrimaryCat) {
    const cat = categories.find((c) => c.id === selectedPrimaryCat)
    filteredTransactions = filteredTransactions.filter((e) => e.primaryCategory === cat?.name)

    if (selectedSecondaryCats.length > 0) {
      filteredTransactions = filteredTransactions.filter((e) =>
        selectedSecondaryCats.includes(e.secondaryCategory),
      )
    }
  }

  const totalReceitas = filteredTransactions
    .filter((e) => e.primaryCategory === 'Receitas')
    .reduce((acc, e) => acc + e.value, 0)

  const totalDespesas = filteredTransactions
    .filter((e) => e.primaryCategory !== 'Receitas')
    .reduce((acc, e) => acc + e.value, 0)

  const saldo = totalReceitas - totalDespesas
  const progressPerc = totalReceitas > 0 ? (totalDespesas / totalReceitas) * 100 : 0
  const isOverBudget = progressPerc > 100

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
      <Card className="glass overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <ArrowUpRight className="w-24 h-24" />
        </div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase">
              Receita Total
            </h3>
            <div className="p-2.5 bg-success/10 text-success rounded-xl backdrop-blur-sm">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold tracking-tight text-success mb-3">
            {formatCurrency(totalReceitas)}
          </div>
          <p className="text-xs font-medium text-muted-foreground">Entradas no mês atual</p>
        </CardContent>
      </Card>

      <Card className="glass overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <ArrowDownRight className="w-24 h-24" />
        </div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase">
              Gasto Realizado
            </h3>
            <div className="p-2.5 bg-orange-500/10 text-orange-600 rounded-xl backdrop-blur-sm">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">
            {formatCurrency(totalDespesas)}
          </div>
          <Progress
            value={Math.min(progressPerc, 100)}
            className={cn('h-2 bg-secondary', isOverBudget && '[&>div]:bg-destructive')}
          />
          <p className="text-xs font-medium text-muted-foreground mt-2">
            {progressPerc.toFixed(1)}% da receita consumida
          </p>
        </CardContent>
      </Card>

      <Card className="glass overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <PiggyBank className="w-24 h-24" />
        </div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase">
              Saldo Restante
            </h3>
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl backdrop-blur-sm">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div
            className={cn(
              'text-2xl md:text-3xl font-bold tracking-tight mb-3 transition-colors',
              saldo >= 0 ? 'text-foreground' : 'text-destructive',
            )}
          >
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
              {saldo >= 0 ? 'Superávit no período' : 'Déficit no período'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

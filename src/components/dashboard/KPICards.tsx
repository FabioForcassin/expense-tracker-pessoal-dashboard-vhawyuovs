import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Wallet, TrendingUp, PiggyBank } from 'lucide-react'
import { useDashboard } from '@/stores/DashboardContext'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

export function KPICards() {
  const { budget, expenses, selectedCategories, categories } = useDashboard()

  const activeCategories =
    selectedCategories.length > 0
      ? categories.filter((c) => selectedCategories.includes(c.id)).map((c) => c.name)
      : categories.map((c) => c.name)

  const totalBudget = activeCategories.reduce((acc, cat) => acc + (budget[cat] || 0), 0)
  const totalSpent = expenses
    .filter((e) => activeCategories.includes(e.category))
    .reduce((acc, e) => acc + e.value, 0)

  const remaining = totalBudget - totalSpent
  const progressPerc = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
  const isOverBudget = progressPerc > 100

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
      <Card className="shadow-subtle hover:shadow-md transition-shadow border-border/40">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-tight text-muted-foreground">
              Orçamento Total
            </h3>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {formatCurrency(totalBudget)}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-subtle hover:shadow-md transition-shadow border-border/40">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-tight text-muted-foreground">
              Gasto Realizado
            </h3>
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">
            {formatCurrency(totalSpent)}
          </div>
          <Progress
            value={Math.min(progressPerc, 100)}
            className={cn('h-2 bg-secondary', isOverBudget && '[&>div]:bg-destructive')}
          />
          <p className="text-xs font-medium text-muted-foreground mt-2">
            {progressPerc.toFixed(1)}% do orçamento consumido
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-subtle hover:shadow-md transition-shadow border-border/40">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-tight text-muted-foreground">
              Saldo Restante
            </h3>
            <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div
            className={cn(
              'text-2xl md:text-3xl font-bold tracking-tight mb-3',
              remaining >= 0 ? 'text-success' : 'text-destructive',
            )}
          >
            {formatCurrency(remaining)}
          </div>
          <div>
            <span
              className={cn(
                'text-xs font-semibold px-2.5 py-1 rounded-full',
                remaining >= 0
                  ? 'bg-success/15 text-success'
                  : 'bg-destructive/15 text-destructive',
              )}
            >
              {remaining >= 0 ? 'Dentro do limite planejado' : 'Orçamento excedido'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

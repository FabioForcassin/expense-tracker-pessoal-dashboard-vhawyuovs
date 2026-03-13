import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Wallet, TrendingUp, PiggyBank, Edit2, Check } from 'lucide-react'
import { useDashboard } from '@/stores/DashboardContext'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

export function KPICards() {
  const {
    expenses,
    currentMonth,
    monthlyIncome,
    setMonthlyIncome,
    selectedPrimaryCat,
    categories,
    selectedSecondaryCats,
  } = useDashboard()
  const [isEditingIncome, setIsEditingIncome] = useState(false)
  const [tempIncome, setTempIncome] = useState(monthlyIncome.toString())

  // Filter expenses by month
  let filteredExpenses = expenses.filter((e) => e.date.startsWith(currentMonth))

  // Apply category filters
  if (selectedPrimaryCat) {
    const cat = categories.find((c) => c.id === selectedPrimaryCat)
    filteredExpenses = filteredExpenses.filter((e) => e.primaryCategory === cat?.name)

    if (selectedSecondaryCats.length > 0) {
      filteredExpenses = filteredExpenses.filter((e) =>
        selectedSecondaryCats.includes(e.secondaryCategory),
      )
    }
  }

  // KPI Logic
  // If a category is selected, we might want to show its specific budget,
  // but the user story asks for Income -> Budget mapping. Let's keep total budget as Income for overview.
  // If filtered, we compare filtered spend vs total income, or we could calculate a sub-budget.
  // For simplicity, total budget remains Income.
  const totalBudget = monthlyIncome
  const totalSpent = filteredExpenses.reduce((acc, e) => acc + e.value, 0)
  const remaining = totalBudget - totalSpent
  const progressPerc = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
  const isOverBudget = progressPerc > 100

  const handleSaveIncome = () => {
    const val = parseFloat(tempIncome)
    if (!isNaN(val) && val > 0) {
      setMonthlyIncome(val)
    }
    setIsEditingIncome(false)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
      <Card className="glass overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Wallet className="w-24 h-24" />
        </div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase">
              Orçamento / Receita
            </h3>
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl backdrop-blur-sm">
              <Wallet className="w-4 h-4" />
            </div>
          </div>

          {isEditingIncome ? (
            <div className="flex items-center gap-2 mb-3">
              <Input
                type="number"
                value={tempIncome}
                onChange={(e) => setTempIncome(e.target.value)}
                className="h-9 w-32 bg-white/50 dark:bg-black/50"
                autoFocus
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 text-success hover:text-success hover:bg-success/10"
                onClick={handleSaveIncome}
              >
                <Check className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="group flex items-center gap-2 mb-3">
              <div className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {formatCurrency(totalBudget)}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsEditingIncome(true)}
              >
                <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
            </div>
          )}
          <p className="text-xs font-medium text-muted-foreground">Meta de gastos para o mês</p>
        </CardContent>
      </Card>

      <Card className="glass overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <TrendingUp className="w-24 h-24" />
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

      <Card className="glass overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <PiggyBank className="w-24 h-24" />
        </div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase">
              Saldo Restante
            </h3>
            <div className="p-2.5 bg-success/10 text-success rounded-xl backdrop-blur-sm">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div
            className={cn(
              'text-2xl md:text-3xl font-bold tracking-tight mb-3 transition-colors',
              remaining >= 0 ? 'text-success' : 'text-destructive',
            )}
          >
            {formatCurrency(remaining)}
          </div>
          <div>
            <span
              className={cn(
                'text-xs font-semibold px-2.5 py-1 rounded-full transition-colors',
                remaining >= 0
                  ? 'bg-success/15 text-success border border-success/20'
                  : 'bg-destructive/15 text-destructive border border-destructive/20',
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

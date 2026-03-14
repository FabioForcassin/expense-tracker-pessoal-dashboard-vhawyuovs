import { useDashboard } from '@/stores/DashboardContext'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'
import { formatCurrency } from '@/lib/format'

export function BudgetAlert() {
  const { goals, expenses } = useDashboard()

  const today = new Date()
  const month = today.getMonth() + 1
  const year = today.getFullYear()

  const currentGoal = goals.find((g) => g.month === month && g.year === year)
  if (!currentGoal || currentGoal.amount <= 0) return null

  const currentMonthStr = `${year}-${String(month).padStart(2, '0')}`
  const spent = expenses
    .filter((e) => e.date.startsWith(currentMonthStr) && e.primaryCategory !== 'Receitas')
    .reduce((sum, e) => sum + e.value, 0)

  const percentage = (spent / currentGoal.amount) * 100

  if (percentage >= 90) {
    return (
      <Alert
        variant="destructive"
        className="mb-6 bg-destructive/10 text-destructive border-destructive/20 animate-in fade-in slide-in-from-top-4 shadow-sm"
      >
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="text-base font-bold">Atenção ao Limite de Gastos</AlertTitle>
        <AlertDescription className="mt-1.5 font-medium text-sm">
          Você já consumiu {percentage.toFixed(1)}% ({formatCurrency(spent)}) da sua meta de
          orçamento deste mês ({formatCurrency(currentGoal.amount)}). Fique atento às suas próximas
          despesas!
        </AlertDescription>
      </Alert>
    )
  }

  return null
}

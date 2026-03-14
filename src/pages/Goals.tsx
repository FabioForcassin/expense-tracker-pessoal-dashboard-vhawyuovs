import { useState } from 'react'
import { useDashboard, useFilteredExpenses } from '@/stores/DashboardContext'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Target, TrendingUp, AlertTriangle } from 'lucide-react'
import { formatCurrency } from '@/lib/format'

export default function Goals() {
  const { goals, upsertGoal } = useDashboard()
  const allExpenses = useFilteredExpenses(false)

  const d = new Date()
  const currentMonth = d.getMonth() + 1
  const currentYear = d.getFullYear()

  const [month] = useState(currentMonth)
  const [year] = useState(currentYear)
  const [amountStr, setAmountStr] = useState('')

  const goal = goals.find((g) => g.month === month && g.year === year)

  const monthStr = `${year}-${String(month).padStart(2, '0')}`
  const spent = allExpenses
    .filter((e) => e.date.startsWith(monthStr) && e.primaryCategory !== 'Receitas')
    .reduce((a, b) => a + b.value, 0)

  const limit = goal ? goal.amount : 0
  const remaining = limit - spent
  const progress = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0

  const handleSave = () => {
    const val = parseFloat(amountStr)
    if (!isNaN(val) && val > 0) {
      upsertGoal(month, year, val)
      setAmountStr('')
    }
  }

  return (
    <div className="max-w-[1400px] w-full mx-auto flex flex-col gap-6 animate-fade-in pb-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 text-foreground">
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
            <Target className="w-6 h-6" />
          </div>
          Progresso de Metas
        </h2>
        <p className="text-muted-foreground text-sm mt-2">
          Defina limites de gastos mensais e acompanhe seu saldo disponível.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass md:col-span-1 border-primary/20 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Definir Limite</CardTitle>
            <CardDescription>Mês Atual ({monthStr})</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Orçamento Máximo (R$)</label>
              <Input
                type="number"
                placeholder={limit > 0 ? limit.toString() : 'Ex: 5000'}
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
              />
            </div>
            <Button onClick={handleSave} className="w-full" disabled={!amountStr}>
              Salvar Meta
            </Button>
          </CardContent>
        </Card>

        <Card className="glass md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Acompanhamento</CardTitle>
            <CardDescription>Progresso do orçamento definido</CardDescription>
          </CardHeader>
          <CardContent>
            {limit === 0 ? (
              <div className="h-32 flex flex-col items-center justify-center text-muted-foreground gap-2">
                <AlertTriangle className="w-8 h-8 opacity-50" />
                <p>Nenhuma meta definida para este mês.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Gasto Atual</p>
                    <p className="text-3xl font-bold text-foreground">{formatCurrency(spent)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground font-medium mb-1">Limite</p>
                    <p className="text-xl font-semibold text-muted-foreground">
                      {formatCurrency(limit)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className={progress >= 100 ? 'text-destructive' : 'text-primary'}>
                      {progress.toFixed(1)}% utilizado
                    </span>
                  </div>
                  <Progress
                    value={progress}
                    className={`h-3 ${progress >= 100 ? '[&>div]:bg-destructive bg-destructive/20' : ''}`}
                  />
                </div>

                <div
                  className={`p-4 rounded-lg border flex items-center justify-between ${remaining >= 0 ? 'bg-success/10 border-success/20 text-success' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-semibold">
                      {remaining >= 0 ? 'Saldo Restante' : 'Orçamento Estourado'}
                    </span>
                  </div>
                  <span className="text-xl font-bold">
                    {remaining > 0 ? '+' : ''}
                    {formatCurrency(remaining)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

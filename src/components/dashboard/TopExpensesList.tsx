import { useFilteredExpenses } from '@/stores/DashboardContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import { Trophy } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

export function TopExpensesList() {
  const filteredExpenses = useFilteredExpenses(true).filter((e) => e.primaryCategory !== 'Receitas')

  // Expanded to 15 top expenses
  const topExpenses = [...filteredExpenses].sort((a, b) => b.value - a.value).slice(0, 15)

  return (
    <Card className="glass h-full flex flex-col">
      <CardHeader className="pb-2 border-b border-border/40">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          Maiores Despesas (Top 15)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        {topExpenses.length === 0 ? (
          <div className="flex items-center justify-center h-[350px]">
            <p className="text-muted-foreground text-sm">Sem despesas no período.</p>
          </div>
        ) : (
          <ScrollArea className="h-[350px]">
            <div className="flex flex-col">
              {topExpenses.map((expense, i) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors border-b border-border/30 last:border-0"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                      {i + 1}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-foreground truncate max-w-[150px] sm:max-w-[200px]">
                        {expense.establishment}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {expense.primaryCategory} • {expense.secondaryCategory}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="text-sm font-bold text-foreground">
                      {formatCurrency(expense.value)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

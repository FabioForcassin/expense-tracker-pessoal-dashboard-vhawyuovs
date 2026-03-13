import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDashboard } from '@/stores/DashboardContext'
import { formatCurrency, formatDate } from '@/lib/format'
import { Home, Utensils, Car, Gamepad2, HeartPulse, MoreHorizontal } from 'lucide-react'

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Moradia: Home,
  Alimentação: Utensils,
  Transporte: Car,
  Lazer: Gamepad2,
  Saúde: HeartPulse,
}

export function TransactionsTable({ full = false }: { full?: boolean }) {
  const { expenses, selectedCategories, categories } = useDashboard()

  const activeCategories =
    selectedCategories.length > 0
      ? categories.filter((c) => selectedCategories.includes(c.id)).map((c) => c.name)
      : categories.map((c) => c.name)

  const filteredExpenses = expenses
    .filter((e) => activeCategories.includes(e.category))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const displayData = full ? filteredExpenses : filteredExpenses.slice(0, 10)

  return (
    <Card className="shadow-subtle mb-6 border-border/40">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6 sm:pt-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/40">
              <TableHead className="w-[100px] sm:w-auto">Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="hidden sm:table-cell">Categoria</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Nenhuma transação encontrada.
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((expense) => {
                const Icon = CATEGORY_ICONS[expense.category] || MoreHorizontal
                const catColor =
                  categories.find((c) => c.name === expense.category)?.color || 'currentColor'

                return (
                  <TableRow
                    key={expense.id}
                    className="hover:bg-muted/30 transition-colors border-border/30"
                  >
                    <TableCell className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap font-medium">
                      {formatDate(expense.date)}
                    </TableCell>
                    <TableCell className="font-medium text-foreground text-xs sm:text-sm">
                      {expense.description || '-'}
                      <div className="sm:hidden text-xs text-muted-foreground mt-0.5">
                        {expense.category}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="p-1.5 rounded-md"
                          style={{ backgroundColor: `${catColor}20`, color: catColor }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm font-medium">{expense.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-foreground text-sm">
                      {formatCurrency(expense.value)}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

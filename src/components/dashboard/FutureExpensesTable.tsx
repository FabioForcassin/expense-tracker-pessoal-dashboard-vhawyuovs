import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useFilteredExpenses, useDashboard } from '@/stores/DashboardContext'
import { formatCurrency, formatDate } from '@/lib/format'
import { ArrowDownRight, ArrowUpRight, CalendarClock } from 'lucide-react'

export function FutureExpensesTable({ full = false }: { full?: boolean }) {
  const { selectedYear } = useDashboard()
  const allExpenses = useFilteredExpenses(false)

  const d = new Date()
  const todayStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`

  let futureExpenses = allExpenses.filter((e) => e.date >= todayStr)

  if (selectedYear) {
    futureExpenses = futureExpenses.filter((e) => e.date >= `${selectedYear}-01-01`)
  }

  const displayData = [...futureExpenses].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  const finalData = full ? displayData : displayData.slice(0, 8)

  const subtotal = futureExpenses.reduce((acc, tx) => {
    return acc + (tx.primaryCategory === 'Receitas' ? 0 : tx.value)
  }, 0)

  return (
    <Card className="glass border-l-4 border-l-chart-4 mb-6">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-chart-4" />
          Previsibilidade de Parcelamento
        </CardTitle>
        <div className="px-3 py-1.5 bg-chart-4/10 text-chart-4 font-semibold text-sm rounded-md border border-chart-4/20">
          Subtotal Futuro: {formatCurrency(subtotal)}
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-6 sm:pt-0 overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/40">
              <TableHead className="w-[100px] whitespace-nowrap">Data</TableHead>
              <TableHead className="min-w-[150px]">Descrição/Origem</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Subcategoria</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Pgto/Conta</TableHead>
              <TableHead>Comentário</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {finalData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  Nenhuma transação futura encontrada.
                </TableCell>
              </TableRow>
            ) : (
              finalData.map((tx) => {
                const isIncome = tx.primaryCategory === 'Receitas'
                return (
                  <TableRow
                    key={tx.id}
                    className="hover:bg-muted/40 transition-colors border-border/30"
                  >
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap font-medium">
                      {formatDate(tx.date)}
                    </TableCell>
                    <TableCell className="font-medium text-foreground text-sm flex items-center gap-2">
                      {isIncome ? (
                        <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        </div>
                      )}
                      {tx.establishment}
                    </TableCell>
                    <TableCell className="text-sm">{tx.primaryCategory}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {tx.secondaryCategory}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-normal px-2 py-0.5 border-border/60"
                      >
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {tx.paymentMethod}
                    </TableCell>
                    <TableCell
                      className="text-sm text-muted-foreground max-w-[150px] truncate"
                      title={tx.comment}
                    >
                      {tx.comment}
                    </TableCell>
                    <TableCell
                      className={`text-right font-semibold text-sm whitespace-nowrap ${isIncome ? 'text-success' : 'text-foreground'}`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(tx.value)}
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

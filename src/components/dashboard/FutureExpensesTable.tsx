import { useMemo } from 'react'
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
import { useFilteredExpenses } from '@/stores/DashboardContext'
import { formatCurrency, formatDate } from '@/lib/format'
import { ArrowDownRight, ArrowUpRight, CalendarClock } from 'lucide-react'
import { InstallmentBadge } from '@/components/shared/InstallmentBadge'

export function FutureExpensesTable({ full = false }: { full?: boolean }) {
  const filteredExpenses = useFilteredExpenses(true)

  const finalData = useMemo(() => {
    const d = new Date()
    const lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0)
    const lastDayStr = `${lastDayOfMonth.getFullYear()}-${(lastDayOfMonth.getMonth() + 1).toString().padStart(2, '0')}-${lastDayOfMonth.getDate().toString().padStart(2, '0')}`

    let future = filteredExpenses.filter((e) => e.date > lastDayStr)
    future = future.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    return full ? future : future.slice(0, 10)
  }, [filteredExpenses, full])

  const subtotal = finalData.reduce((acc, tx) => {
    return acc + (tx.primaryCategory === 'Receitas' ? 0 : tx.value)
  }, 0)

  return (
    <Card className="glass border-l-4 border-l-chart-4 mb-6">
      <CardHeader className="flex flex-col gap-4 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-chart-4" />
            Previsibilidade de Parcelamento
          </CardTitle>
          <div className="px-3 py-1.5 bg-chart-4/10 text-chart-4 font-semibold text-sm rounded-md border border-chart-4/20 whitespace-nowrap">
            Subtotal Futuro: {formatCurrency(subtotal)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-6 sm:pt-0 overflow-x-auto">
        <div className="max-h-[400px] overflow-y-auto">
          <Table className="min-w-[800px]">
            <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
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
                    Nenhuma transação futura encontrada para os filtros selecionados.
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
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isIncome ? (
                            <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                              <ArrowDownRight className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <span className="font-medium text-foreground text-sm truncate">
                            {tx.establishment}
                          </span>
                          <InstallmentBadge
                            isInstallment={tx.isInstallment}
                            current={tx.currentInstallment}
                            total={tx.totalInstallments}
                          />
                        </div>
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
        </div>
      </CardContent>
    </Card>
  )
}

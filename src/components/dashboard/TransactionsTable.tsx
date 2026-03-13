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
import { useDashboard } from '@/stores/DashboardContext'
import { formatCurrency, formatDate } from '@/lib/format'

export function TransactionsTable({ full = false }: { full?: boolean }) {
  const { expenses, currentMonth, selectedPrimaryCat, selectedSecondaryCats, categories } =
    useDashboard()

  let filteredExpenses = expenses.filter((e) => e.date.startsWith(currentMonth))

  if (selectedPrimaryCat) {
    const cat = categories.find((c) => c.id === selectedPrimaryCat)
    filteredExpenses = filteredExpenses.filter((e) => e.primaryCategory === cat?.name)
    if (selectedSecondaryCats.length > 0) {
      filteredExpenses = filteredExpenses.filter((e) =>
        selectedSecondaryCats.includes(e.secondaryCategory),
      )
    }
  }

  const displayData = filteredExpenses.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  const finalData = full ? displayData : displayData.slice(0, 8)

  return (
    <Card className="glass mb-6">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6 sm:pt-0 overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/40">
              <TableHead className="w-[100px] whitespace-nowrap">Data</TableHead>
              <TableHead className="min-w-[150px]">Estabelecimento</TableHead>
              <TableHead>Despesa</TableHead>
              <TableHead>Classificação</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Forma Pgto</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {finalData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Nenhuma transação encontrada para os filtros selecionados.
                </TableCell>
              </TableRow>
            ) : (
              finalData.map((expense) => {
                return (
                  <TableRow
                    key={expense.id}
                    className="hover:bg-muted/40 transition-colors border-border/30"
                  >
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap font-medium">
                      {formatDate(expense.date)}
                    </TableCell>
                    <TableCell className="font-medium text-foreground text-sm">
                      {expense.establishment}
                    </TableCell>
                    <TableCell className="text-sm">{expense.primaryCategory}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {expense.secondaryCategory}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-normal px-2 py-0.5 border-border/60"
                      >
                        {expense.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {expense.paymentMethod}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-foreground text-sm whitespace-nowrap">
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

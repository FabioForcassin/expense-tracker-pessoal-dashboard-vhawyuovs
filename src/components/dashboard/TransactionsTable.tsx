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
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

export function TransactionsTable({ full = false }: { full?: boolean }) {
  const { expenses, selectedMonths, selectedPrimaryCat, selectedSecondaryCats, categories } =
    useDashboard()

  let filteredTransactions = expenses.filter((e) =>
    selectedMonths.some((m) => e.date.startsWith(m)),
  )

  if (selectedPrimaryCat) {
    const cat = categories.find((c) => c.id === selectedPrimaryCat)
    filteredTransactions = filteredTransactions.filter((e) => e.primaryCategory === cat?.name)
    if (selectedSecondaryCats.length > 0) {
      filteredTransactions = filteredTransactions.filter((e) =>
        selectedSecondaryCats.includes(e.secondaryCategory),
      )
    }
  }

  const displayData = filteredTransactions.sort(
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
              <TableHead className="min-w-[150px]">Descrição/Origem</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Subcategoria</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Pgto/Conta</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {finalData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Nenhuma transação encontrada no período.
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

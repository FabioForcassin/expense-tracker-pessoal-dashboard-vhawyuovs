import { useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useFilteredExpenses } from '@/stores/DashboardContext'
import { formatCurrency, formatDate } from '@/lib/format'
import { ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight, Activity } from 'lucide-react'
import { InstallmentBadge } from '@/components/shared/InstallmentBadge'

export function TransactionsTable({ full = false }: { full?: boolean }) {
  const filteredTransactions = useFilteredExpenses(true)

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  const [currentDateStr, setCurrentDateStr] = useState<string>(() => {
    const d = new Date()
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
  })

  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handlePrevDay = () => {
    const [y, m, d] = currentDateStr.split('-').map(Number)
    const dateObj = new Date(y, m - 1, d)
    dateObj.setDate(dateObj.getDate() - 1)
    setCurrentDateStr(
      `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`,
    )
  }

  const handleNextDay = () => {
    const [y, m, d] = currentDateStr.split('-').map(Number)
    const dateObj = new Date(y, m - 1, d)
    dateObj.setDate(dateObj.getDate() + 1)
    setCurrentDateStr(
      `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`,
    )
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const y = date.getFullYear()
      const m = (date.getMonth() + 1).toString().padStart(2, '0')
      const dStr = date.getDate().toString().padStart(2, '0')
      setCurrentDateStr(`${y}-${m}-${dStr}`)
      setIsCalendarOpen(false)
    }
  }

  const [y, m, d] = currentDateStr.split('-').map(Number)
  const currentDateObj = new Date(y, m - 1, d)

  const dailyTransactions = sortedTransactions.filter((t) => t.date === currentDateStr)

  const netSubtotal = dailyTransactions.reduce((acc, t) => {
    return acc + (t.primaryCategory === 'Receitas' ? t.value : -t.value)
  }, 0)

  const finalData = full ? dailyTransactions : dailyTransactions.slice(0, 10)

  return (
    <Card className="glass mb-6">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Transações Recentes
        </CardTitle>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-border/50">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-background"
              onClick={handlePrevDay}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 hover:bg-background px-3 font-semibold text-foreground w-28"
                >
                  {formatDate(currentDateStr)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={currentDateObj}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-background"
              onClick={handleNextDay}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div
            className={`px-3 py-1.5 font-semibold text-sm rounded-md border ${netSubtotal >= 0 ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}
          >
            Subtotal Dia: {netSubtotal > 0 ? '+' : ''}
            {formatCurrency(netSubtotal)}
          </div>
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
              {full && <TableHead>Classificação</TableHead>}
              {full && <TableHead>Quem</TableHead>}
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {finalData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={full ? 10 : 8}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhuma transação encontrada no dia selecionado.
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
                        <InstallmentBadge
                          isInstallment={tx.isInstallment}
                          current={tx.currentInstallment}
                          total={tx.totalInstallments}
                        />
                        <span className="font-medium text-foreground text-sm truncate">
                          {tx.establishment}
                        </span>
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
                    {full && (
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {tx.classification}
                      </TableCell>
                    )}
                    {full && (
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {tx.who}
                      </TableCell>
                    )}
                    <TableCell
                      className={`text-right font-semibold text-sm whitespace-nowrap ${isIncome ? 'text-success' : 'text-foreground'}`}
                    >
                      <span>
                        {isIncome ? '+' : '-'}
                        {formatCurrency(tx.value)}
                      </span>
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

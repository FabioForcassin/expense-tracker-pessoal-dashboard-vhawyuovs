import { useState, useMemo } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useDashboard } from '@/stores/DashboardContext'
import { formatCurrency, formatDate } from '@/lib/format'
import { ArrowDownRight, ArrowUpRight, CalendarClock, FilterX } from 'lucide-react'

export function FutureExpensesTable({ full = false }: { full?: boolean }) {
  const { expenses } = useDashboard()

  const futureExpensesRaw = useMemo(() => {
    const d = new Date()
    const lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0)
    const lastDayStr = `${lastDayOfMonth.getFullYear()}-${(lastDayOfMonth.getMonth() + 1).toString().padStart(2, '0')}-${lastDayOfMonth.getDate().toString().padStart(2, '0')}`

    // Ensure we use ALL expenses without global filters for true predictability of installments
    return expenses.filter((e) => e.date > lastDayStr)
  }, [expenses])

  const availableYears = Array.from(
    new Set(futureExpensesRaw.map((e) => e.date.split('-')[0])),
  ).sort()
  const availableMonths = Array.from(
    new Set(futureExpensesRaw.map((e) => e.date.split('-')[1])),
  ).sort()
  const availableDays = Array.from(
    new Set(futureExpensesRaw.map((e) => e.date.split('-')[2])),
  ).sort()
  const availableCategories = Array.from(
    new Set(futureExpensesRaw.map((e) => e.primaryCategory)),
  ).sort()
  const availablePaymentMethods = Array.from(
    new Set(futureExpensesRaw.map((e) => e.paymentMethod).filter(Boolean)),
  ).sort()

  const [filterYear, setFilterYear] = useState<string>('all')
  const [filterMonth, setFilterMonth] = useState<string>('all')
  const [filterDay, setFilterDay] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterSubCategory, setFilterSubCategory] = useState<string>('all')
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>('all')

  const availableSubCategories = useMemo(() => {
    return Array.from(
      new Set(
        futureExpensesRaw
          .filter((e) => filterCategory === 'all' || e.primaryCategory === filterCategory)
          .map((e) => e.secondaryCategory),
      ),
    ).sort()
  }, [futureExpensesRaw, filterCategory])

  const filteredFutureExpenses = useMemo(() => {
    return futureExpensesRaw
      .filter((e) => {
        const [y, m, dStr] = e.date.split('-')
        if (filterYear !== 'all' && y !== filterYear) return false
        if (filterMonth !== 'all' && m !== filterMonth) return false
        if (filterDay !== 'all' && dStr !== filterDay) return false
        if (filterCategory !== 'all' && e.primaryCategory !== filterCategory) return false
        if (filterSubCategory !== 'all' && e.secondaryCategory !== filterSubCategory) return false
        if (filterPaymentMethod !== 'all' && e.paymentMethod !== filterPaymentMethod) return false
        return true
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [
    futureExpensesRaw,
    filterYear,
    filterMonth,
    filterDay,
    filterCategory,
    filterSubCategory,
    filterPaymentMethod,
  ])

  const isFiltered =
    filterYear !== 'all' ||
    filterMonth !== 'all' ||
    filterDay !== 'all' ||
    filterCategory !== 'all' ||
    filterSubCategory !== 'all' ||
    filterPaymentMethod !== 'all'
  const finalData =
    full || isFiltered ? filteredFutureExpenses : filteredFutureExpenses.slice(0, 10)

  const subtotal = filteredFutureExpenses.reduce((acc, tx) => {
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

        {/* Dynamic Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/20 rounded-lg border border-border/50">
          <Select value={filterYear} onValueChange={setFilterYear}>
            <SelectTrigger className="w-[100px] h-8 text-xs bg-background">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Ano: Todos</SelectItem>
              {availableYears.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterMonth} onValueChange={setFilterMonth}>
            <SelectTrigger className="w-[100px] h-8 text-xs bg-background">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Mês: Todos</SelectItem>
              {availableMonths.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterDay} onValueChange={setFilterDay}>
            <SelectTrigger className="w-[100px] h-8 text-xs bg-background">
              <SelectValue placeholder="Dia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Dia: Todos</SelectItem>
              {availableDays.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterCategory}
            onValueChange={(val) => {
              setFilterCategory(val)
              setFilterSubCategory('all')
            }}
          >
            <SelectTrigger className="w-[130px] h-8 text-xs bg-background">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Cat: Todas</SelectItem>
              {availableCategories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterSubCategory} onValueChange={setFilterSubCategory}>
            <SelectTrigger className="w-[130px] h-8 text-xs bg-background">
              <SelectValue placeholder="Subcategoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Sub: Todas</SelectItem>
              {availableSubCategories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterPaymentMethod} onValueChange={setFilterPaymentMethod}>
            <SelectTrigger className="w-[130px] h-8 text-xs bg-background">
              <SelectValue placeholder="Cartão" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Cartão: Todos</SelectItem>
              {availablePaymentMethods.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground ml-auto"
              onClick={() => {
                setFilterYear('all')
                setFilterMonth('all')
                setFilterDay('all')
                setFilterCategory('all')
                setFilterSubCategory('all')
                setFilterPaymentMethod('all')
              }}
            >
              <FilterX className="w-3.5 h-3.5 mr-1" />
              Limpar
            </Button>
          )}
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
        </div>
      </CardContent>
    </Card>
  )
}

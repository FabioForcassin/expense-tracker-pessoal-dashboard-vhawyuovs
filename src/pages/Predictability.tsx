import { useFilteredExpenses } from '@/stores/DashboardContext'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/format'
import { CalendarClock } from 'lucide-react'
import { InstallmentBadge } from '@/components/shared/InstallmentBadge'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'

export default function Predictability() {
  const expenses = useFilteredExpenses(false).filter((e) => e.primaryCategory !== 'Receitas')
  const d = new Date()
  const lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0)
  const lastDayStr = `${lastDayOfMonth.getFullYear()}-${(lastDayOfMonth.getMonth() + 1).toString().padStart(2, '0')}-${lastDayOfMonth.getDate().toString().padStart(2, '0')}`

  const futureExpenses = expenses
    .filter((e) => e.date > lastDayStr)
    .sort((a, b) => a.date.localeCompare(b.date))

  const grouped = futureExpenses.reduce(
    (acc, curr) => {
      const month = curr.date.substring(0, 7) // YYYY-MM
      if (!acc[month]) acc[month] = []
      acc[month].push(curr)
      return acc
    },
    {} as Record<string, typeof expenses>,
  )

  const sortedMonths = Object.keys(grouped).sort()

  const formatMonth = (str: string) => {
    const [y, m] = str.split('-')
    const date = new Date(parseInt(y), parseInt(m) - 1, 1)
    const mName = date.toLocaleString('pt-BR', { month: 'long' })
    return `${mName.charAt(0).toUpperCase() + mName.slice(1)} ${y}`
  }

  return (
    <div className="max-w-[1400px] w-full mx-auto flex flex-col gap-6 animate-fade-in pb-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 text-foreground">
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
            <CalendarClock className="w-6 h-6" />
          </div>
          Previsibilidade de Parcelas
        </h2>
        <p className="text-muted-foreground text-sm mt-2">
          Visualize suas despesas futuras e parcelamentos organizados por mês.
        </p>
      </div>

      {sortedMonths.length === 0 ? (
        <Card className="glass">
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhuma despesa futura registrada para os filtros selecionados.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {sortedMonths.map((month) => {
            const monthTotal = grouped[month].reduce((a, b) => a + b.value, 0)
            return (
              <Card key={month} className="glass overflow-hidden shadow-sm">
                <CardHeader className="bg-muted/30 border-b border-border/40 py-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-bold">{formatMonth(month)}</CardTitle>
                  <span className="font-bold text-destructive">{formatCurrency(monthTotal)}</span>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <Table className="min-w-[600px]">
                    <TableHeader className="bg-muted/10">
                      <TableRow>
                        <TableHead className="w-[120px]">Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grouped[month].map((tx) => (
                        <TableRow key={tx.id} className="hover:bg-muted/30">
                          <TableCell className="text-sm text-muted-foreground font-medium">
                            {formatDate(tx.date)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm truncate">
                                {tx.establishment}
                              </span>
                              <InstallmentBadge
                                isInstallment={tx.isInstallment}
                                current={tx.currentInstallment}
                                total={tx.totalInstallments}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {tx.primaryCategory}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-sm">
                            {formatCurrency(tx.value)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

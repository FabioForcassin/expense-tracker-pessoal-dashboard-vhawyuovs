import { FilteredTransactionsTable } from '@/components/dashboard/FilteredTransactionsTable'
import { FilterSection } from '@/components/dashboard/FilterSection'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileSpreadsheet } from 'lucide-react'
import { exportToCSV } from '@/lib/export'
import { useFilteredExpenses } from '@/stores/DashboardContext'
import { formatCurrency } from '@/lib/format'

export default function Reports() {
  const filteredData = useFilteredExpenses(true)

  const totalIncomes = filteredData
    .filter((e) => e.primaryCategory === 'Receitas')
    .reduce((acc, e) => acc + e.value, 0)

  const totalExpenses = filteredData
    .filter((e) => e.primaryCategory !== 'Receitas')
    .reduce((acc, e) => acc + e.value, 0)

  const balance = totalIncomes - totalExpenses

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in pb-8">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Histórico Completo
            </h2>
            <p className="text-muted-foreground text-sm mt-1 mb-6">
              Visualize e filtre todas as suas movimentações financeiras para extrair insights e
              exportar os dados brutos.
            </p>
          </div>
          <Button
            onClick={() => exportToCSV(filteredData, 'relatorio_filtrado.csv')}
            className="gap-2 shrink-0 bg-success hover:bg-success/90 text-success-foreground shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Exportar Excel (CSV)
          </Button>
        </div>
        <FilterSection />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
        <Card className="glass overflow-hidden relative border-success/20">
          <CardContent className="p-6 relative z-10 flex flex-col items-center justify-center text-center">
            <h3 className="text-xs font-semibold tracking-tight text-success uppercase mb-2">
              Total de Receitas
            </h3>
            <p className="text-2xl md:text-3xl font-bold tracking-tight text-success">
              +{formatCurrency(totalIncomes)}
            </p>
          </CardContent>
        </Card>

        <Card className="glass overflow-hidden relative border-destructive/20">
          <CardContent className="p-6 relative z-10 flex flex-col items-center justify-center text-center">
            <h3 className="text-xs font-semibold tracking-tight text-destructive uppercase mb-2">
              Total de Despesas
            </h3>
            <p className="text-2xl md:text-3xl font-bold tracking-tight text-destructive">
              -{formatCurrency(totalExpenses)}
            </p>
          </CardContent>
        </Card>

        <Card
          className={`glass overflow-hidden relative ${balance >= 0 ? 'border-success/50' : 'border-destructive/50'}`}
        >
          <CardContent className="p-6 relative z-10 flex flex-col items-center justify-center text-center">
            <h3 className="text-xs font-semibold tracking-tight text-muted-foreground uppercase mb-2">
              Saldo Líquido no Período
            </h3>
            <p
              className={`text-2xl md:text-3xl font-bold tracking-tight ${balance >= 0 ? 'text-success' : 'text-destructive'}`}
            >
              {balance > 0 ? '+' : ''}
              {formatCurrency(balance)}
            </p>
          </CardContent>
        </Card>
      </div>

      <FilteredTransactionsTable full />
    </div>
  )
}

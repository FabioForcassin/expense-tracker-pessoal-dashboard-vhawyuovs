import { TransactionsTable } from '@/components/dashboard/TransactionsTable'
import { FilterSection } from '@/components/dashboard/FilterSection'
import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'
import { exportToCSV } from '@/lib/export'
import { useFilteredExpenses } from '@/stores/DashboardContext'

export default function Reports() {
  const filteredData = useFilteredExpenses(true)

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Histórico Completo
            </h2>
            <p className="text-muted-foreground text-sm mt-1 mb-6">
              Visualize e filtre todas as suas movimentações financeiras.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => exportToCSV(filteredData, 'relatorio_filtrado.csv')}
            className="gap-2 shrink-0 border-success/30 hover:border-success/60 text-success hover:text-success/90 hover:bg-success/5"
          >
            <FileDown className="w-4 h-4" />
            Exportar Filtrados (CSV)
          </Button>
        </div>
        <FilterSection />
      </div>
      <TransactionsTable full />
    </div>
  )
}

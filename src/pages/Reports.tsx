import { TransactionsTable } from '@/components/dashboard/TransactionsTable'
import { FilterSection } from '@/components/dashboard/FilterSection'
import { Button } from '@/components/ui/button'
import { FileSpreadsheet } from 'lucide-react'
import { exportToCSV } from '@/lib/export'
import { useFilteredExpenses } from '@/stores/DashboardContext'

export default function Reports() {
  const filteredData = useFilteredExpenses(true)

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in">
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
            onClick={() => exportToCSV(filteredData, 'relatorio_filtrado.csv')}
            className="gap-2 shrink-0 bg-success hover:bg-success/90 text-success-foreground shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Exportar Excel (CSV)
          </Button>
        </div>
        <FilterSection />
      </div>
      <TransactionsTable full />
    </div>
  )
}

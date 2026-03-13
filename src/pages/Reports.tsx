import { TransactionsTable } from '@/components/dashboard/TransactionsTable'
import { FilterSection } from '@/components/dashboard/FilterSection'

export default function Reports() {
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Histórico Completo
        </h2>
        <p className="text-muted-foreground text-sm mt-1 mb-6">
          Visualize e filtre todas as suas movimentações financeiras.
        </p>
        <FilterSection />
      </div>
      <TransactionsTable full />
    </div>
  )
}

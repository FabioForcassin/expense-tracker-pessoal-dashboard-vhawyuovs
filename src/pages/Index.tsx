import { FilterSection } from '@/components/dashboard/FilterSection'
import { KPICards } from '@/components/dashboard/KPICards'
import { BudgetVsActualChart } from '@/components/dashboard/BudgetVsActualChart'
import { CategoryDistributionChart } from '@/components/dashboard/CategoryDistributionChart'
import { CumulativeSpendingChart } from '@/components/dashboard/CumulativeSpendingChart'
import { TransactionsTable } from '@/components/dashboard/TransactionsTable'

export default function Index() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-2">
      <div className="mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Acompanhe seus gastos e orçamento do mês.
        </p>
      </div>

      <FilterSection />
      <KPICards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-4 lg:mb-6">
        <div className="lg:col-span-2">
          <BudgetVsActualChart />
        </div>
        <div className="lg:col-span-1">
          <CategoryDistributionChart />
        </div>
      </div>

      <CumulativeSpendingChart />
      <TransactionsTable />
    </div>
  )
}

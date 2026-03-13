import { FilterSection } from '@/components/dashboard/FilterSection'
import { KPICards } from '@/components/dashboard/KPICards'
import { BudgetVsActualChart } from '@/components/dashboard/BudgetVsActualChart'
import { CategoryDistributionChart } from '@/components/dashboard/CategoryDistributionChart'
import { CumulativeSpendingChart } from '@/components/dashboard/CumulativeSpendingChart'
import { TransactionsTable } from '@/components/dashboard/TransactionsTable'

export default function Index() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-2">
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

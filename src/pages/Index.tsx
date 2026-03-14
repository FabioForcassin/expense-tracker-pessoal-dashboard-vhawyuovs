import { DynamicHeader } from '@/components/dashboard/DynamicHeader'
import { FilterSection } from '@/components/dashboard/FilterSection'
import { KPICards } from '@/components/dashboard/KPICards'
import { CumulativeSpendingChart } from '@/components/dashboard/CumulativeSpendingChart'
import { CategoryDistributionChart } from '@/components/dashboard/CategoryDistributionChart'
import { MoMChart } from '@/components/dashboard/MoMChart'
import { TrendChart } from '@/components/dashboard/TrendChart'
import { YearlyHistoryChart } from '@/components/dashboard/YearlyHistoryChart'
import { TopExpensesList } from '@/components/dashboard/TopExpensesList'
import { TransactionsTable } from '@/components/dashboard/TransactionsTable'
import { InsightsSection } from '@/components/dashboard/InsightsSection'

export default function Index() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4 animate-fade-in pb-8">
      <DynamicHeader />
      <FilterSection />
      <KPICards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-2">
        <div className="lg:col-span-2">
          <CumulativeSpendingChart />
        </div>
        <div className="lg:col-span-1">
          <TopExpensesList />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-2">
        <MoMChart />
        <TrendChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
        <CategoryDistributionChart />
        <YearlyHistoryChart />
      </div>

      <InsightsSection />

      <TransactionsTable />
    </div>
  )
}

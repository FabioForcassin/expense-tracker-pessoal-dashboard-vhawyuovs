import { DynamicHeader } from '@/components/dashboard/DynamicHeader'
import { KPICards } from '@/components/dashboard/KPICards'
import { CumulativeSpendingChart } from '@/components/dashboard/CumulativeSpendingChart'
import { CategoryDistributionChart } from '@/components/dashboard/CategoryDistributionChart'
import { MoMChart } from '@/components/dashboard/MoMChart'
import { TrendChart } from '@/components/dashboard/TrendChart'
import { YearlyHistoryChart } from '@/components/dashboard/YearlyHistoryChart'
import { TopExpensesList } from '@/components/dashboard/TopExpensesList'
import { TransactionsTable } from '@/components/dashboard/TransactionsTable'
import { FilteredTransactionsTable } from '@/components/dashboard/FilteredTransactionsTable'
import { InsightsSection } from '@/components/dashboard/InsightsSection'
import { PaymentTypeChart } from '@/components/dashboard/PaymentTypeChart'
import { PredictabilityChart } from '@/components/dashboard/PredictabilityChart'
import { FutureExpensesTable } from '@/components/dashboard/FutureExpensesTable'
import { BudgetAlert } from '@/components/dashboard/BudgetAlert'

export default function Index() {
  return (
    <div className="flex flex-col pb-8">
      <div className="max-w-[1400px] w-full mx-auto flex flex-col gap-4 lg:gap-6 animate-fade-in">
        <BudgetAlert />

        <DynamicHeader />
        <KPICards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2">
            <CumulativeSpendingChart />
          </div>
          <div className="lg:col-span-1">
            <TopExpensesList />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <MoMChart />
          <TrendChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <CategoryDistributionChart />
          <YearlyHistoryChart />
        </div>

        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground mb-4">
            Analytics & Inteligência
          </h3>
          <InsightsSection />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <PaymentTypeChart />
          <PredictabilityChart />
        </div>

        <FutureExpensesTable />
        <TransactionsTable />
        <FilteredTransactionsTable />
      </div>
    </div>
  )
}

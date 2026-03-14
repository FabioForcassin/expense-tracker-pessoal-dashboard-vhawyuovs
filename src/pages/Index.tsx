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
import { PaymentTypeChart } from '@/components/dashboard/PaymentTypeChart'
import { PredictabilityChart } from '@/components/dashboard/PredictabilityChart'
import { FutureExpensesTable } from '@/components/dashboard/FutureExpensesTable'

export default function Index() {
  return (
    <div className="flex flex-col pb-8">
      {/* Sticky Header Section */}
      <div className="sticky top-[72px] z-20 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm pt-4 md:pt-6 lg:pt-8 pb-4 -mt-4 md:-mt-6 lg:-mt-8 mb-6 transition-all duration-200">
        <div className="max-w-[1400px] w-full mx-auto flex flex-col gap-4">
          <DynamicHeader />
          <FilterSection />
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-[1400px] w-full mx-auto flex flex-col gap-4 lg:gap-6 animate-fade-in">
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
      </div>
    </div>
  )
}

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { BellRing } from 'lucide-react'
import { useDashboard } from '@/stores/DashboardContext'
import { formatCurrency, formatDate } from '@/lib/format'

export function PaymentNotifications() {
  const { expenses } = useDashboard()

  const today = new Date()
  const nextWeek = new Date()
  nextWeek.setDate(today.getDate() + 7)

  const todayStr = today.toISOString().split('T')[0]
  const nextWeekStr = nextWeek.toISOString().split('T')[0]

  const upcoming = expenses
    .filter((e) => e.date >= todayStr && e.date <= nextWeekStr && e.primaryCategory !== 'Receitas')
    .sort((a, b) => a.date.localeCompare(b.date))

  if (upcoming.length === 0) return null

  return (
    <Alert className="mb-6 bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-500 shadow-sm">
      <BellRing className="h-4 w-4 stroke-current" />
      <AlertTitle className="font-bold">Atenção: Contas a pagar nos próximos 7 dias</AlertTitle>
      <AlertDescription>
        <ul className="mt-3 space-y-2">
          {upcoming.map((e) => (
            <li
              key={e.id}
              className="text-sm flex items-center justify-between border-b border-amber-500/10 pb-1 last:border-0 last:pb-0"
            >
              <span className="truncate pr-4">
                <strong className="font-semibold mr-2">{formatDate(e.date)}</strong>
                {e.establishment}{' '}
                <span className="text-xs opacity-80 ml-1">({e.paymentMethod})</span>
              </span>
              <span className="font-bold shrink-0">{formatCurrency(e.value)}</span>
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}

import { useDashboard } from '@/stores/DashboardContext'
import { CalendarDays } from 'lucide-react'

export function DynamicHeader() {
  const { selectedYear } = useDashboard()
  const today = new Date()
  const formattedDate = today.toLocaleDateString('pt-BR')

  return (
    <div className="flex items-center gap-4 animate-fade-in-up">
      <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20 shadow-sm">
        <CalendarDays className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Visão geral das Despesas {selectedYear}
        </h1>
        <p className="text-sm font-medium text-muted-foreground mt-0.5">
          Acessado em: {formattedDate}
        </p>
      </div>
    </div>
  )
}

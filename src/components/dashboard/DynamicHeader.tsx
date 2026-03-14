import { useDashboard } from '@/stores/DashboardContext'
import { CalendarDays } from 'lucide-react'

const monthNames: Record<string, string> = {
  '01': 'Janeiro',
  '02': 'Fevereiro',
  '03': 'Março',
  '04': 'Abril',
  '05': 'Maio',
  '06': 'Junho',
  '07': 'Julho',
  '08': 'Agosto',
  '09': 'Setembro',
  '10': 'Outubro',
  '11': 'Novembro',
  '12': 'Dezembro',
}

export function DynamicHeader() {
  const { selectedYear, selectedMonthValues } = useDashboard()

  let headerText = `Visão Geral ${selectedYear}`

  if (selectedMonthValues.length === 1) {
    headerText = `Visão geral de ${monthNames[selectedMonthValues[0]]} ${selectedYear}`
  } else if (selectedMonthValues.length > 1) {
    const sorted = [...selectedMonthValues].sort()
    const first = sorted[0]
    const last = sorted[sorted.length - 1]
    headerText = `Visão geral de ${monthNames[first]} a ${monthNames[last]} ${selectedYear}`
  }

  return (
    <div className="flex items-center gap-4 mb-2 animate-fade-in-up">
      <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20 shadow-sm">
        <CalendarDays className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {headerText}
        </h1>
        <p className="text-sm font-medium text-muted-foreground mt-0.5">
          Painel Financeiro e Análise Preditiva
        </p>
      </div>
    </div>
  )
}

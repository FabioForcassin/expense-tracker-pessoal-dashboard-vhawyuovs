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
  const { selectedMonths } = useDashboard()

  let headerText = 'Visão Geral'

  if (selectedMonths.length === 1) {
    const [y, m] = selectedMonths[0].split('-')
    headerText = `Visão geral de ${monthNames[m]} ${y}`
  } else if (selectedMonths.length > 1) {
    const sorted = [...selectedMonths].sort()
    const first = sorted[0]
    const last = sorted[sorted.length - 1]
    const [y1, m1] = first.split('-')
    const [y2, m2] = last.split('-')
    headerText = `Visão geral de ${monthNames[m1]} ${y1} a ${monthNames[m2]} ${y2}`
  }

  return (
    <div className="flex items-center gap-4 mb-2 animate-fade-in-up">
      <div className="p-3 bg-primary/10 text-primary rounded-2xl backdrop-blur-sm border border-primary/20 shadow-sm">
        <CalendarDays className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {headerText}
        </h1>
        <p className="text-sm font-medium text-muted-foreground mt-0.5">
          Análise financeira e acompanhamento de metas
        </p>
      </div>
    </div>
  )
}

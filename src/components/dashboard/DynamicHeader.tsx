import { useDashboard } from '@/stores/DashboardContext'
import { useAuth } from '@/hooks/use-auth'
import { CalendarDays } from 'lucide-react'

export function DynamicHeader() {
  const { selectedYear, isAdmin, isGlobalView, adminSelectedUserId, profiles } = useDashboard()
  const { user } = useAuth()

  const today = new Date()
  const formattedDate = today.toLocaleDateString('pt-BR')

  let displayName = user?.email?.split('@')[0] || 'Usuário'

  if (isAdmin && isGlobalView) {
    if (adminSelectedUserId === 'all') {
      displayName = 'Todos os Usuários'
    } else {
      const selectedProfile = profiles.find((p) => p.id === adminSelectedUserId)
      if (selectedProfile) {
        displayName = selectedProfile.email.split('@')[0]
      }
    }
  }

  // Capitalize first letter dynamically
  displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1)

  return (
    <div className="flex items-center gap-4 animate-fade-in-up">
      <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20 shadow-sm">
        <CalendarDays className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Visão Geral das despesas {displayName}
        </h1>
        <p className="text-sm font-medium text-muted-foreground mt-0.5">
          Acessado em: {formattedDate} | Ano de Referência: {selectedYear}
        </p>
      </div>
    </div>
  )
}

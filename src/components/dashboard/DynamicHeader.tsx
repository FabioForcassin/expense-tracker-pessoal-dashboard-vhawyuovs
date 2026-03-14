import { useDashboard } from '@/stores/DashboardContext'
import { useAuth } from '@/hooks/use-auth'
import { CalendarDays } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function DynamicHeader() {
  const {
    selectedYear,
    isAdmin,
    isGlobalView,
    setIsGlobalView,
    adminSelectedUserId,
    setAdminSelectedUserId,
    profiles,
  } = useDashboard()
  const { user } = useAuth()

  const today = new Date()
  const formattedDate = today.toLocaleDateString('pt-BR')

  let displayName = user?.email?.split('@')[0] || 'Usuário'

  if (isAdmin && isGlobalView) {
    if (adminSelectedUserId === 'all') {
      displayName = 'Todos'
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
    <div className="flex flex-col gap-4 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20 shadow-sm shrink-0">
          <CalendarDays className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground line-clamp-1">
            Visão Geral das despesas - {displayName}
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-0.5">
            Acessado em: {formattedDate} | Ano de Referência: {selectedYear}
          </p>
        </div>
      </div>

      {isAdmin && (
        <div className="p-3 bg-muted/30 border border-border/50 rounded-xl flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm w-fit">
          <div className="flex items-center gap-2">
            <Switch checked={isGlobalView} onCheckedChange={setIsGlobalView} id="global-view" />
            <Label htmlFor="global-view" className="cursor-pointer font-semibold text-primary">
              Dashboard Executivo (Consolidado)
            </Label>
          </div>
          {isGlobalView && (
            <div className="flex items-center gap-2 sm:ml-4 sm:border-l sm:border-border/50 sm:pl-4">
              <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">
                Filtrar por:
              </span>
              <Select value={adminSelectedUserId} onValueChange={setAdminSelectedUserId}>
                <SelectTrigger className="w-[200px] h-9 bg-background">
                  <SelectValue placeholder="Selecione o usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Usuários</SelectItem>
                  {profiles.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

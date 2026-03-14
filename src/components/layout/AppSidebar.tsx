import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Settings,
  Wallet,
  Database,
  CalendarClock,
  Target,
  BellRing,
  TrendingUp,
  AlertTriangle,
  Users,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { useDashboard } from '@/stores/DashboardContext'
import { formatCurrency, formatDate } from '@/lib/format'

export function AppSidebar() {
  const location = useLocation()
  const { expenses, goals, isAdmin } = useDashboard()

  const mainItems = [
    { title: 'Visão Geral', url: '/', icon: LayoutDashboard },
    { title: 'Previsibilidade', url: '/predictability', icon: CalendarClock },
    { title: 'Metas', url: '/goals', icon: Target },
    { title: 'Gerenciamento', url: '/management', icon: Settings },
  ]

  const analysisItems = [{ title: 'Tendências e Alertas', url: '/insights', icon: TrendingUp }]

  const advancedItems = [
    { title: 'Banco de Dados', url: '/database', icon: Database },
    { title: 'Relatórios', url: '/reports', icon: FileText },
  ]

  const today = new Date()
  const nextWeek = new Date()
  nextWeek.setDate(today.getDate() + 7)

  const todayStr = today.toISOString().split('T')[0]
  const nextWeekStr = nextWeek.toISOString().split('T')[0]

  const upcoming = expenses
    .filter((e) => e.date >= todayStr && e.date <= nextWeekStr && e.primaryCategory !== 'Receitas')
    .sort((a, b) => a.date.localeCompare(b.date))

  // Determine if user is overspending current month for the alert indicator
  const currentMonth = today.getMonth() + 1
  const currentYear = today.getFullYear()
  const currentMonthGoal = goals.find((g) => g.month === currentMonth && g.year === currentYear)

  let isOverspending = false
  if (currentMonthGoal && currentMonthGoal.amount > 0) {
    const currentMonthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`
    const spent = expenses
      .filter((e) => e.date.startsWith(currentMonthStr) && e.primaryCategory !== 'Receitas')
      .reduce((sum, e) => sum + e.value, 0)

    if (spent >= currentMonthGoal.amount * 0.9) {
      isOverspending = true
    }
  }

  return (
    <Sidebar variant="inset" className="border-r border-border/50">
      <SidebarHeader className="border-b border-border/50 p-4 h-16 flex items-center justify-center shrink-0">
        <div className="flex items-center gap-2 font-semibold text-primary w-full px-2">
          <Wallet className="w-6 h-6 shrink-0" />
          <span className="text-lg tracking-tight truncate">FinDashboard</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70 mt-2">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 mt-2">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                    className="font-medium"
                  >
                    <Link to={item.url}>
                      <item.icon className="w-4 h-4 opacity-70" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
              Administração
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1 mt-2">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === '/admin/users'}
                    tooltip="Gerenciar Usuários"
                    className="font-medium"
                  >
                    <Link to="/admin/users">
                      <Users className="w-4 h-4 opacity-70" />
                      <span>Usuários</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
            Análise
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 mt-2">
              {analysisItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                    className="font-medium w-full"
                  >
                    <Link to={item.url} className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 opacity-70" />
                        <span>{item.title}</span>
                      </div>
                      {isOverspending && (
                        <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0 animate-pulse" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
            Avançado
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 mt-2">
              {advancedItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                    className="font-medium"
                  >
                    <Link to={item.url}>
                      <item.icon className="w-4 h-4 opacity-70" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6 border-t border-border/50 pt-4">
          <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
            <BellRing className="w-3.5 h-3.5" />
            Contas a Pagar (7 dias)
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {upcoming.length > 0 ? (
              <ul className="flex flex-col gap-2 mt-3 px-2">
                {upcoming.map((e) => (
                  <li
                    key={e.id}
                    className="text-xs flex flex-col gap-1 pb-2 border-b border-border/50 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{formatDate(e.date)}</span>
                      <span className="font-bold text-amber-600 dark:text-amber-500">
                        {formatCurrency(e.value)}
                      </span>
                    </div>
                    <span className="text-muted-foreground truncate">{e.establishment}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-muted-foreground px-2 mt-3 text-center opacity-70">
                Nenhuma conta para os próximos 7 dias.
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

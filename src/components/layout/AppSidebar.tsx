import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Settings,
  Wallet,
  Database,
  CalendarClock,
  Target,
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

export function AppSidebar() {
  const location = useLocation()

  const mainItems = [
    { title: 'Visão Geral', url: '/', icon: LayoutDashboard },
    { title: 'Previsibilidade', url: '/predictability', icon: CalendarClock },
    { title: 'Metas', url: '/goals', icon: Target },
    { title: 'Gerenciamento', url: '/management', icon: Settings },
  ]

  const advancedItems = [
    { title: 'Banco de Dados', url: '/database', icon: Database },
    { title: 'Relatórios', url: '/reports', icon: FileText },
  ]

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
      </SidebarContent>
    </Sidebar>
  )
}

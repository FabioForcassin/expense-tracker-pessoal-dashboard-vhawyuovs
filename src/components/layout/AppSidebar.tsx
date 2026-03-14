import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarClock,
  Target,
  Activity,
  Database,
  FileSpreadsheet,
  Settings,
  Users,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { useDashboard } from '@/stores/DashboardContext'

const mainNav = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { title: 'Previsibilidade', icon: CalendarClock, path: '/predictability' },
  { title: 'Metas', icon: Target, path: '/goals' },
  { title: 'Tendências', icon: Activity, path: '/insights' },
  { title: 'Banco de Dados', icon: Database, path: '/database' },
  { title: 'Relatórios', icon: FileSpreadsheet, path: '/reports' },
  { title: 'Gerenciamento', icon: Settings, path: '/management' },
]

export function AppSidebar() {
  const { isAdmin } = useDashboard()

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="h-[72px] flex items-center justify-center border-b border-border/40">
        <div className="flex items-center gap-2 px-2 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-lg">E</span>
          </div>
          <span className="font-bold text-lg tracking-tight truncate group-data-[collapsible=icon]:hidden">
            Expense Tracker
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground'
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Usuários">
                    <NavLink
                      to="/admin/users"
                      className={({ isActive }) =>
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground'
                      }
                    >
                      <Users className="w-4 h-4" />
                      <span>Usuários</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

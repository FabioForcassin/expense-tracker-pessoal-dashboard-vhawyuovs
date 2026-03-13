import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, Settings, Wallet } from 'lucide-react'
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

  const items = [
    { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    { title: 'Relatórios', url: '/reports', icon: FileText },
    { title: 'Configurações', url: '/settings', icon: Settings },
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
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 mt-2">
              {items.map((item) => (
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

import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { TopBar } from './TopBar'
import { FilterSection } from '@/components/dashboard/FilterSection'

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-muted/30 min-h-screen flex flex-col">
        <TopBar />
        <div className="sticky top-[72px] z-20 bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm px-4 md:px-6 lg:px-8 py-4 transition-all duration-200">
          <div className="max-w-[1400px] w-full mx-auto">
            <FilterSection />
          </div>
        </div>
        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in pb-20">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

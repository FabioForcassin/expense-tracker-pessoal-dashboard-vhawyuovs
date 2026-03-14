import { useState } from 'react'
import { Menu, Plus, Upload, TrendingUp } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AddExpenseModal } from '../modals/AddExpenseModal'
import { ImportDataModal } from '../modals/ImportBudgetModal'
import { useDashboard } from '@/stores/DashboardContext'
import { useAuth } from '@/hooks/use-auth'

export function TopBar() {
  const { toggleSidebar, isMobile } = useSidebar()
  const { user } = useAuth()
  const {
    isAdmin,
    adminSelectedUserId,
    setAdminSelectedUserId,
    setIsGlobalView,
    isGlobalView,
    profiles,
  } = useDashboard()

  const [expenseModalOpen, setExpenseModalOpen] = useState(false)
  const [modalDefaultTab, setModalDefaultTab] = useState<'expense' | 'income'>('expense')
  const [importModalOpen, setImportModalOpen] = useState(false)

  const openAddModal = (tab: 'expense' | 'income') => {
    setModalDefaultTab(tab)
    setExpenseModalOpen(true)
  }

  return (
    <header className="sticky top-0 z-30 flex h-[72px] w-full items-center justify-between border-b border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur-xl px-4 sm:px-6 shadow-sm transition-all">
      <div className="flex items-center gap-4">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="shrink-0">
            <Menu className="w-5 h-5" />
          </Button>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-foreground leading-tight">
            Dashboard Executivo
          </h1>
          {isAdmin && (
            <Select
              value={isGlobalView ? adminSelectedUserId : user?.id || 'all'}
              onValueChange={(val) => {
                setIsGlobalView(true)
                setAdminSelectedUserId(val)
              }}
            >
              <SelectTrigger className="h-8 w-full sm:w-[220px] bg-muted/50 border-border/60 ml-0 sm:ml-2">
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
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="outline"
          onClick={() => setImportModalOpen(true)}
          className="hidden sm:flex bg-white/50 dark:bg-black/50 backdrop-blur-sm border-border/60 hover:bg-muted/60"
        >
          <Upload className="w-4 h-4 mr-2 text-muted-foreground" />
          Importar Dados
        </Button>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => openAddModal('income')}
            className="border-success/30 text-success hover:bg-success/10 hover:text-success shadow-sm"
          >
            <TrendingUp className="w-4 h-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Nova Receita</span>
          </Button>
          <Button onClick={() => openAddModal('expense')} className="shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Nova Despesa</span>
          </Button>
        </div>
      </div>

      <AddExpenseModal
        open={expenseModalOpen}
        onOpenChange={setExpenseModalOpen}
        defaultTab={modalDefaultTab}
      />
      <ImportDataModal open={importModalOpen} onOpenChange={setImportModalOpen} />
    </header>
  )
}

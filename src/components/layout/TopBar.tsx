import { useState } from 'react'
import { Menu, Plus, Upload } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { AddExpenseModal } from '../modals/AddExpenseModal'
import { ImportDataModal } from '../modals/ImportBudgetModal'
import { useDashboard } from '@/stores/DashboardContext'

export function TopBar() {
  const { toggleSidebar, isMobile } = useSidebar()
  const { currentMonth } = useDashboard()
  const [expenseModalOpen, setExpenseModalOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)

  const displayMonth = new Date(currentMonth + '-02').toLocaleString('pt-BR', {
    // Use -02 to avoid timezone shifting to previous month
    month: 'long',
    year: 'numeric',
  })

  const formattedMonth = displayMonth.charAt(0).toUpperCase() + displayMonth.slice(1)

  return (
    <header className="sticky top-0 z-30 flex h-[72px] w-full items-center justify-between border-b border-border/40 bg-background/70 backdrop-blur-xl px-4 sm:px-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-4">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="shrink-0">
            <Menu className="w-5 h-5" />
          </Button>
        )}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground leading-tight">
            Dashboard Executivo
          </h1>
          <p className="text-sm font-medium text-primary hidden sm:block">
            Visão Geral de {formattedMonth}
          </p>
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
        <Button onClick={() => setExpenseModalOpen(true)} className="shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-1.5" />
          Nova Despesa
        </Button>
      </div>

      <AddExpenseModal open={expenseModalOpen} onOpenChange={setExpenseModalOpen} />
      <ImportDataModal open={importModalOpen} onOpenChange={setImportModalOpen} />
    </header>
  )
}

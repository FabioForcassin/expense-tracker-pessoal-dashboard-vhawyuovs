import { useState } from 'react'
import { Menu } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { AddExpenseModal } from '../modals/AddExpenseModal'
import { ImportBudgetModal } from '../modals/ImportBudgetModal'
import { useDashboard } from '@/stores/DashboardContext'

export function TopBar() {
  const { toggleSidebar, isMobile } = useSidebar()
  const { currentMonth } = useDashboard()
  const [expenseModalOpen, setExpenseModalOpen] = useState(false)
  const [budgetModalOpen, setBudgetModalOpen] = useState(false)

  const displayMonth = new Date(currentMonth + '-01').toLocaleString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })

  const formattedMonth = displayMonth.charAt(0).toUpperCase() + displayMonth.slice(1)

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/50 bg-background/60 backdrop-blur-xl px-4 sm:px-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-4">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="w-5 h-5" />
          </Button>
        )}
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground leading-tight">
            Olá, Usuário!
          </h1>
          <p className="text-xs font-medium text-muted-foreground hidden sm:block">
            Visão Geral de {formattedMonth}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="outline"
          onClick={() => setBudgetModalOpen(true)}
          className="hidden sm:flex"
        >
          Importar Orçamento
        </Button>
        <Button onClick={() => setExpenseModalOpen(true)} className="shadow-sm">
          + Nova Despesa
        </Button>
      </div>

      <AddExpenseModal open={expenseModalOpen} onOpenChange={setExpenseModalOpen} />
      <ImportBudgetModal open={budgetModalOpen} onOpenChange={setBudgetModalOpen} />
    </header>
  )
}

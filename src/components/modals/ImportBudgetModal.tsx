import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { UploadCloud } from 'lucide-react'
import { useDashboard } from '@/stores/DashboardContext'
import { toast } from 'sonner'

interface ImportBudgetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportBudgetModal({ open, onOpenChange }: ImportBudgetModalProps) {
  const { importBudget } = useDashboard()

  const handleImport = () => {
    // Simulating file import processing
    const mockNewBudget = {
      Moradia: 2800,
      Alimentação: 1500,
      Transporte: 800,
      Lazer: 500,
      Saúde: 400,
    }
    importBudget(mockNewBudget)
    toast.success('Orçamento importado com sucesso!')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar Orçamento</DialogTitle>
          <DialogDescription>
            Faça o upload do seu arquivo de planejamento (.csv, .xlsx)
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-10 mt-4 bg-muted/30 transition-colors hover:bg-muted/50 cursor-pointer">
          <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-sm font-medium text-foreground mb-1">Arraste e solte o arquivo aqui</p>
          <p className="text-xs text-muted-foreground mb-4">ou clique para selecionar</p>
          <Button variant="secondary" size="sm" onClick={handleImport}>
            Simular Importação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { UploadCloud, FileSpreadsheet } from 'lucide-react'
import { toast } from 'sonner'

interface ImportDataModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportDataModal({ open, onOpenChange }: ImportDataModalProps) {
  const handleImport = () => {
    toast.success('Dados importados com sucesso! O painel foi atualizado.')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Importar Dados Históricos
          </DialogTitle>
          <DialogDescription>
            Faça o upload do seu arquivo contendo o histórico de transações (.csv, .xlsx).
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/40 p-4 rounded-lg text-sm text-muted-foreground border border-border/50 mb-2">
          <p className="font-medium text-foreground mb-1">Mapeamento de Colunas Necessárias:</p>
          <p>
            Data, Estabelecimento, Despesa (Categoria Principal), Classificação (Subcategoria),
            Valor, Fixa/Variável, Forma pgto.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-lg p-10 bg-primary/5 transition-colors hover:bg-primary/10 cursor-pointer group">
          <UploadCloud className="h-12 w-12 text-primary/60 mb-4 group-hover:text-primary transition-colors group-hover:scale-110 duration-300" />
          <p className="text-sm font-medium text-foreground mb-1">
            Arraste e solte a planilha aqui
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            Suporta arquivos exportados do Google Sheets
          </p>
          <Button variant="default" onClick={handleImport} className="shadow-lg shadow-primary/20">
            Selecionar Arquivo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

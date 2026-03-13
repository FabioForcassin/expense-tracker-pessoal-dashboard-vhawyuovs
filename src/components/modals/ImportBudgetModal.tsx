import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { UploadCloud, FileSpreadsheet, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ImportDataModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportDataModal({ open, onOpenChange }: ImportDataModalProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files).filter((f) =>
      f.name.match(/\.(csv|xlsx|xls)$/i),
    )
    if (droppedFiles.length) {
      setFiles((prev) => [...prev, ...droppedFiles])
    } else {
      toast.error('Por favor, envie apenas arquivos de planilha (.csv, .xlsx).')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...selectedFiles])
    }
  }

  const handleImport = () => {
    if (files.length === 0) return
    setIsProcessing(true)
    setTimeout(() => {
      toast.success('Lote de dados importado com sucesso! O painel foi atualizado.')
      setFiles([])
      setIsProcessing(false)
      onOpenChange(false)
    }, 1500)
  }

  const determineFileType = (filename: string) => {
    const lower = filename.toLowerCase()
    if (lower.includes('realizado')) return 'Realizado'
    if (lower.includes('orçamento') || lower.includes('orcamento')) return 'Orçamento'
    return 'Desconhecido'
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!isProcessing) onOpenChange(val)
      }}
    >
      <DialogContent className="glass sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Importação em Lote
          </DialogTitle>
          <DialogDescription>
            Faça o upload de múltiplas planilhas para atualizar o Realizado ou Orçamento.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/40 p-3 rounded-lg text-xs text-muted-foreground border border-border/50 mb-2">
          <p className="font-medium text-foreground mb-1">Dica de Nomenclatura:</p>
          <p>
            Arquivos com "realizado" no nome atualizam transações reais. Arquivos com "orçamento"
            atualizam metas.
          </p>
        </div>

        <label
          className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-lg p-8 bg-primary/5 transition-colors hover:bg-primary/10 cursor-pointer group mb-4"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept=".csv, .xlsx, .xls"
            className="hidden"
            onChange={handleFileSelect}
          />
          <UploadCloud className="h-10 w-10 text-primary/60 mb-3 group-hover:text-primary transition-colors group-hover:scale-110 duration-300" />
          <p className="text-sm font-medium text-foreground mb-1">
            Arraste e solte planilhas aqui ou clique
          </p>
          <p className="text-xs text-muted-foreground">CSV ou XLSX suportados</p>
        </label>

        {files.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">Arquivos Prontos ({files.length}):</p>
            <ScrollArea className="h-[120px] w-full rounded-md border border-border/50 bg-background/50 p-2">
              <div className="flex flex-col gap-2">
                {files.map((f, i) => {
                  const type = determineFileType(f.name)
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 text-sm bg-background rounded border border-border/40 shadow-sm"
                    >
                      <span className="truncate max-w-[200px] font-medium" title={f.name}>
                        {f.name}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          type === 'Realizado'
                            ? 'bg-primary/10 text-primary'
                            : type === 'Orçamento'
                              ? 'bg-amber-500/10 text-amber-600'
                              : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {type}
                      </span>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setFiles([])}
            disabled={files.length === 0 || isProcessing}
          >
            Limpar
          </Button>
          <Button
            onClick={handleImport}
            disabled={files.length === 0 || isProcessing}
            className="min-w-[120px]"
          >
            {isProcessing ? 'Processando...' : 'Importar Dados'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

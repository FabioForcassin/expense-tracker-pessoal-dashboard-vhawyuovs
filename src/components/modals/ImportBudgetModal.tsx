import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UploadCloud, FileSpreadsheet } from 'lucide-react'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useDashboard } from '@/stores/DashboardContext'
import { Expense } from '@/types'

interface ImportDataModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportDataModal({ open, onOpenChange }: ImportDataModalProps) {
  const { bulkImportData } = useDashboard()
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [importType, setImportType] = useState<'realizado' | 'orcamento'>('realizado')
  const [year, setYear] = useState('2024')

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

  const handleImport = async () => {
    if (files.length === 0) return
    setIsProcessing(true)

    try {
      const parsedExpenses: Expense[] = []

      for (const file of files) {
        if (file.name.match(/\.csv$/i)) {
          const text = await file.text()
          const lines = text.split('\n')
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim()
            if (!line) continue
            // Support both comma and semicolon separators
            const separator = line.includes(';') ? ';' : ','
            const regex = new RegExp(`${separator}(?=(?:(?:[^"]*"){2})*[^"]*$)`)
            const cols = line.split(regex).map((s) => s.replace(/^"|"$/g, '').trim())

            if (cols.length >= 5) {
              parsedExpenses.push({
                id: `imp_${file.name}_${Date.now()}_${i}`,
                date: cols[0] || `${year}-01-01`,
                monthNum: parseInt(cols[1]) || 1,
                competency: cols[2] || 'Jan',
                // Column E is index 4
                establishment: cols[4] || 'Desconhecido',
                primaryCategory: cols[5] || 'Outros',
                secondaryCategory: cols[6] || 'Outros',
                type: (cols[7] as any) || 'Variável',
                paymentMethod: cols[8] || 'Dinheiro',
                value: parseFloat(cols[9]) || 0,
                // Column K is index 10
                comment: cols[10] !== undefined ? cols[10] : '',
                // Column L is index 11
                classification: cols[11] || 'Pessoal',
                // Column M is index 12
                who: cols[12] || 'Usuário',
              })
            }
          }
        }
      }

      setTimeout(() => {
        bulkImportData(importType, year, parsedExpenses.length > 0 ? parsedExpenses : undefined)
        toast.success(`Lote de dados (${importType} - ${year}) importado com sucesso!`)
        setFiles([])
        setIsProcessing(false)
        onOpenChange(false)
      }, 1000)
    } catch (e) {
      toast.error('Erro ao processar arquivo')
      setIsProcessing(false)
    }
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
            Importação Inteligente
          </DialogTitle>
          <DialogDescription>
            Faça o upload de planilhas de anos fiscais diferentes para atualizar seus dados.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 my-2">
          <div className="space-y-3">
            <Label className="text-foreground">Qual o tipo de importação?</Label>
            <RadioGroup defaultValue={importType} onValueChange={(v: any) => setImportType(v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="realizado" id="r1" />
                <Label htmlFor="r1" className="cursor-pointer font-normal">
                  Realizado
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="orcamento" id="r2" />
                <Label htmlFor="r2" className="cursor-pointer font-normal">
                  Orçamento
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-3">
            <Label className="text-foreground">Selecione o Ano</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <label
          className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-lg p-8 bg-primary/5 transition-colors hover:bg-primary/10 cursor-pointer group mt-2 mb-4"
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
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 text-sm bg-background rounded border border-border/40 shadow-sm"
                  >
                    <span className="truncate max-w-[200px] font-medium" title={f.name}>
                      {f.name}
                    </span>
                  </div>
                ))}
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

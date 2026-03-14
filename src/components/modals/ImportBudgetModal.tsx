import { useState, useMemo } from 'react'
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
import { UploadCloud, FileSpreadsheet, Download, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useDashboard } from '@/stores/DashboardContext'
import { Expense } from '@/types'
import { downloadImportTemplate } from '@/lib/export'
import { parseImportFile } from '@/lib/import-parser'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

export function ImportDataModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { bulkImportData, expenses } = useDashboard()
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [importType, setImportType] = useState<'realizado' | 'orcamento'>('realizado')
  const [year, setYear] = useState('2024')

  const [step, setStep] = useState<'upload' | 'preview'>('upload')
  const [previewData, setPreviewData] = useState<Expense[]>([])
  const [importErrors, setImportErrors] = useState<string[]>([])

  const availableYears = useMemo(
    () =>
      Array.from(
        new Set(
          expenses
            .map((e) => e.date.split('-')[0])
            .concat(['2024', '2025', '2026', '2027', '2028'])
            .filter(Boolean),
        ),
      ).sort(),
    [expenses],
  )

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const valid = Array.from(e.dataTransfer.files).filter((f) => f.name.match(/\.(csv|xlsx|xls)$/i))
    if (valid.length) {
      setFiles((p) => [...p, ...valid])
    } else {
      toast.error('Apenas arquivos .csv ou .xlsx')
    }
  }

  const handleImport = async () => {
    if (!files.length) return
    setIsProcessing(true)
    setImportErrors([])
    try {
      let allParsed: Expense[] = [],
        allErrs: string[] = []
      for (const f of files) {
        if (f.name.match(/\.(csv|xlsx|xls)$/i)) {
          const { parsed, errs } = await parseImportFile(f, year)
          allParsed.push(...parsed)
          allErrs.push(...errs.map((e) => `[${f.name}] ${e}`))
        }
      }
      if (allParsed.length > 0) {
        setPreviewData(allParsed)
        setImportErrors(allErrs)
        setStep('preview')
      } else {
        toast.warning('Nenhum registro encontrado.')
        setFiles([])
      }
    } catch {
      toast.error('Erro ao processar arquivo.')
    } finally {
      setIsProcessing(false)
    }
  }

  const confirmImport = () => {
    bulkImportData(importType, year, previewData)
    toast.success(`${previewData.length} registros importados!`)
    resetModal()
  }

  const resetModal = () => {
    setFiles([])
    setPreviewData([])
    setImportErrors([])
    setStep('upload')
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!isProcessing && !v) resetModal()
      }}
    >
      <DialogContent
        className={`glass ${step === 'preview' ? 'sm:max-w-[800px]' : 'sm:max-w-[550px]'}`}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Importação Inteligente
          </DialogTitle>
          <DialogDescription>
            {step === 'upload'
              ? 'Upload de planilhas para atualização.'
              : 'Revise os dados antes da importação.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' ? (
          <>
            <div className="grid grid-cols-2 gap-6 my-2">
              <div className="space-y-3">
                <Label>Tipo</Label>
                <RadioGroup defaultValue={importType} onValueChange={(v: any) => setImportType(v)}>
                  <div className="flex gap-2 items-center">
                    <RadioGroupItem value="realizado" id="r1" />
                    <Label htmlFor="r1">Realizado</Label>
                  </div>
                  <div className="flex gap-2 items-center">
                    <RadioGroupItem value="orcamento" id="r2" />
                    <Label htmlFor="r2">Orçamento</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-3">
                <Label>Ano Fiscal</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={downloadImportTemplate}
              className="w-full gap-2 text-primary mb-2 mt-2"
            >
              <Download className="w-4 h-4" /> Template
            </Button>
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-lg p-8 hover:bg-primary/5 cursor-pointer mt-2 mb-4"
            >
              <input
                type="file"
                multiple
                accept=".csv,.xlsx"
                className="hidden"
                onChange={(e) =>
                  e.target.files && setFiles((p) => [...p, ...Array.from(e.target.files!)])
                }
              />
              <UploadCloud className="h-10 w-10 text-primary/60 mb-3" />
              <p className="text-sm font-medium">Arraste arquivos ou clique</p>
            </label>
            {files.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold mb-2">Arquivos ({files.length}):</p>
                <ScrollArea className="h-24 border rounded p-2">
                  <div className="flex flex-col gap-2">
                    {files.map((f, i) => (
                      <div key={i} className="p-2 text-sm bg-background border rounded shadow-sm">
                        {f.name}
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
                disabled={!files.length || isProcessing}
              >
                Limpar
              </Button>
              <Button onClick={handleImport} disabled={!files.length || isProcessing}>
                {isProcessing ? 'Analisando...' : 'Analisar'}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center bg-muted/30 p-2 px-3 rounded border">
              <span className="text-sm font-medium">Registros mapeados:</span>
              <Badge className="bg-success text-white hover:bg-success/90">
                {previewData.length}
              </Badge>
            </div>
            {importErrors.length > 0 && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-sm">
                  Avisos de leitura ({importErrors.length})
                </AlertTitle>
                <AlertDescription>
                  <ScrollArea className="h-16 text-xs">
                    <ul className="list-disc pl-4">
                      {importErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </ScrollArea>
                </AlertDescription>
              </Alert>
            )}
            <div className="border rounded-md shadow-sm overflow-hidden">
              <ScrollArea className="h-[250px]">
                <Table className="text-xs">
                  <TableHeader className="bg-muted/50 sticky top-0">
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Local</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.slice(0, 15).map((r, i) => (
                      <TableRow key={i}>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>{r.establishment}</TableCell>
                        <TableCell>{r.primaryCategory}</TableCell>
                        <TableCell className="text-right">{r.value.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    {previewData.length > 15 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          + {previewData.length - 15} registros ocultos
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStep('upload')}>
                Voltar
              </Button>
              <Button onClick={confirmImport}>Confirmar</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

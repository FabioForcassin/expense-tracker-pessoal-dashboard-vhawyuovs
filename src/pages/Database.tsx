import { useState, useMemo, useEffect } from 'react'
import { useDashboard } from '@/stores/DashboardContext'
import { DatabaseTransactionsTable } from '@/components/dashboard/DatabaseTransactionsTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Database as DatabaseIcon, Download, FileSpreadsheet } from 'lucide-react'
import { ImportDataModal } from '@/components/modals/ImportBudgetModal'
import { exportToCSV } from '@/lib/export'

const monthsLabels = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

function BudgetCell({
  initialValue,
  onSave,
}: {
  initialValue: number
  onSave: (v: number) => void
}) {
  const [val, setVal] = useState(initialValue.toString())
  useEffect(() => {
    setVal(initialValue.toString())
  }, [initialValue])

  const handleBlur = () => {
    const num = parseFloat(val)
    if (!isNaN(num) && num !== initialValue) {
      onSave(num)
    } else {
      setVal(initialValue.toString())
    }
  }

  return (
    <Input
      type="number"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={handleBlur}
      className="h-8 w-full min-w-[70px] max-w-[90px] text-right text-xs px-2 bg-transparent focus:bg-background border-transparent focus:border-border"
    />
  )
}

export default function Database() {
  const { categories, budget, updateBudget, expenses } = useDashboard()
  const [localYear, setLocalYear] = useState('2024')
  const [isImportModalOpen, setImportModalOpen] = useState(false)
  const [autoReplicate, setAutoReplicate] = useState(false)

  const availableYears = useMemo(() => {
    const years = new Set(expenses.map((e) => e.date.split('-')[0]).filter(Boolean))
    ;['2024', '2025', '2026', '2027', '2028'].forEach((y) => years.add(y))
    return Array.from(years).sort()
  }, [expenses])

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in flex flex-col gap-6 h-full pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <DatabaseIcon className="w-6 h-6" />
            </div>
            Banco de Dados
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Gerencie os dados brutos e ajuste o seu planejamento orçamentário.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => exportToCSV(expenses, 'dados_historico.csv')}
            className="gap-2 shrink-0 bg-success hover:bg-success/90 text-success-foreground shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Exportar Excel
          </Button>
          <Button onClick={() => setImportModalOpen(true)} className="gap-2 shrink-0 shadow-md">
            <Download className="w-4 h-4" />
            Importar Lote
          </Button>
        </div>
      </div>

      <Tabs defaultValue="orcamento" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-4 bg-muted/50 p-1">
          <TabsTrigger value="orcamento" className="data-[state=active]:bg-background shadow-sm">
            Orçamento (Grid)
          </TabsTrigger>
          <TabsTrigger value="realizado" className="data-[state=active]:bg-background shadow-sm">
            Realizado
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orcamento" className="flex flex-col gap-4 mt-0">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-card p-4 rounded-lg border shadow-sm gap-4">
            <p className="text-sm text-muted-foreground">
              Edite as metas mensais. As alterações são salvas automaticamente.
            </p>
            <div className="flex items-center flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border">
                <Switch id="auto-rep" checked={autoReplicate} onCheckedChange={setAutoReplicate} />
                <Label htmlFor="auto-rep" className="cursor-pointer text-xs font-medium">
                  Auto-replicar p/ meses seguintes
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Ano Fiscal:</span>
                <Select value={localYear} onValueChange={setLocalYear}>
                  <SelectTrigger className="w-[100px] h-9 bg-background">
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
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden flex-1">
            <div className="overflow-x-auto max-h-[600px] scroll-smooth relative">
              <Table className="w-full border-collapse text-sm">
                <TableHeader className="sticky top-0 z-30 bg-muted/95 backdrop-blur shadow-sm">
                  <TableRow>
                    <TableHead className="sticky left-0 z-40 bg-muted/95 backdrop-blur w-[150px] min-w-[150px]">
                      Categoria
                    </TableHead>
                    <TableHead className="sticky left-[150px] z-40 bg-muted/95 backdrop-blur w-[180px] min-w-[180px] border-r">
                      Subcategoria
                    </TableHead>
                    {monthsLabels.map((m) => (
                      <TableHead
                        key={`th-${m}`}
                        className="min-w-[90px] text-right pr-4 font-semibold text-foreground"
                      >
                        {m}
                      </TableHead>
                    ))}
                    <TableHead className="min-w-[100px] text-right font-bold pr-4 border-l bg-muted">
                      Total Ano
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((cat) =>
                    cat.subcategories.map((sub) => {
                      let rowTotal = 0
                      return (
                        <TableRow
                          key={`${cat.id}-${sub}`}
                          className="hover:bg-muted/30 border-b border-border/50"
                        >
                          <TableCell className="sticky left-0 z-20 bg-card font-medium text-xs text-muted-foreground border-r border-border/10">
                            {cat.name}
                          </TableCell>
                          <TableCell className="sticky left-[150px] z-20 bg-card border-r text-xs font-medium text-foreground">
                            {sub}
                          </TableCell>
                          {monthsLabels.map((_, mIdx) => {
                            const monthKey = `${localYear}-${String(mIdx + 1).padStart(2, '0')}`
                            const key = `${cat.name}|${sub}|${monthKey}`
                            const val = budget[key] || 0
                            rowTotal += val
                            return (
                              <TableCell
                                key={`${cat.id}-${sub}-${monthKey}`}
                                className="p-1 border-r border-border/20 last:border-0"
                              >
                                <BudgetCell
                                  initialValue={val}
                                  onSave={(newVal) => {
                                    if (autoReplicate) {
                                      for (let m = mIdx; m < 12; m++) {
                                        const mKeyForLoop = `${localYear}-${String(m + 1).padStart(2, '0')}`
                                        const loopKey = `${cat.name}|${sub}|${mKeyForLoop}`
                                        updateBudget(loopKey, newVal)
                                      }
                                    } else {
                                      updateBudget(key, newVal)
                                    }
                                  }}
                                />
                              </TableCell>
                            )
                          })}
                          <TableCell className="text-right font-bold text-xs pr-4 border-l bg-muted/20 text-primary">
                            {rowTotal.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                          </TableCell>
                        </TableRow>
                      )
                    }),
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="realizado" className="mt-0">
          <DatabaseTransactionsTable />
        </TabsContent>
      </Tabs>

      <ImportDataModal open={isImportModalOpen} onOpenChange={setImportModalOpen} />
    </div>
  )
}

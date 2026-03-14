import { useState, useEffect } from 'react'
import { useDashboard } from '@/stores/DashboardContext'
import { TransactionsTable } from '@/components/dashboard/TransactionsTable'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Database as DatabaseIcon, Download } from 'lucide-react'
import { ImportDataModal } from '@/components/modals/ImportBudgetModal'

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
      className="h-8 w-full min-w-[70px] max-w-[90px] text-right text-xs px-2 bg-transparent focus:bg-background"
    />
  )
}

export default function Database() {
  const { categories, budget, updateBudget } = useDashboard()
  const [selectedYear, setSelectedYear] = useState('2024')
  const [isImportModalOpen, setImportModalOpen] = useState(false)

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
        <Button onClick={() => setImportModalOpen(true)} className="gap-2 shrink-0">
          <Download className="w-4 h-4" />
          Importar Lote
        </Button>
      </div>

      <Tabs defaultValue="orcamento" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-4">
          <TabsTrigger value="orcamento">Orçamento (Grid)</TabsTrigger>
          <TabsTrigger value="realizado">Realizado</TabsTrigger>
        </TabsList>

        <TabsContent value="orcamento" className="flex flex-col gap-4 mt-0">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Edite as metas mensais diretamente na tabela. As alterações são salvas
              automaticamente.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Ano Fical:</span>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden flex-1">
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
                      <TableHead key={m} className="min-w-[90px] text-right pr-4">
                        {m}
                      </TableHead>
                    ))}
                    <TableHead className="min-w-[100px] text-right font-bold pr-4 border-l">
                      Total Ano
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((cat) =>
                    cat.subcategories.map((sub, i) => {
                      let rowTotal = 0
                      return (
                        <TableRow key={`${cat.name}-${sub}`} className="hover:bg-muted/30">
                          <TableCell className="sticky left-0 z-20 bg-background/95 backdrop-blur font-medium text-xs text-muted-foreground">
                            {cat.name}
                          </TableCell>
                          <TableCell className="sticky left-[150px] z-20 bg-background/95 backdrop-blur border-r text-xs">
                            {sub}
                          </TableCell>
                          {monthsLabels.map((_, mIdx) => {
                            const monthKey = `${selectedYear}-${String(mIdx + 1).padStart(2, '0')}`
                            const key = `${cat.name}|${sub}|${monthKey}`
                            const val = budget[key] || 0
                            rowTotal += val
                            return (
                              <TableCell key={mIdx} className="p-1">
                                <BudgetCell
                                  initialValue={val}
                                  onSave={(newVal) => updateBudget(key, newVal)}
                                />
                              </TableCell>
                            )
                          })}
                          <TableCell className="text-right font-bold text-xs pr-4 border-l bg-muted/10">
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
          <TransactionsTable full />
        </TabsContent>
      </Tabs>

      <ImportDataModal open={isImportModalOpen} onOpenChange={setImportModalOpen} />
    </div>
  )
}

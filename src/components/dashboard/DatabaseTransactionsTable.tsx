import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { useDashboard, useFilteredExpenses } from '@/stores/DashboardContext'
import { formatCurrency, formatDate } from '@/lib/format'
import { ArrowDownRight, ArrowUpRight, Database, Trash2, Filter } from 'lucide-react'
import { toast } from 'sonner'
import { InstallmentBadge } from '@/components/shared/InstallmentBadge'

export function DatabaseTransactionsTable() {
  const { deleteExpenses, categories } = useDashboard()

  const filteredDataRaw = useFilteredExpenses(true)

  // Advanced Grid Filters
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [subFilter, setSubFilter] = useState('all')

  const filteredData = [...filteredDataRaw]
    .filter((tx) => {
      if (dateFrom && tx.date < dateFrom) return false
      if (dateTo && tx.date > dateTo) return false
      if (catFilter !== 'all' && tx.primaryCategory !== catFilter) return false
      if (subFilter !== 'all' && tx.secondaryCategory !== subFilter) return false
      return true
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newIds = new Set([...selectedIds, ...filteredData.map((d) => d.id)])
      setSelectedIds(Array.from(newIds))
    } else {
      const filteredIds = filteredData.map((d) => d.id)
      setSelectedIds(selectedIds.filter((id) => !filteredIds.includes(id)))
    }
  }

  const handleSelectRow = (checked: boolean, id: string) => {
    if (checked) setSelectedIds([...selectedIds, id])
    else setSelectedIds(selectedIds.filter((item) => item !== id))
  }

  const openDeleteDialog = (id?: string) => {
    setItemToDelete(id || null)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      if (itemToDelete) {
        await deleteExpenses([itemToDelete])
        toast.success('Transação excluída com sucesso.')
        setSelectedIds(selectedIds.filter((id) => id !== itemToDelete))
      } else if (selectedIds.length > 0) {
        await deleteExpenses(selectedIds)
        toast.success(`${selectedIds.length} transações excluídas com sucesso.`)
        setSelectedIds([])
      }
    } catch (err) {
      toast.error('Erro ao excluir transações.')
    } finally {
      setIsDeleting(false)
      setItemToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const netSubtotal = filteredData.reduce((acc, t) => {
    return acc + (t.primaryCategory === 'Receitas' ? t.value : -t.value)
  }, 0)

  const isAllSelected =
    filteredData.length > 0 && filteredData.every((d) => selectedIds.includes(d.id))

  return (
    <Card className="glass mt-4 flex flex-col flex-1 min-h-0">
      <CardHeader className="pb-4 border-b border-border/40 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Gerenciamento de Registros (Realizado)
          </CardTitle>
          <div className="flex items-center gap-4">
            {selectedIds.length > 0 && (
              <Button variant="destructive" size="sm" onClick={() => openDeleteDialog()}>
                <Trash2 className="w-4 h-4 mr-2" /> Excluir ({selectedIds.length})
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-muted/30 p-4 rounded-lg mt-4 border border-border/50">
          <div className="flex items-center gap-2 w-full mb-1">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Filtros Avançados</span>
          </div>
          <div className="flex flex-col gap-1.5 w-full sm:w-auto">
            <Label className="text-xs">Data Inicial</Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <div className="flex flex-col gap-1.5 w-full sm:w-auto">
            <Label className="text-xs">Data Final</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <div className="flex flex-col gap-1.5 w-full sm:w-auto flex-1 min-w-[150px]">
            <Label className="text-xs">Categoria</Label>
            <Select
              value={catFilter}
              onValueChange={(v) => {
                setCatFilter(v)
                setSubFilter('all')
              }}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5 w-full sm:w-auto flex-1 min-w-[150px]">
            <Label className="text-xs">Subcategoria</Label>
            <Select value={subFilter} onValueChange={setSubFilter}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {catFilter !== 'all' &&
                  categories
                    .find((c) => c.name === catFilter)
                    ?.subcategories.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDateFrom('')
                setDateTo('')
                setCatFilter('all')
                setSubFilter('all')
              }}
              className="h-8 text-xs"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-hidden flex-1 flex flex-col relative min-h-0">
        <div className="overflow-auto flex-1">
          <Table className="min-w-[900px] text-sm">
            <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[40px] text-center">
                  <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
                </TableHead>
                <TableHead className="w-[100px] whitespace-nowrap">Data</TableHead>
                <TableHead className="min-w-[150px]">Descrição/Origem</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Subcategoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Pgto/Conta</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                    Nenhum registro encontrado para os filtros atuais.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((tx) => {
                  const isIncome = tx.primaryCategory === 'Receitas'
                  return (
                    <TableRow key={tx.id} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="text-center">
                        <Checkbox
                          checked={selectedIds.includes(tx.id)}
                          onCheckedChange={(c) => handleSelectRow(c as boolean, tx.id)}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap font-medium">
                        {formatDate(tx.date)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isIncome ? (
                            <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                              <ArrowDownRight className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <InstallmentBadge
                            isInstallment={tx.isInstallment}
                            current={tx.currentInstallment}
                            total={tx.totalInstallments}
                          />
                          <span className="font-medium text-foreground truncate">
                            {tx.establishment}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{tx.primaryCategory}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {tx.secondaryCategory}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-[10px] font-normal px-2 py-0.5 border-border/60"
                        >
                          {tx.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {tx.paymentMethod}
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold whitespace-nowrap ${isIncome ? 'text-success' : 'text-foreground'}`}
                      >
                        {isIncome ? '+' : '-'} {formatCurrency(tx.value)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          onClick={() => openDeleteDialog(tx.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
            <TableFooter className="sticky bottom-0 bg-muted/90 backdrop-blur z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t">
              <TableRow>
                <TableCell colSpan={7} className="text-right font-bold text-foreground">
                  Subtotal dos Registros Visíveis:
                </TableCell>
                <TableCell
                  className={`text-right font-bold whitespace-nowrap ${netSubtotal >= 0 ? 'text-success' : 'text-destructive'}`}
                >
                  {netSubtotal > 0 ? '+' : ''}
                  {formatCurrency(netSubtotal)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir{' '}
              {itemToDelete ? 'esta transação' : `estas ${selectedIds.length} transações`}? Esta
              ação removerá permanentemente os dados do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

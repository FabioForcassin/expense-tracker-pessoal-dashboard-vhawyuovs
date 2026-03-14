import { useState, useMemo } from 'react'
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
import { useDashboard } from '@/stores/DashboardContext'
import { formatCurrency, formatDate } from '@/lib/format'
import { ArrowDownRight, ArrowUpRight, Database, Trash2, Filter, Search, FileX } from 'lucide-react'
import { toast } from 'sonner'
import { InstallmentBadge } from '@/components/shared/InstallmentBadge'

export function DatabaseTransactionsTable() {
  const { expenses, deleteExpenses, categories } = useDashboard()

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [subFilter, setSubFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = useMemo(() => {
    return expenses
      .filter((tx) => {
        if (dateFrom && tx.date < dateFrom) return false
        if (dateTo && tx.date > dateTo) return false
        if (catFilter !== 'all' && tx.primaryCategory !== catFilter) return false
        if (subFilter !== 'all' && tx.secondaryCategory !== subFilter) return false
        if (searchTerm && !tx.establishment.toLowerCase().includes(searchTerm.toLowerCase()))
          return false
        return true
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [expenses, dateFrom, dateTo, catFilter, subFilter, searchTerm])

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

  const netSubtotal = filteredData.reduce(
    (acc, t) => acc + (t.primaryCategory === 'Receitas' ? t.value : -t.value),
    0,
  )
  const isAllSelected =
    filteredData.length > 0 && filteredData.every((d) => selectedIds.includes(d.id))

  return (
    <Card className="glass mt-4 flex flex-col flex-1 min-h-0 border-none shadow-none sm:border-solid sm:shadow-sm">
      <CardHeader className="pb-4 border-b border-border/40 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Gerenciamento de Registros (Realizado)
          </CardTitle>
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => openDeleteDialog()}
              className="h-8 text-xs w-full sm:w-auto"
            >
              <Trash2 className="w-3.5 h-3.5 mr-2" /> Excluir ({selectedIds.length})
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-muted/30 p-3 rounded-lg mt-4 border border-border/50">
          <div className="flex items-center gap-2 w-full mb-1">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Filtros da Tabela</span>
          </div>

          <div className="flex flex-col gap-1.5 w-full sm:w-auto flex-1 min-w-[160px]">
            <Label className="text-[11px] text-muted-foreground">Buscar Descrição</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Ex: Mercado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-xs pl-8"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-[48%] sm:w-auto">
            <Label className="text-[11px] text-muted-foreground">Data Inicial</Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-8 text-xs"
            />
          </div>

          <div className="flex flex-col gap-1.5 w-[48%] sm:w-auto">
            <Label className="text-[11px] text-muted-foreground">Data Final</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-8 text-xs"
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full sm:w-auto flex-1 min-w-[140px]">
            <Label className="text-[11px] text-muted-foreground">Categoria</Label>
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

          <div className="flex flex-col gap-1.5 w-full sm:w-auto flex-1 min-w-[140px]">
            <Label className="text-[11px] text-muted-foreground">Subcategoria</Label>
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

          <div className="flex items-end w-full sm:w-auto ml-auto pt-1 sm:pt-5">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs w-full sm:w-auto text-muted-foreground"
              onClick={() => {
                setDateFrom('')
                setDateTo('')
                setCatFilter('all')
                setSubFilter('all')
                setSearchTerm('')
              }}
            >
              Limpar
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-hidden flex-1 flex flex-col relative min-h-0">
        <div className="overflow-auto flex-1">
          <Table className="min-w-[900px] text-xs">
            <TableHeader className="bg-muted/80 sticky top-0 z-10 shadow-sm backdrop-blur">
              <TableRow className="hover:bg-transparent h-9">
                <TableHead className="w-[40px] text-center px-2 py-1">
                  <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
                </TableHead>
                <TableHead className="w-[90px] whitespace-nowrap px-2 py-1">Data</TableHead>
                <TableHead className="min-w-[180px] px-2 py-1">Descrição/Origem</TableHead>
                <TableHead className="px-2 py-1">Categoria</TableHead>
                <TableHead className="px-2 py-1">Subcategoria</TableHead>
                <TableHead className="px-2 py-1">Tipo</TableHead>
                <TableHead className="px-2 py-1">Pgto/Conta</TableHead>
                <TableHead className="text-right px-2 py-1">Valor</TableHead>
                <TableHead className="w-[50px] px-2 py-1"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-64 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Database className="w-6 h-6 text-muted-foreground/60" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          Seu banco de dados está vazio
                        </p>
                        <p className="text-xs mt-1">
                          Adicione registros ou importe uma planilha para começar.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-40 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileX className="w-6 h-6 text-muted-foreground/40" />
                      <p className="text-xs">Nenhum registro encontrado para os filtros atuais.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((tx) => {
                  const isIncome = tx.primaryCategory === 'Receitas'
                  return (
                    <TableRow
                      key={tx.id}
                      className="hover:bg-muted/40 transition-colors h-9 border-border/50"
                    >
                      <TableCell className="text-center px-2 py-1.5">
                        <Checkbox
                          checked={selectedIds.includes(tx.id)}
                          onCheckedChange={(c) => handleSelectRow(c as boolean, tx.id)}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap font-medium px-2 py-1.5">
                        {formatDate(tx.date)}
                      </TableCell>
                      <TableCell className="px-2 py-1.5">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isIncome ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}
                          >
                            {isIncome ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3" />
                            )}
                          </div>
                          <InstallmentBadge
                            isInstallment={tx.isInstallment}
                            current={tx.currentInstallment}
                            total={tx.totalInstallments}
                            className="w-4 h-4 [&_svg]:w-2.5 [&_svg]:h-2.5"
                          />
                          <span className="font-medium text-foreground truncate max-w-[200px]">
                            {tx.establishment}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-2 py-1.5">{tx.primaryCategory}</TableCell>
                      <TableCell className="text-muted-foreground px-2 py-1.5">
                        {tx.secondaryCategory}
                      </TableCell>
                      <TableCell className="px-2 py-1.5">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-normal px-1.5 py-0 border-border/60"
                        >
                          {tx.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap px-2 py-1.5">
                        {tx.paymentMethod}
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold whitespace-nowrap px-2 py-1.5 ${isIncome ? 'text-success' : 'text-foreground'}`}
                      >
                        {isIncome ? '+' : '-'} {formatCurrency(tx.value)}
                      </TableCell>
                      <TableCell className="text-right px-2 py-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => openDeleteDialog(tx.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
            <TableFooter className="sticky bottom-0 bg-muted/95 backdrop-blur z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t">
              <TableRow className="h-10">
                <TableCell
                  colSpan={7}
                  className="text-right font-semibold text-foreground px-2 py-1.5"
                >
                  Subtotal dos Registros Visíveis:
                </TableCell>
                <TableCell
                  className={`text-right font-bold whitespace-nowrap px-2 py-1.5 text-sm ${netSubtotal >= 0 ? 'text-success' : 'text-destructive'}`}
                >
                  {netSubtotal > 0 ? '+' : ''}
                  {formatCurrency(netSubtotal)}
                </TableCell>
                <TableCell className="px-2 py-1.5"></TableCell>
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
              {itemToDelete ? 'este registro' : `estes ${selectedIds.length} registros`}? Esta ação
              removerá permanentemente os dados do banco de dados e os totais serão atualizados
              imediatamente.
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

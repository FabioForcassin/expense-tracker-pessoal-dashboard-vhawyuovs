import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
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
import { ArrowDownRight, ArrowUpRight, Database, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { InstallmentBadge } from '@/components/shared/InstallmentBadge'

export function DatabaseTransactionsTable() {
  const { deleteExpenses } = useDashboard()

  const filteredDataRaw = useFilteredExpenses(true)
  const filteredData = [...filteredDataRaw].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

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
    if (checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    }
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
    <Card className="glass mt-4 flex flex-col">
      <CardHeader className="pb-4 border-b border-border/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Gerenciamento de Registros
          </CardTitle>
          <div className="flex items-center gap-4">
            {selectedIds.length > 0 && (
              <Button variant="destructive" size="sm" onClick={() => openDeleteDialog()}>
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir ({selectedIds.length})
              </Button>
            )}
            <div
              className={`px-3 py-1.5 font-semibold text-sm rounded-md border ${netSubtotal >= 0 ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}
            >
              Subtotal: {netSubtotal > 0 ? '+' : ''}
              {formatCurrency(netSubtotal)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-6 sm:pt-4 overflow-x-auto flex flex-col gap-4">
        {/* Table */}
        <div className="border rounded-md shadow-sm overflow-hidden">
          <Table className="min-w-[900px] text-sm">
            <TableHeader className="bg-muted/50">
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
                          <span className="font-medium text-foreground truncate">
                            {tx.establishment}
                          </span>
                          <InstallmentBadge
                            isInstallment={tx.isInstallment}
                            current={tx.currentInstallment}
                            total={tx.totalInstallments}
                          />
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
                        {isIncome ? '+' : '-'}
                        {formatCurrency(tx.value)}
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

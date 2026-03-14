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
import { Badge } from '@/components/ui/badge'
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
import { useDashboard, useFilteredExpenses } from '@/stores/DashboardContext'
import { formatCurrency, formatDate } from '@/lib/format'
import { ArrowDownRight, ArrowUpRight, ListFilter, Trash2 } from 'lucide-react'
import { InstallmentBadge } from '@/components/shared/InstallmentBadge'
import { toast } from 'sonner'

export function FilteredTransactionsTable({ full = false }: { full?: boolean }) {
  const { deleteExpenses } = useDashboard()
  const filteredTransactions = useFilteredExpenses(true)

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const netSubtotal = sortedTransactions.reduce((acc, t) => {
    return acc + (t.primaryCategory === 'Receitas' ? t.value : -t.value)
  }, 0)

  const finalData = full ? sortedTransactions : sortedTransactions.slice(0, 50)

  const handleDelete = async () => {
    if (!itemToDelete) return
    setIsDeleting(true)
    try {
      await deleteExpenses([itemToDelete])
      toast.success('Transação excluída com sucesso.')
    } catch {
      toast.error('Erro ao excluir transação.')
    } finally {
      setIsDeleting(false)
      setItemToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <Card className="glass mb-6">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-primary" />
          Lista de Despesas (Filtrada)
        </CardTitle>
        <div
          className={`px-3 py-1.5 font-semibold text-sm rounded-md border ${netSubtotal >= 0 ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}
        >
          Subtotal Filtrado: {netSubtotal > 0 ? '+' : ''}
          {formatCurrency(netSubtotal)}
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-6 sm:pt-0 overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/40">
              <TableHead className="w-[100px] whitespace-nowrap">Data</TableHead>
              <TableHead className="min-w-[150px]">Descrição/Origem</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Subcategoria</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Pgto/Conta</TableHead>
              <TableHead>Comentário</TableHead>
              {full && <TableHead>Classificação</TableHead>}
              {full && <TableHead>Quem</TableHead>}
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {finalData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={full ? 11 : 9}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhuma transação encontrada para os filtros selecionados.
                </TableCell>
              </TableRow>
            ) : (
              finalData.map((tx) => {
                const isIncome = tx.primaryCategory === 'Receitas'
                return (
                  <TableRow
                    key={tx.id}
                    className="hover:bg-muted/40 transition-colors border-border/30"
                  >
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap font-medium">
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
                        <span className="font-medium text-foreground text-sm truncate">
                          {tx.establishment}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{tx.primaryCategory}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
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
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {tx.paymentMethod}
                    </TableCell>
                    <TableCell
                      className="text-sm text-muted-foreground max-w-[150px] truncate"
                      title={tx.comment}
                    >
                      {tx.comment}
                    </TableCell>
                    {full && (
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {tx.classification}
                      </TableCell>
                    )}
                    {full && (
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {tx.who}
                      </TableCell>
                    )}
                    <TableCell
                      className={`text-right font-semibold text-sm whitespace-nowrap ${isIncome ? 'text-success' : 'text-foreground'}`}
                    >
                      <span>
                        {isIncome ? '+' : '-'}
                        {formatCurrency(tx.value)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setItemToDelete(tx.id)
                          setDeleteDialogOpen(true)
                        }}
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
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
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

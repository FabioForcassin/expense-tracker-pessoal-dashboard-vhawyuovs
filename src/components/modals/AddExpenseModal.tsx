import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useDashboard } from '@/stores/DashboardContext'
import { PAYMENT_METHODS, Expense } from '@/types'
import { cn } from '@/lib/utils'

interface AddExpenseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: 'expense' | 'income'
}

export function AddExpenseModal({
  open,
  onOpenChange,
  defaultTab = 'expense',
}: AddExpenseModalProps) {
  const { categories, addExpenses } = useDashboard()
  const [tab, setTab] = useState<'expense' | 'income'>(defaultTab)
  const [value, setValue] = useState('')
  const [establishment, setEstablishment] = useState('')
  const [primaryCat, setPrimaryCat] = useState('')
  const [secondaryCat, setSecondaryCat] = useState('')
  const [type, setType] = useState<'Fixa' | 'Variável'>('Variável')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [payment, setPayment] = useState('')
  const [installments, setInstallments] = useState(1)
  const [comment, setComment] = useState('')
  const [classification, setClassification] = useState('')
  const [who, setWho] = useState('')
  const [replicateToEndOfYear, setReplicateToEndOfYear] = useState(false)

  useEffect(() => {
    if (open) {
      setTab(defaultTab)
      resetForm()
      if (defaultTab === 'income') {
        setPrimaryCat('Receitas')
        setType('Variável')
      }
    }
  }, [open, defaultTab])

  const filteredCategories = categories.filter((c) =>
    tab === 'income' ? c.name === 'Receitas' : c.name !== 'Receitas',
  )
  const selectedCategoryObj = categories.find((c) => c.name === primaryCat)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!value || !establishment || !primaryCat || !secondaryCat || !date || !payment) return

    const baseValue = parseFloat(value)

    const [yearStr, monthStr, dayStr] = date.split('-')
    const startYear = parseInt(yearStr)
    const startMonth = parseInt(monthStr) - 1
    const day = parseInt(dayStr)

    const isFixedReplicate = tab === 'expense' && type === 'Fixa' && replicateToEndOfYear
    const instCount = isFixedReplicate ? 12 - startMonth : tab === 'expense' ? installments : 1

    // For replication we don't divide the value, for installments we do
    const baseInstValue =
      !isFixedReplicate && instCount > 1
        ? parseFloat((baseValue / instCount).toFixed(2))
        : baseValue
    const remainder =
      !isFixedReplicate && instCount > 1
        ? parseFloat((baseValue - baseInstValue * instCount).toFixed(2))
        : 0

    const compMap = [
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

    const expensesToAdd: Omit<Expense, 'id'>[] = []

    for (let i = 0; i < instCount; i++) {
      let m = startMonth + i
      let y = startYear

      // If it's normal installment it could wrap to next year. Replication stays in same year by design.
      if (m >= 12) {
        y += Math.floor(m / 12)
        m = m % 12
      }

      const newMonthNum = m + 1
      const daysInMonth = new Date(y, newMonthNum, 0).getDate()
      const validDay = Math.min(day, daysInMonth)

      const newDateStr = `${y}-${newMonthNum.toString().padStart(2, '0')}-${validDay.toString().padStart(2, '0')}`

      let finalComment = comment
      if (!isFixedReplicate && instCount > 1) {
        finalComment = comment
          ? `${comment} (Parcela ${i + 1}/${instCount})`
          : `Parcela ${i + 1}/${instCount}`
      }

      const val = i === 0 ? parseFloat((baseInstValue + remainder).toFixed(2)) : baseInstValue

      expensesToAdd.push({
        value: val,
        establishment,
        primaryCategory: primaryCat,
        secondaryCategory: secondaryCat,
        type: tab === 'income' ? 'Receita' : type,
        paymentMethod: payment,
        date: newDateStr,
        monthNum: newMonthNum,
        competency: compMap[m],
        comment: finalComment,
        classification,
        who,
        isInstallment: !isFixedReplicate && instCount > 1,
        currentInstallment: !isFixedReplicate && instCount > 1 ? i + 1 : undefined,
        totalInstallments: !isFixedReplicate && instCount > 1 ? instCount : undefined,
      })
    }

    try {
      await addExpenses(expensesToAdd)
      toast.success(
        tab === 'income' ? 'Receita registrada com sucesso!' : 'Despesa registrada com sucesso!',
      )
      onOpenChange(false)
    } catch (err) {
      toast.error('Erro ao registrar transação.')
    }
  }

  const resetForm = () => {
    setValue('')
    setEstablishment('')
    setPrimaryCat(defaultTab === 'income' ? 'Receitas' : '')
    setSecondaryCat('')
    setType('Variável')
    setPayment('')
    setInstallments(1)
    setComment('')
    setClassification('')
    setWho('')
    setReplicateToEndOfYear(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[500px] glass p-0 overflow-hidden">
        <div className="p-4 sm:p-6 pb-2">
          <DialogHeader>
            <DialogTitle className="text-xl">Nova Transação</DialogTitle>
            <DialogDescription>Insira os detalhes para registro no painel.</DialogDescription>
          </DialogHeader>

          <div className="flex bg-muted/50 p-1 rounded-lg mt-4 mb-2">
            <button
              onClick={() => {
                setTab('expense')
                setPrimaryCat('')
                setSecondaryCat('')
                setInstallments(1)
                setReplicateToEndOfYear(false)
              }}
              type="button"
              className={cn(
                'flex-1 text-sm font-medium py-1.5 rounded-md transition-all',
                tab === 'expense'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Despesa
            </button>
            <button
              onClick={() => {
                setTab('income')
                setPrimaryCat('Receitas')
                setSecondaryCat('')
                setInstallments(1)
                setReplicateToEndOfYear(false)
              }}
              type="button"
              className={cn(
                'flex-1 text-sm font-medium py-1.5 rounded-md transition-all',
                tab === 'income'
                  ? 'bg-success/10 text-success shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Receita
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-4 sm:px-6 pb-6 grid gap-5 overflow-y-auto max-h-[70vh]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                placeholder="0.00"
                className={cn('text-lg font-medium', tab === 'income' ? 'text-success' : '')}
              />
            </div>
            <div className="grid gap-2">
              <Label>Data (Primeira Ocorrência)</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>{tab === 'income' ? 'Origem / Descrição' : 'Estabelecimento / Descrição'}</Label>
            <Input
              value={establishment}
              onChange={(e) => setEstablishment(e.target.value)}
              required
              placeholder={tab === 'income' ? 'Ex: Empresa S.A.' : 'Ex: Supermercado Extra'}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Categoria Principal</Label>
              <Select
                value={primaryCat}
                onValueChange={(v) => {
                  setPrimaryCat(v)
                  setSecondaryCat('')
                }}
                required
                disabled={tab === 'income'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Subcategoria</Label>
              <Select
                value={secondaryCat}
                onValueChange={setSecondaryCat}
                required
                disabled={!primaryCat}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategoryObj?.subcategories.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tab === 'expense' && (
              <div className="grid gap-2">
                <Label>Tipo de Gasto</Label>
                <Select
                  value={type}
                  onValueChange={(v: any) => {
                    setType(v)
                    if (v !== 'Fixa') setReplicateToEndOfYear(false)
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Variável">Variável</SelectItem>
                    <SelectItem value="Fixa">Fixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div
              className={cn(
                'grid gap-2',
                tab === 'income' ? 'sm:col-span-3' : type === 'Fixa' ? 'sm:col-span-2' : '',
              )}
            >
              <Label>Forma de Pagamento</Label>
              <Select value={payment} onValueChange={setPayment} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((pm) => (
                    <SelectItem key={pm} value={pm}>
                      {pm}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {tab === 'expense' && type !== 'Fixa' && (
              <div className="grid gap-2">
                <Label>Qtd. Parcelas</Label>
                <Select
                  value={installments.toString()}
                  onValueChange={(v) => setInstallments(parseInt(v))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 48 }, (_, i) => i + 1).map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n}x
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {tab === 'expense' && type === 'Fixa' && (
            <div className="grid gap-2 bg-muted/30 p-3 rounded-lg border border-border/50">
              <div className="flex items-center justify-between">
                <Label className="cursor-pointer flex flex-col gap-1 pr-4">
                  <span className="font-semibold text-foreground">Replicar até o fim do ano</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    Cria esta despesa com o mesmo valor para todos os meses seguintes até Dezembro.
                  </span>
                </Label>
                <Switch checked={replicateToEndOfYear} onCheckedChange={setReplicateToEndOfYear} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Classificação</Label>
              <Input
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
                placeholder="Ex: Pessoal, Empresa..."
              />
            </div>
            <div className="grid gap-2">
              <Label>Quem</Label>
              <Input value={who} onChange={(e) => setWho(e.target.value)} placeholder="Ex: Fabio" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Comentário</Label>
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Opcional"
            />
          </div>

          <Button
            type="submit"
            className={cn(
              'mt-2 w-full h-11 text-base',
              tab === 'income' ? 'bg-success hover:bg-success/90 text-white' : '',
            )}
          >
            Registrar {tab === 'income' ? 'Receita' : 'Despesa'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

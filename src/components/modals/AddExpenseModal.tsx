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
    const instCount = tab === 'expense' ? installments : 1
    const baseInstValue = instCount > 1 ? parseFloat((baseValue / instCount).toFixed(2)) : baseValue
    const remainder =
      instCount > 1 ? parseFloat((baseValue - baseInstValue * instCount).toFixed(2)) : 0

    const [yearStr, monthStr, dayStr] = date.split('-')
    const startYear = parseInt(yearStr)
    const startMonth = parseInt(monthStr) - 1
    const day = parseInt(dayStr)

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
      const y = startYear + Math.floor(m / 12)
      m = m % 12

      const newMonthNum = m + 1
      const daysInMonth = new Date(y, newMonthNum, 0).getDate()
      const validDay = Math.min(day, daysInMonth)

      const newDateStr = `${y}-${newMonthNum.toString().padStart(2, '0')}-${validDay.toString().padStart(2, '0')}`

      let finalComment = comment
      if (instCount > 1) {
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
              }}
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
              }}
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
              <Label>Data</Label>
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
                <Select value={type} onValueChange={(v: any) => setType(v)} required>
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
            <div className={cn('grid gap-2', tab === 'income' ? 'sm:col-span-3' : '')}>
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
            {tab === 'expense' && (
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
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n}x
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

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

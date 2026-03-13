import { useState } from 'react'
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

interface AddExpenseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddExpenseModal({ open, onOpenChange }: AddExpenseModalProps) {
  const { categories, addExpense, currentMonth } = useDashboard()
  const [value, setValue] = useState('')
  const [establishment, setEstablishment] = useState('')
  const [primaryCat, setPrimaryCat] = useState('')
  const [secondaryCat, setSecondaryCat] = useState('')
  const [type, setType] = useState<'Fixa' | 'Variável'>('Variável')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [payment, setPayment] = useState('Cartão de Crédito')

  const selectedCategoryObj = categories.find((c) => c.name === primaryCat)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value || !establishment || !primaryCat || !secondaryCat || !date) return

    const [year, month] = date.split('-')
    const monthNum = parseInt(month)
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

    addExpense({
      value: parseFloat(value),
      establishment,
      primaryCategory: primaryCat,
      secondaryCategory: secondaryCat,
      type,
      paymentMethod: payment,
      date,
      monthNum,
      competency: compMap[monthNum - 1],
      comment: '',
      classification: 'Pessoal',
      who: 'Usuário',
    })

    toast.success('Despesa adicionada com sucesso!')
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setValue('')
    setEstablishment('')
    setPrimaryCat('')
    setSecondaryCat('')
    setType('Variável')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] glass">
        <DialogHeader>
          <DialogTitle className="text-xl">Nova Despesa</DialogTitle>
          <DialogDescription>
            Insira os detalhes da transação para registro no painel.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-5 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                placeholder="0.00"
                className="text-lg font-medium bg-background/50"
              />
            </div>
            <div className="grid gap-2">
              <Label>Data</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Estabelecimento / Descrição</Label>
            <Input
              value={establishment}
              onChange={(e) => setEstablishment(e.target.value)}
              required
              placeholder="Ex: Supermercado Extra"
              className="bg-background/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Categoria Principal</Label>
              <Select
                value={primaryCat}
                onValueChange={(v) => {
                  setPrimaryCat(v)
                  setSecondaryCat('')
                }}
                required
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
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
                <SelectTrigger className="bg-background/50">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={(v: any) => setType(v)} required>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Variável">Variável</SelectItem>
                  <SelectItem value="Fixa">Fixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Forma de Pagamento</Label>
              <Input
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                placeholder="Ex: CC Nubank"
                className="bg-background/50"
              />
            </div>
          </div>

          <Button type="submit" className="mt-2 w-full h-11 text-base">
            Registrar Despesa
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

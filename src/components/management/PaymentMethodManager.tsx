import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDashboard } from '@/stores/DashboardContext'
import { Trash2, CreditCard } from 'lucide-react'

export function PaymentMethodManager() {
  const { dbPaymentMethods, addPaymentMethod, deletePaymentMethod } = useDashboard()
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState('Cartão de Crédito')

  const handleAdd = () => {
    if (newName.trim()) {
      addPaymentMethod(newName.trim(), newType)
      setNewName('')
    }
  }

  return (
    <Card className="shadow-sm border-border/40 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Métodos de Pagamento e Contas
        </CardTitle>
        <CardDescription>
          Cadastre contas bancárias e cartões de crédito para associar às suas despesas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-end gap-3 bg-muted/20 p-4 rounded-lg border border-border/50">
          <div className="space-y-2 w-full sm:w-1/2">
            <label className="text-sm font-medium">Nome (Ex: Nubank, Cartão Itaú)</label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome..."
            />
          </div>
          <div className="space-y-2 w-full sm:w-1/4">
            <label className="text-sm font-medium">Tipo</label>
            <Select value={newType} onValueChange={setNewType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                <SelectItem value="Conta Corrente/Débito">Conta Corrente/Débito</SelectItem>
                <SelectItem value="Dinheiro">Dinheiro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAdd} disabled={!newName.trim()} className="w-full sm:w-auto h-10">
            Adicionar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dbPaymentMethods.length === 0 ? (
            <div className="col-span-full p-4 text-center text-sm text-muted-foreground border rounded-lg bg-background">
              Nenhum método cadastrado.
            </div>
          ) : (
            dbPaymentMethods.map((pm) => (
              <div
                key={pm.id}
                className="flex items-center justify-between border rounded-lg p-3 bg-background shadow-sm"
              >
                <div>
                  <p className="font-semibold text-foreground">{pm.name}</p>
                  <p className="text-xs text-muted-foreground">{pm.type}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deletePaymentMethod(pm.id)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

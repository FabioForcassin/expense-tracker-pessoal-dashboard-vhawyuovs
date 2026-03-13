import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function Settings() {
  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!')
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Configurações
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Gerencie as preferências da sua conta e do painel.
        </p>
      </div>
      <Card className="shadow-subtle border-border/40">
        <CardHeader>
          <CardTitle>Perfil de Usuário</CardTitle>
          <CardDescription>
            Atualize suas informações pessoais e preferências básicas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" defaultValue="Usuário Premium" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" defaultValue="usuario@findashboard.com" type="email" />
          </div>
          <div className="pt-2">
            <Button onClick={handleSave}>Salvar Alterações</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

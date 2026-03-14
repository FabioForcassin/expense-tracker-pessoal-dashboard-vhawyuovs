import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CategoryManager } from '@/components/settings/CategoryManager'
import { DatabaseReset } from '@/components/settings/DatabaseReset'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'

export default function Settings() {
  const { user } = useAuth()

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!')
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-8">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Configurações
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Gerencie as preferências da sua conta, categorias e banco de dados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CategoryManager />
          <DatabaseReset />
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-subtle border-border/40">
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>Suas informações de acesso.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail Cadastrado</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  readOnly
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="pt-2">
                <Button onClick={handleSave} className="w-full">
                  Atualizar Perfil
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

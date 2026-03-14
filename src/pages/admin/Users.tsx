import { useState } from 'react'
import { useDashboard } from '@/stores/DashboardContext'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Users as UsersIcon, UserPlus, Shield, User, Mail, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { inviteUser, deleteUser, toggleUserStatus } from '@/services/admin'

export default function AdminUsers() {
  const { user } = useAuth()
  const { profiles, fetchProfiles } = useDashboard()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('user')
  const [loading, setLoading] = useState(false)

  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error('Por favor, informe um e-mail válido.')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await inviteUser(email, role)

      if (error) {
        toast.error(`Erro ao convidar: ${error.message}`)
      } else {
        if (data?.warning) {
          toast.warning(`Atenção: ${data.warning}`)
        } else {
          toast.success('Convite enviado com sucesso por e-mail!')
        }
        setEmail('')
        setRole('user')
        await fetchProfiles()
      }
    } catch (err: any) {
      toast.error(`Erro inesperado: ${err.message || 'Falha na comunicação.'}`)
    } finally {
      setLoading(false)
    }
  }

  const openDeleteDialog = (id: string) => {
    setUserToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return
    setActionLoading(true)
    try {
      await deleteUser(userToDelete)
      toast.success('Usuário excluído com sucesso.')
      await fetchProfiles()
    } catch (err: any) {
      toast.error(`Erro ao excluir: ${err.message}`)
    } finally {
      setActionLoading(false)
      setUserToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await toggleUserStatus(id, isActive)
      toast.success(`Usuário ${isActive ? 'ativado' : 'desativado'} com sucesso.`)
      await fetchProfiles()
    } catch (err: any) {
      toast.error(`Erro ao atualizar status: ${err.message}`)
    }
  }

  return (
    <div className="max-w-[1400px] w-full mx-auto flex flex-col gap-6 animate-fade-in pb-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 text-foreground">
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
            <UsersIcon className="w-6 h-6" />
          </div>
          Gestão de Usuários
        </h2>
        <p className="text-muted-foreground text-sm mt-2">
          Gerencie permissões, adicione, remova ou desative o acesso de membros.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="glass shadow-sm">
            <CardHeader className="bg-muted/30 border-b border-border/40 py-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Convidar Novo Usuário
              </CardTitle>
              <CardDescription>Envie um convite de acesso para a plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail do Usuário</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="usuario@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Nível de Acesso</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuário Padrão</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted/50 p-3 rounded-md flex items-start gap-2 border border-border/50">
                  <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    O usuário receberá um e-mail com um link seguro para definir sua senha inicial e
                    acessar a plataforma.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar Convite'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="glass shadow-sm h-full flex flex-col">
            <CardHeader className="bg-muted/30 border-b border-border/40 py-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Usuários Cadastrados
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto flex-1">
              <Table className="min-w-[650px]">
                <TableHeader className="bg-muted/10">
                  <TableRow>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    profiles.map((p) => {
                      const isActive = (p as any).is_active ?? true
                      const isSelf = user?.id === p.id

                      return (
                        <TableRow key={p.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                              <User className="w-4 h-4" />
                            </div>
                            {p.email}
                          </TableCell>
                          <TableCell>
                            {p.role === 'admin' ? (
                              <Badge
                                variant="outline"
                                className="bg-primary/10 text-primary border-primary/20"
                              >
                                Administrador
                              </Badge>
                            ) : (
                              <Badge variant="outline">Usuário</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={isActive}
                                onCheckedChange={(val) => handleToggleStatus(p.id, val)}
                                disabled={isSelf}
                              />
                              <span className="text-xs text-muted-foreground">
                                {isActive ? 'Ativo' : 'Desativado'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {p.created_at
                              ? new Date(p.created_at).toLocaleDateString('pt-BR')
                              : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => openDeleteDialog(p.id)}
                              disabled={isSelf}
                              title={
                                isSelf
                                  ? 'Você não pode excluir sua própria conta'
                                  : 'Excluir Usuário'
                              }
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
          </Card>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este usuário permanentemente? Todos os dados associados
              a ele (receitas, despesas, orçamentos, etc) serão apagados do sistema em cascata e
              esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleConfirmDelete()
              }}
              disabled={actionLoading}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {actionLoading ? 'Excluindo...' : 'Excluir Usuário'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

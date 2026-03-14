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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Users as UsersIcon, UserPlus, Shield, User, Mail, Trash2, Key, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  inviteUser,
  deleteUser,
  toggleUserStatus,
  createUserWithPassword,
  resetUserPassword,
} from '@/services/admin'

export default function AdminUsers() {
  const { user } = useAuth()
  const { profiles, fetchProfiles } = useDashboard()

  // Create / Invite Form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [loading, setLoading] = useState(false)

  // Dialogs
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [userToReset, setUserToReset] = useState<string | null>(null)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  const [actionLoading, setActionLoading] = useState(false)

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return toast.error('Por favor, informe um e-mail válido.')
    setLoading(true)
    try {
      const { data, error } = await inviteUser(email, role)
      if (error) {
        toast.error(`Erro ao convidar: ${error.message}`)
      } else {
        toast.success('Convite enviado com sucesso por e-mail!')
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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return toast.error('E-mail e senha são obrigatórios.')
    if (password.length < 6) return toast.error('A senha deve ter no mínimo 6 caracteres.')

    setLoading(true)
    try {
      await createUserWithPassword(email, password, role)
      toast.success('Usuário criado com sucesso! Credenciais prontas para uso.')
      setEmail('')
      setPassword('')
      setRole('user')
      await fetchProfiles()
    } catch (err: any) {
      toast.error(`Erro ao criar usuário: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmReset = async () => {
    if (!userToReset || !newPassword) return toast.error('Digite a nova senha.')
    if (newPassword.length < 6) return toast.error('A senha deve ter no mínimo 6 caracteres.')

    setActionLoading(true)
    try {
      await resetUserPassword(userToReset, newPassword)
      toast.success('Senha atualizada com sucesso.')
      setResetDialogOpen(false)
      setNewPassword('')
      setUserToReset(null)
    } catch (err: any) {
      toast.error(`Erro ao redefinir senha: ${err.message}`)
    } finally {
      setActionLoading(false)
    }
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
                Novo Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="w-full mb-4 grid grid-cols-2">
                  <TabsTrigger value="manual">Criar Manual</TabsTrigger>
                  <TabsTrigger value="invite">Convidar</TabsTrigger>
                </TabsList>

                <TabsContent value="manual">
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label>E-mail do Usuário</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Senha Inicial</Label>
                      <Input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nível de Acesso</Label>
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
                      <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        Criação direta sem depender de e-mail. Você deve fornecer as credenciais ao
                        usuário.
                      </p>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Criando...' : 'Criar Usuário'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="invite">
                  <form onSubmit={handleInviteUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label>E-mail do Usuário</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nível de Acesso</Label>
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
                        O usuário receberá um link seguro para definir sua senha.
                      </p>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Enviando...' : 'Enviar Convite'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
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
              <Table className="min-w-[700px]">
                <TableHeader className="bg-muted/10">
                  <TableRow>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[120px] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
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
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                onClick={() => {
                                  setUserToReset(p.id)
                                  setResetDialogOpen(true)
                                }}
                                title="Redefinir Senha"
                              >
                                <Key className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  setUserToDelete(p.id)
                                  setDeleteDialogOpen(true)
                                }}
                                disabled={isSelf}
                                title={
                                  isSelf
                                    ? 'Não é possível excluir a própria conta'
                                    : 'Excluir Usuário'
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
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

      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Redefinir Senha</AlertDialogTitle>
            <AlertDialogDescription>
              Defina uma nova senha para este usuário. Ele poderá acessar imediatamente utilizando
              esta credencial.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label>Nova Senha</Label>
            <Input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite a nova senha..."
              minLength={6}
              className="mt-1"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancelar</AlertDialogCancel>
            <Button onClick={handleConfirmReset} disabled={actionLoading || !newPassword}>
              {actionLoading ? 'Salvando...' : 'Confirmar Senha'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este usuário permanentemente? Todos os dados associados
              a ele serão apagados do sistema e esta ação não poderá ser desfeita.
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
              className="bg-destructive text-destructive-foreground"
            >
              {actionLoading ? 'Excluindo...' : 'Excluir Usuário'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

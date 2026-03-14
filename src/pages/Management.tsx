import { CategoryManager } from '@/components/settings/CategoryManager'
import { DatabaseReset } from '@/components/settings/DatabaseReset'
import { PaymentMethodManager } from '@/components/management/PaymentMethodManager'
import { Settings, CreditCard, Layers, Database } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Management() {
  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-8">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 text-foreground">
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
            <Settings className="w-6 h-6" />
          </div>
          Central de Gerenciamento
        </h2>
        <p className="text-muted-foreground text-sm mt-2">
          Gerencie categorias, métodos de pagamento e dados do sistema de forma unificada.
        </p>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6 bg-muted/50 p-1">
          <TabsTrigger value="categories" className="gap-2">
            <Layers className="w-4 h-4" /> Categorias
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="w-4 h-4" /> Pagamentos
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Database className="w-4 h-4" /> Sistema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-0 animate-in fade-in zoom-in-95 duration-200">
          <CategoryManager />
        </TabsContent>

        <TabsContent value="payments" className="mt-0 animate-in fade-in zoom-in-95 duration-200">
          <PaymentMethodManager />
        </TabsContent>

        <TabsContent value="system" className="mt-0 animate-in fade-in zoom-in-95 duration-200">
          <DatabaseReset />
        </TabsContent>
      </Tabs>
    </div>
  )
}

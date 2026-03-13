import { TransactionsTable } from '@/components/dashboard/TransactionsTable'

export default function Reports() {
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Relatórios de Transações
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Histórico completo de suas movimentações e categorias.
        </p>
      </div>
      <TransactionsTable full />
    </div>
  )
}

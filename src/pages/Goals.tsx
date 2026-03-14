import { useState } from 'react'
import { useDashboard, useFilteredExpenses } from '@/stores/DashboardContext'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Target, Info } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { DBGoal } from '@/types'

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

function GoalRow({
  monthNum,
  year,
  spent,
  goal,
}: {
  monthNum: number
  year: number
  spent: number
  goal: DBGoal | undefined
}) {
  const { upsertGoal } = useDashboard()
  const [meta, setMeta] = useState(goal?.amount?.toString() || '')
  const [desafio, setDesafio] = useState(goal?.challenge_amount?.toString() || '')

  const handleBlur = () => {
    const mVal = parseFloat(meta) || 0
    const dVal = parseFloat(desafio) || 0

    if (mVal !== (goal?.amount || 0) || dVal !== (goal?.challenge_amount || 0)) {
      upsertGoal(monthNum, year, mVal, dVal)
    }
  }

  const isOverGoal = goal?.amount && spent > goal.amount

  return (
    <TableRow className="hover:bg-muted/30">
      <TableCell className="font-medium">{MONTH_NAMES[monthNum - 1]}</TableCell>
      <TableCell className={`font-semibold ${isOverGoal ? 'text-destructive' : 'text-foreground'}`}>
        {formatCurrency(spent)}
      </TableCell>
      <TableCell>
        <Input
          type="number"
          placeholder="Ex: 5000"
          value={meta}
          onChange={(e) => setMeta(e.target.value)}
          onBlur={handleBlur}
          className="w-full sm:w-32 bg-background"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          placeholder="Ex: 4000"
          value={desafio}
          onChange={(e) => setDesafio(e.target.value)}
          onBlur={handleBlur}
          className="w-full sm:w-32 bg-background border-dashed border-primary/50 focus-visible:ring-primary/50"
        />
      </TableCell>
    </TableRow>
  )
}

export default function Goals() {
  const { goals, selectedYear } = useDashboard()
  const allExpenses = useFilteredExpenses(false)

  const year = parseInt(selectedYear) || new Date().getFullYear()
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  return (
    <div className="max-w-[1400px] w-full mx-auto flex flex-col gap-6 animate-fade-in pb-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 text-foreground">
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
            <Target className="w-6 h-6" />
          </div>
          Metas e Desafios {year}
        </h2>
        <p className="text-muted-foreground text-sm mt-2 flex items-center gap-1.5">
          <Info className="w-4 h-4 opacity-70" />
          Defina suas metas mensais e desafios de economia. As alterações são salvas automaticamente
          ao sair do campo.
        </p>
      </div>

      <Card className="glass overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border/40 py-4">
          <CardTitle className="text-lg font-bold">Acompanhamento Anual</CardTitle>
          <CardDescription>
            O "Orçamento/Realizado" reflete a soma consolidada de todas as despesas do mês
            correspondente.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="w-[150px]">Mês</TableHead>
                <TableHead>Orçamento / Realizado</TableHead>
                <TableHead>Meta (R$)</TableHead>
                <TableHead>Desafio (R$)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {months.map((monthNum) => {
                const monthStr = `${year}-${String(monthNum).padStart(2, '0')}`

                const spent = allExpenses
                  .filter((e) => e.date.startsWith(monthStr) && e.primaryCategory !== 'Receitas')
                  .reduce((a, b) => a + b.value, 0)

                const goal = goals.find((g) => g.month === monthNum && g.year === year)

                return (
                  <GoalRow
                    key={monthNum}
                    monthNum={monthNum}
                    year={year}
                    spent={spent}
                    goal={goal}
                  />
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

import React, { useState, useMemo } from 'react'
import { useDashboard } from '@/stores/DashboardContext'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Target, Info } from 'lucide-react'

export default function Predictability() {
  const { categories, budget, updateBudget, selectedYear, setSelectedYear, expenses } =
    useDashboard()
  const [autoReplicate, setAutoReplicate] = useState(true)

  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  const monthLabels = [
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

  // Pre-calculate sums for items with active credit card installments
  const installmentsByCell = useMemo(() => {
    const map: Record<string, number> = {}
    expenses
      .filter((e) => e.isInstallment && e.date.startsWith(selectedYear))
      .forEach((e) => {
        const monthStr = e.date.substring(0, 7)
        const key = `${e.primaryCategory}|${e.secondaryCategory}|${monthStr}`
        map[key] = (map[key] || 0) + e.value
      })
    return map
  }, [expenses, selectedYear])

  const handleBudgetChange = (
    catName: string,
    subName: string,
    monthIdx: number,
    value: string,
  ) => {
    const rawVal = parseFloat(value) || 0

    if (autoReplicate) {
      for (let i = monthIdx; i < 12; i++) {
        const monthStr = months[i]
        const key = `${catName}|${subName}|${selectedYear}-${monthStr}`
        const instSum = installmentsByCell[key] || 0
        // We store the user's intended value minus the fixed installment, so they sum up perfectly
        updateBudget(key, rawVal - instSum)
      }
    } else {
      const monthStr = months[monthIdx]
      const key = `${catName}|${subName}|${selectedYear}-${monthStr}`
      const instSum = installmentsByCell[key] || 0
      updateBudget(key, rawVal - instSum)
    }
  }

  const currentYearOptions = [
    (new Date().getFullYear() - 1).toString(),
    new Date().getFullYear().toString(),
    (new Date().getFullYear() + 1).toString(),
    (new Date().getFullYear() + 2).toString(),
  ]

  return (
    <div className="max-w-[1600px] w-full mx-auto flex flex-col gap-6 animate-fade-in pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 text-foreground">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <Target className="w-6 h-6" />
            </div>
            Orçamento (Previsibilidade)
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            Planeje suas receitas e despesas. Valores exibem a soma automática das suas parcelas
            cadastradas.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-card p-2 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 px-2">
            <Switch
              id="auto-replicate"
              checked={autoReplicate}
              onCheckedChange={setAutoReplicate}
            />
            <Label htmlFor="auto-replicate" className="cursor-pointer text-sm font-medium">
              Auto-replicar p/ meses seguintes
            </Label>
          </div>
          <div className="w-[1px] h-6 bg-border mx-1"></div>
          <div className="flex items-center gap-2 pr-2">
            <Label className="whitespace-nowrap text-sm font-medium">Ano Fiscal:</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[90px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentYearOptions.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card className="glass overflow-hidden shadow-sm">
        <CardContent className="p-0 overflow-auto max-h-[70vh]">
          <Table className="border-collapse min-w-[1200px]">
            <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
              <TableRow className="hover:bg-muted/50">
                <TableHead className="min-w-[220px] bg-muted/50 border-r border-border/40 font-semibold">
                  Categoria / Subcategoria
                </TableHead>
                {monthLabels.map((m) => (
                  <TableHead
                    key={m}
                    className="min-w-[100px] text-center bg-muted/50 border-r border-border/40 font-semibold"
                  >
                    {m}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <React.Fragment key={cat.name}>
                  <TableRow className="bg-muted/30 hover:bg-muted/40">
                    <TableCell
                      colSpan={13}
                      className="font-bold text-foreground py-3 border-y border-border/40"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        ></div>
                        {cat.name}
                      </div>
                    </TableCell>
                  </TableRow>
                  {cat.subcategories.map((sub) => (
                    <TableRow
                      key={`${cat.name}-${sub}`}
                      className="hover:bg-muted/10 transition-colors"
                    >
                      <TableCell className="pl-8 text-muted-foreground font-medium text-sm border-r border-border/40 py-1.5">
                        {sub}
                      </TableCell>
                      {months.map((m, idx) => {
                        const key = `${cat.name}|${sub}|${selectedYear}-${m}`
                        const instSum = installmentsByCell[key] || 0
                        const budgetVal = budget[key] || 0
                        const displayVal = budgetVal + instSum

                        return (
                          <TableCell
                            key={m}
                            className="p-1 border-r border-border/40 text-center relative group"
                          >
                            <Input
                              type="number"
                              value={displayVal === 0 ? '' : displayVal.toFixed(2)}
                              onChange={(e) =>
                                handleBudgetChange(cat.name, sub, idx, e.target.value)
                              }
                              className="h-8 text-center bg-transparent border-transparent hover:border-input focus:border-primary focus:bg-background transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield] text-sm font-medium w-full"
                              placeholder="0"
                            />
                            {instSum > 0 && (
                              <div
                                className="absolute top-0 right-0 w-2 h-2 rounded-full bg-blue-500 m-1 opacity-60"
                                title={`Inclui parcelas: ${instSum.toFixed(2)}`}
                              />
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

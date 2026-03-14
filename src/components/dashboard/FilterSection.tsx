import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDashboard } from '@/stores/DashboardContext'
import { Filter, Layers, CalendarDays, CreditCard, ChevronDown, FilterX } from 'lucide-react'

const MONTHS = [
  { val: '01', label: 'Janeiro' },
  { val: '02', label: 'Fevereiro' },
  { val: '03', label: 'Março' },
  { val: '04', label: 'Abril' },
  { val: '05', label: 'Maio' },
  { val: '06', label: 'Junho' },
  { val: '07', label: 'Julho' },
  { val: '08', label: 'Agosto' },
  { val: '09', label: 'Setembro' },
  { val: '10', label: 'Outubro' },
  { val: '11', label: 'Novembro' },
  { val: '12', label: 'Dezembro' },
]

const DAYS = Array.from({ length: 31 }, (_, i) => ({
  val: (i + 1).toString().padStart(2, '0'),
  label: `Dia ${i + 1}`,
}))

export function FilterSection() {
  const {
    categories,
    selectedPrimaryCat,
    setSelectedPrimaryCat,
    selectedSecondaryCats,
    toggleSecondaryCat,
    selectedYear,
    setSelectedYear,
    selectedMonthValues,
    setSelectedMonthValues,
    selectedDays,
    setSelectedDays,
    selectedPaymentMethods,
    togglePaymentMethod,
    expenses,
    dbPaymentMethods,
    clearFilters,
  } = useDashboard()

  const activeCategory = categories.find((c) => c.id === selectedPrimaryCat)

  const availableYears = useMemo(() => {
    const years = new Set(expenses.map((e) => e.date.split('-')[0]).filter(Boolean))
    ;['2024', '2025', '2026', '2027', '2028'].forEach((y) => years.add(y))
    return Array.from(years).sort()
  }, [expenses])

  const availablePayments = useMemo(() => {
    const unique = new Set(expenses.map((e) => e.paymentMethod).filter(Boolean))
    if (dbPaymentMethods) {
      dbPaymentMethods.forEach((pm) => unique.add(pm.name))
    }
    return Array.from(unique).sort()
  }, [expenses, dbPaymentMethods])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Global Selectors: Year, Month, Day, Accounts */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 bg-background/50 p-1.5 rounded-lg border shadow-sm backdrop-blur-sm">
          {/* Year Standalone Dropdown */}
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-8 w-[100px] border-primary/20 bg-background hover:bg-accent focus:ring-1 focus:ring-primary/30">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Month Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 bg-background border-primary/20 text-foreground hover:bg-accent transition-all"
              >
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                <span>
                  {selectedMonthValues.length === 0
                    ? 'Todos Meses'
                    : selectedMonthValues.length === 1
                      ? MONTHS.find((m) => m.val === selectedMonthValues[0])?.label
                      : `${selectedMonthValues.length} meses`}
                </span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <div className="p-2 border-b bg-muted/20 flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0">
                  Meses
                </p>
                <button
                  onClick={() => {
                    if (selectedMonthValues.length === MONTHS.length) setSelectedMonthValues([])
                    else setSelectedMonthValues(MONTHS.map((m) => m.val))
                  }}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {selectedMonthValues.length === MONTHS.length ? 'Desmarcar' : 'Todos'}
                </button>
              </div>
              <ScrollArea className="h-[220px]">
                <div className="flex flex-col gap-1 p-2">
                  {MONTHS.map((m) => (
                    <label
                      key={m.val}
                      className="flex items-center gap-3 px-2 py-1.5 hover:bg-accent rounded-md cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={selectedMonthValues.includes(m.val)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedMonthValues([...selectedMonthValues, m.val])
                          } else {
                            setSelectedMonthValues(selectedMonthValues.filter((x) => x !== m.val))
                          }
                        }}
                      />
                      <span className="text-sm font-medium">{m.label}</span>
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>

          {/* Day Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 bg-background border-primary/20 text-foreground hover:bg-accent transition-all"
              >
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                <span>
                  {selectedDays.length === 0
                    ? 'Todos Dias'
                    : selectedDays.length === 1
                      ? selectedDays[0]
                      : `${selectedDays.length} dias`}
                </span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <div className="p-2 border-b bg-muted/20 flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0">
                  Dias
                </p>
                <button
                  onClick={() => {
                    if (selectedDays.length === DAYS.length) setSelectedDays([])
                    else setSelectedDays(DAYS.map((d) => d.val))
                  }}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {selectedDays.length === DAYS.length ? 'Desmarcar' : 'Todos'}
                </button>
              </div>
              <ScrollArea className="h-[220px]">
                <div className="flex flex-col gap-1 p-2">
                  {DAYS.map((d) => (
                    <label
                      key={d.val}
                      className="flex items-center gap-3 px-2 py-1.5 hover:bg-accent rounded-md cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={selectedDays.includes(d.val)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedDays([...selectedDays, d.val])
                          } else {
                            setSelectedDays(selectedDays.filter((x) => x !== d.val))
                          }
                        }}
                      />
                      <span className="text-sm font-medium">{d.label}</span>
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>

          {/* Payment Method Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-all"
              >
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span>Pgto/Conta {selectedPaymentMethods.length > 0 && ' *'}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
              <div className="p-2 border-b bg-muted/20 flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0">
                  Pgto/Conta
                </p>
                <button
                  onClick={() => {
                    if (selectedPaymentMethods.length === availablePayments.length)
                      setSelectedPaymentMethods([])
                    else setSelectedPaymentMethods(availablePayments)
                  }}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {selectedPaymentMethods.length === availablePayments.length
                    ? 'Desmarcar'
                    : 'Todos'}
                </button>
              </div>
              <ScrollArea className="h-[300px]">
                <div className="p-2 flex flex-col gap-1">
                  {availablePayments.map((pm) => (
                    <label
                      key={pm}
                      className="flex items-center gap-2 px-2 py-1 hover:bg-accent rounded-md cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedPaymentMethods.includes(pm)}
                        onCheckedChange={() => togglePaymentMethod(pm)}
                      />
                      <span className="text-sm font-medium text-foreground">{pm}</span>
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>

          {/* Clear Filters Button */}
          <div className="ml-1 border-l pl-2 border-border/50 hidden sm:block">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 text-muted-foreground hover:text-foreground"
            >
              <FilterX className="w-4 h-4 mr-1.5" />
              Limpar
            </Button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <ScrollArea className="w-full max-w-full whitespace-nowrap">
            <div className="flex w-max space-x-2 p-1 pb-2">
              <Badge
                variant={!selectedPrimaryCat ? 'default' : 'outline'}
                className={`cursor-pointer px-4 py-1.5 text-sm font-medium transition-all shadow-sm
                  ${!selectedPrimaryCat ? 'bg-primary' : 'hover:bg-accent/80 bg-background/50 backdrop-blur-md text-muted-foreground hover:text-foreground'}`}
                onClick={() => setSelectedPrimaryCat(null)}
              >
                Visão Geral
              </Badge>
              {categories.map((cat) => {
                const isSelected = selectedPrimaryCat === cat.id
                return (
                  <Badge
                    key={cat.id}
                    variant={isSelected ? 'default' : 'outline'}
                    className={`cursor-pointer px-4 py-1.5 text-sm font-medium transition-all shadow-sm
                      ${isSelected ? (cat.name === 'Receitas' ? 'bg-success text-white hover:bg-success/90' : 'bg-primary text-white') : 'hover:bg-accent/80 bg-background/50 backdrop-blur-md text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setSelectedPrimaryCat(cat.id)}
                  >
                    {cat.name}
                  </Badge>
                )
              })}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>
      </div>

      {activeCategory && activeCategory.subcategories.length > 0 && (
        <div className="flex items-center gap-2 pl-1 animate-fade-in-up">
          <Layers className="w-4 h-4 text-primary shrink-0" />
          <ScrollArea className="w-full max-w-full whitespace-nowrap">
            <div className="flex w-max space-x-2 p-1">
              <Badge
                variant="outline"
                className="cursor-pointer px-3 py-1 text-xs transition-all border-dashed hover:bg-accent"
                onClick={() => {
                  if (selectedSecondaryCats.length === activeCategory.subcategories.length) {
                    activeCategory.subcategories.forEach((sub) => {
                      if (selectedSecondaryCats.includes(sub)) toggleSecondaryCat(sub)
                    })
                  } else {
                    activeCategory.subcategories.forEach((sub) => {
                      if (!selectedSecondaryCats.includes(sub)) toggleSecondaryCat(sub)
                    })
                  }
                }}
              >
                {selectedSecondaryCats.length === activeCategory.subcategories.length
                  ? 'Desmarcar Todos'
                  : 'Selecionar Todos'}
              </Badge>
              {activeCategory.subcategories.map((sub) => {
                const isSelected = selectedSecondaryCats.includes(sub)
                const isIncome = activeCategory.name === 'Receitas'
                return (
                  <Badge
                    key={sub}
                    variant={isSelected ? 'secondary' : 'outline'}
                    className={`cursor-pointer px-3 py-1 text-xs transition-all
                      ${isSelected ? (isIncome ? 'bg-success/20 text-success border-success/30' : 'bg-primary/20 text-primary border-primary/30') : 'bg-background hover:bg-accent text-muted-foreground border-border'}`}
                    onClick={() => toggleSecondaryCat(sub)}
                  >
                    {sub}
                  </Badge>
                )
              })}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>
      )}
    </div>
  )
}

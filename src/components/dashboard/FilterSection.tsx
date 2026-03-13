import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useDashboard } from '@/stores/DashboardContext'
import { Filter, Layers, CalendarDays } from 'lucide-react'

export function FilterSection() {
  const {
    categories,
    selectedPrimaryCat,
    setSelectedPrimaryCat,
    selectedSecondaryCats,
    toggleSecondaryCat,
    selectedMonths,
    setSelectedMonths,
  } = useDashboard()

  const activeCategory = categories.find((c) => c.id === selectedPrimaryCat)

  const months = [
    { val: '2024-12', label: 'Dezembro 2024' },
    { val: '2024-11', label: 'Novembro 2024' },
    { val: '2024-10', label: 'Outubro 2024' },
    { val: '2024-09', label: 'Setembro 2024' },
    { val: '2024-08', label: 'Agosto 2024' },
    { val: '2024-07', label: 'Julho 2024' },
    { val: '2024-06', label: 'Junho 2024' },
    { val: '2024-05', label: 'Maio 2024' },
    { val: '2024-04', label: 'Abril 2024' },
    { val: '2024-03', label: 'Março 2024' },
    { val: '2024-02', label: 'Fevereiro 2024' },
    { val: '2024-01', label: 'Janeiro 2024' },
  ]

  const setPeriod = (startIdx: number, endIdx: number) => {
    // Indexes are reversed because months array is descending
    const selected = months.slice(11 - endIdx, 12 - startIdx).map((m) => m.val)
    setSelectedMonths(selected)
  }

  const isPeriodActive = (startIdx: number, endIdx: number) => {
    const periodMonths = months.slice(11 - endIdx, 12 - startIdx).map((m) => m.val)
    return (
      selectedMonths.length === periodMonths.length &&
      selectedMonths.every((m) => periodMonths.includes(m))
    )
  }

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Timeline Multi-Select & Quick Filters */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 bg-background/50 p-1.5 rounded-lg border border-border/50 shadow-sm backdrop-blur-sm">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 bg-background border-primary/20 text-primary hover:bg-primary/5 hover:text-primary transition-all"
              >
                <CalendarDays className="w-4 h-4" />
                <span>Meses ({selectedMonths.length})</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[260px] p-0" align="start">
              <div className="p-3 border-b border-border/50 bg-muted/30">
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                  Filtros Rápidos
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPeriod(0, 2)}
                    className="h-7 text-xs"
                  >
                    1º Tri
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPeriod(3, 5)}
                    className="h-7 text-xs"
                  >
                    2º Tri
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPeriod(0, 5)}
                    className="h-7 text-xs"
                  >
                    1º Sem
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPeriod(0, 11)}
                    className="h-7 text-xs"
                  >
                    Anual
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[220px]">
                <div className="p-2 flex flex-col gap-1">
                  {months.map((m) => (
                    <label
                      key={m.val}
                      className="flex items-center gap-3 px-2 py-1.5 hover:bg-accent rounded-md cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={selectedMonths.includes(m.val)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedMonths([...selectedMonths, m.val])
                          } else {
                            if (selectedMonths.length > 1) {
                              setSelectedMonths(selectedMonths.filter((x) => x !== m.val))
                            }
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

          <div className="hidden sm:flex items-center gap-1.5 ml-1 border-l border-border/50 pl-3">
            <Badge
              variant={isPeriodActive(0, 2) ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors text-xs py-1"
              onClick={() => setPeriod(0, 2)}
            >
              1º Tri
            </Badge>
            <Badge
              variant={isPeriodActive(3, 5) ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors text-xs py-1"
              onClick={() => setPeriod(3, 5)}
            >
              2º Tri
            </Badge>
            <Badge
              variant={isPeriodActive(0, 5) ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors text-xs py-1"
              onClick={() => setPeriod(0, 5)}
            >
              1º Sem
            </Badge>
            <Badge
              variant={isPeriodActive(0, 11) ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors text-xs py-1"
              onClick={() => setPeriod(0, 11)}
            >
              Anual
            </Badge>
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
                  ${!selectedPrimaryCat ? '' : 'hover:bg-accent/50 bg-background/50 backdrop-blur-md text-muted-foreground hover:text-foreground'}`}
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
                      ${isSelected ? (cat.name === 'Receitas' ? 'bg-success text-white hover:bg-success/90' : '') : 'hover:bg-accent/50 bg-background/50 backdrop-blur-md text-muted-foreground hover:text-foreground'}`}
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
              {activeCategory.subcategories.map((sub) => {
                const isSelected = selectedSecondaryCats.includes(sub)
                const isIncome = activeCategory.name === 'Receitas'
                return (
                  <Badge
                    key={sub}
                    variant={isSelected ? 'secondary' : 'outline'}
                    className={`cursor-pointer px-3 py-1 text-xs transition-all
                      ${isSelected ? (isIncome ? 'bg-success/20 text-success border-success/30' : 'bg-primary/20 text-primary border-primary/30') : 'bg-background/40 hover:bg-background/60 text-muted-foreground'}`}
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

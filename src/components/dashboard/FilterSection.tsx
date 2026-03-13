import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDashboard } from '@/stores/DashboardContext'
import { Filter, Layers } from 'lucide-react'

export function FilterSection() {
  const {
    categories,
    selectedPrimaryCat,
    setSelectedPrimaryCat,
    selectedSecondaryCats,
    toggleSecondaryCat,
    currentMonth,
    setCurrentMonth,
  } = useDashboard()

  const activeCategory = categories.find((c) => c.id === selectedPrimaryCat)

  // Generate last 12 months for the dropdown starting from Dec 2024 back to Jan 2024
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

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-full sm:w-48 shrink-0">
          <Select value={currentMonth} onValueChange={setCurrentMonth}>
            <SelectTrigger className="glass border-white/40 shadow-sm">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.val} value={m.val}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <ScrollArea className="w-full max-w-full whitespace-nowrap">
            <div className="flex w-max space-x-2 p-1">
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
                      ${isSelected ? '' : 'hover:bg-accent/50 bg-background/50 backdrop-blur-md text-muted-foreground hover:text-foreground'}`}
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

      {/* Secondary Categories Drilldown */}
      {activeCategory && activeCategory.subcategories.length > 0 && (
        <div className="flex items-center gap-2 pl-1 animate-fade-in-up">
          <Layers className="w-4 h-4 text-primary shrink-0" />
          <ScrollArea className="w-full max-w-full whitespace-nowrap">
            <div className="flex w-max space-x-2 p-1">
              {activeCategory.subcategories.map((sub) => {
                const isSelected = selectedSecondaryCats.includes(sub)
                return (
                  <Badge
                    key={sub}
                    variant={isSelected ? 'secondary' : 'outline'}
                    className={`cursor-pointer px-3 py-1 text-xs transition-all
                      ${isSelected ? 'bg-primary/20 text-primary border-primary/30' : 'bg-background/40 hover:bg-background/60 text-muted-foreground'}`}
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

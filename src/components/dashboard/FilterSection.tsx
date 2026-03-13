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

export function FilterSection() {
  const { categories, selectedCategories, toggleCategory, currentMonth, setCurrentMonth } =
    useDashboard()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
      <div className="w-full sm:w-48 shrink-0">
        <Select value={currentMonth} onValueChange={setCurrentMonth}>
          <SelectTrigger className="bg-background shadow-sm border-border/60">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024-03">Março 2024</SelectItem>
            <SelectItem value="2024-02">Fevereiro 2024</SelectItem>
            <SelectItem value="2024-01">Janeiro 2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="w-full max-w-full whitespace-nowrap">
        <div className="flex w-max space-x-2 p-1">
          {categories.map((cat) => {
            const isSelected = selectedCategories.includes(cat.id)
            return (
              <Badge
                key={cat.id}
                variant={isSelected ? 'default' : 'outline'}
                className={`cursor-pointer px-4 py-1.5 text-sm font-medium transition-all shadow-sm
                  ${isSelected ? '' : 'hover:bg-accent/50 bg-background border-border/60 text-muted-foreground hover:text-foreground'}`}
                onClick={() => toggleCategory(cat.id)}
              >
                {cat.name}
              </Badge>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  )
}

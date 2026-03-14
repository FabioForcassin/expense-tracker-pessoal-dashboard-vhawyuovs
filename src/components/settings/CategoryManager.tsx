import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDashboard } from '@/stores/DashboardContext'
import { Trash2, Plus, Layers } from 'lucide-react'

export function CategoryManager() {
  const { customCategories, addCategory, deleteCategory, addSubcategory, deleteSubcategory } =
    useDashboard()

  const [newCatName, setNewCatName] = useState('')
  const [newCatType, setNewCatType] = useState('Despesa')
  const [newSubMap, setNewSubMap] = useState<Record<string, string>>({})

  const handleAddCategory = () => {
    if (newCatName.trim()) {
      addCategory(newCatName.trim(), newCatType)
      setNewCatName('')
    }
  }

  const handleAddSubcategory = (catId: string) => {
    const val = newSubMap[catId]
    if (val?.trim()) {
      addSubcategory(catId, val.trim())
      setNewSubMap((prev) => ({ ...prev, [catId]: '' }))
    }
  }

  return (
    <Card className="shadow-sm border-border/40 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          Gerenciamento de Categorias
        </CardTitle>
        <CardDescription>
          Crie categorias e subcategorias personalizadas para organizar suas finanças.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-end gap-3 bg-muted/20 p-4 rounded-lg border border-border/50">
          <div className="space-y-2 w-full sm:w-1/2">
            <label className="text-sm font-medium">Nova Categoria</label>
            <Input
              placeholder="Ex: Viagens..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
          </div>
          <div className="space-y-2 w-full sm:w-1/4">
            <label className="text-sm font-medium">Tipo</label>
            <Select value={newCatType} onValueChange={setNewCatType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Despesa">Despesa</SelectItem>
                <SelectItem value="Receita">Receita</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleAddCategory}
            disabled={!newCatName.trim()}
            className="w-full sm:w-auto h-10"
          >
            Adicionar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customCategories.length === 0 ? (
            <div className="col-span-full p-4 text-center text-sm text-muted-foreground border rounded-lg bg-background">
              Nenhuma categoria personalizada criada ainda.
            </div>
          ) : (
            customCategories.map((cat) => (
              <div
                key={cat.id}
                className="border rounded-lg p-4 bg-background shadow-sm flex flex-col"
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b">
                  <div>
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      ></div>
                      {cat.name}
                    </h4>
                    <span className="text-xs text-muted-foreground">{cat.type}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCategory(cat.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex-1 space-y-2 mb-4">
                  {!cat.subcategories || cat.subcategories.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">Sem subcategorias</p>
                  ) : (
                    cat.subcategories.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between bg-muted/40 px-3 py-1.5 rounded-md text-sm"
                      >
                        <span>{sub.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteSubcategory(sub.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex items-center gap-2 mt-auto">
                  <Input
                    placeholder="Nova subcategoria..."
                    className="h-8 text-xs"
                    value={newSubMap[cat.id] || ''}
                    onChange={(e) =>
                      setNewSubMap((prev) => ({ ...prev, [cat.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddSubcategory(cat.id)
                    }}
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 shrink-0"
                    onClick={() => handleAddSubcategory(cat.id)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

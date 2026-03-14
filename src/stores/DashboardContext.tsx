import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react'
import {
  Expense,
  AppCategory,
  BudgetStore,
  getAccountType,
  DBCategory,
  DBGoal,
  DBPaymentMethod,
} from '@/types'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

export const INITIAL_CATEGORIES: AppCategory[] = [
  {
    id: 'cat_receitas',
    name: 'Receitas',
    color: 'hsl(160 84% 39%)',
    icon: 'TrendingUp',
    subcategories: [
      'Salário',
      '13º salário / férias',
      'PLR, Bônus e Outros',
      'Receita com imóveis',
      'Benera',
      'FF Assessoria',
      'Aluguel',
      'Pensão/Aposentadoria',
      'Outros',
    ],
  },
  {
    id: 'cat_investimentos',
    name: 'Investimentos',
    color: 'hsl(220 70% 50%)',
    icon: 'Landmark',
    subcategories: [
      'Reserva de Emergência',
      'Previdência/Aposentadoria',
      'Títulos de Renda Fixa',
      'Renda Variável',
      'Obras Imóvel',
      'Aquisição para o Imóvel',
      'Outros',
    ],
  },
  {
    id: 'cat_moradia',
    name: 'Moradia',
    color: 'hsl(221 83% 53%)',
    icon: 'Home',
    subcategories: [
      'Condomínio',
      'IPTU',
      'Financiamento da casa',
      'Seguro Residencial',
      'Diarista/Mensalista',
      'Lavanderia',
      'Streamings',
      'Luz',
      'Água',
      'Telefone/Celular',
      'Gás',
      'Internet/TV',
      'Manutenção',
      'Nuvem',
      'Jardim',
      'Outros',
    ],
  },
  {
    id: 'cat_transporte',
    name: 'Transporte',
    color: 'hsl(199 89% 48%)',
    icon: 'Car',
    subcategories: [
      'Seguro Automotivo',
      'IPVA',
      'Licenciamento',
      'Transporte Público',
      'Táxi/Uber/99',
      'Estacionamento',
      'Combustível',
      'Financiamento do Carro',
      'Lavagem',
      'Manutenção',
      'Multa',
      'Outros',
    ],
  },
  {
    id: 'cat_saude',
    name: 'Saúde',
    color: 'hsl(0 84% 60%)',
    icon: 'HeartPulse',
    subcategories: [
      'Plano de Saúde',
      'Seguro de Vida',
      'Medicamentos/Farmácia',
      'Tratamentos Diversos',
      'Dentista',
      'Saúde bucal',
      'Outros',
    ],
  },
  {
    id: 'cat_educacao',
    name: 'Educação',
    color: 'hsl(45 93% 47%)',
    icon: 'BookOpen',
    subcategories: [
      'Creche/Escola/Colégio',
      'Faculdade/Universidade',
      'Material Escolar',
      'Cursos Extras',
      'Inglês',
      'Espiritualidade',
      'Negócios',
      'Alimentação',
      'Transporte',
      'Outros',
    ],
  },
  {
    id: 'cat_alimentacao',
    name: 'Alimentação',
    color: 'hsl(25 95% 50%)',
    icon: 'Utensils',
    subcategories: [
      'Supermercado/Feira',
      'Feira',
      'Cafés e Restaurantes',
      'Café',
      'Snacks',
      'Cerveja',
      'Vinho',
      'Nespresso',
      'Padaria',
      'Outros',
    ],
  },
  {
    id: 'cat_pessoal',
    name: 'Pessoal',
    color: 'hsl(262 83% 58%)',
    icon: 'User',
    subcategories: [
      'Roupas e Acessórios',
      'Presentes',
      'Viagens',
      'Shows/Teatro',
      'Cinema',
      'Estética/Cosméticos',
      'Video Game',
      'Churrasco - família',
      'Futebol',
      'Futebol - Mensalidade',
      'Futebol - Churrasco',
      'Futebol - bebidas e churrasco',
      'Academia',
      'Manicure/Pedicure',
      'Cuidados com Cabelo e/ou Barba',
      'Alimentação Trabalho',
      'Seguro de vida',
      'Outros',
    ],
  },
  {
    id: 'cat_ferias',
    name: 'Férias',
    color: 'hsl(180 70% 40%)',
    icon: 'Palmtree',
    subcategories: [
      'Passagem',
      'Bares/Restaurantes',
      'Passeios',
      'Presentes',
      'Transporte',
      'Seguro',
      'Outros',
    ],
  },
  {
    id: 'cat_pets',
    name: 'Pets',
    color: 'hsl(25 60% 40%)',
    icon: 'Dog',
    subcategories: [
      'Plano de Saúde',
      'Petshop',
      'Creche',
      'Alimentação',
      'Brinquedos',
      'Areia',
      'Outros',
    ],
  },
  {
    id: 'cat_negocios',
    name: 'Negócios',
    color: 'hsl(210 50% 40%)',
    icon: 'Briefcase',
    subcategories: [
      'Benera',
      'Posicionamento marca',
      'Despesas',
      'Contabilidade',
      'Imposto',
      'Outros',
    ],
  },
  {
    id: 'cat_financas',
    name: 'Finanças',
    color: 'hsl(120 40% 40%)',
    icon: 'Receipt',
    subcategories: [
      'Contabilidade',
      'Juros',
      'Encargos',
      'Empréstimos',
      'CC',
      'IOF',
      'Mesada Filhos(as)',
      'Tarifa bancária',
      'Filantropia',
      'Outros',
    ],
  },
]

const generateInitialBudget = (): BudgetStore => {
  const budget: BudgetStore = {}
  const years = [2024, 2025, 2026, 2027, 2028]
  INITIAL_CATEGORIES.forEach((cat) => {
    cat.subcategories.forEach((sub) => {
      const defaultVal = cat.name === 'Receitas' ? 2500 : 250
      years.forEach((year) => {
        for (let month = 1; month <= 12; month++) {
          const monthStr = month.toString().padStart(2, '0')
          budget[`${cat.name}|${sub}|${year}-${monthStr}`] =
            defaultVal * (year === 2024 ? 1 : year === 2025 ? 1.05 : 1.1)
        }
      })
    })
  })
  return budget
}

interface DashboardContextType {
  categories: AppCategory[]
  customCategories: DBCategory[]
  expenses: Expense[]
  budget: BudgetStore
  goals: DBGoal[]
  dbPaymentMethods: DBPaymentMethod[]
  selectedYear: string
  setSelectedYear: (y: string) => void
  selectedMonthValues: string[]
  setSelectedMonthValues: (m: string[]) => void
  selectedDays: string[]
  setSelectedDays: (d: string[]) => void
  selectedMonths: string[]
  selectedPrimaryCat: string | null
  setSelectedPrimaryCat: (id: string | null) => void
  selectedSecondaryCats: string[]
  toggleSecondaryCat: (name: string) => void
  selectedAccountTypes: string[]
  toggleAccountType: (type: string) => void
  selectedAccounts: string[]
  toggleAccount: (account: string) => void
  selectedPaymentMethods: string[]
  togglePaymentMethod: (pm: string) => void
  clearFilters: () => void
  addExpense: (e: Omit<Expense, 'id'>) => Promise<void>
  addExpenses: (e: Omit<Expense, 'id'>[]) => Promise<void>
  deleteExpenses: (ids: string[]) => Promise<void>
  updateBudget: (key: string, value: number) => void
  bulkImportData: (type: 'realizado' | 'orcamento', year: string, data?: Expense[]) => Promise<void>
  resetDatabase: () => Promise<void>
  addCategory: (name: string, type: string) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  addSubcategory: (categoryId: string, name: string) => Promise<void>
  deleteSubcategory: (id: string) => Promise<void>
  upsertGoal: (
    month: number,
    year: number,
    amount: number,
    challenge_amount?: number,
  ) => Promise<void>
  addPaymentMethod: (name: string, type: string) => Promise<void>
  deletePaymentMethod: (id: string) => Promise<void>
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [customCategories, setCustomCategories] = useState<DBCategory[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budget, setBudget] = useState<BudgetStore>(generateInitialBudget())
  const [goals, setGoals] = useState<DBGoal[]>([])
  const [dbPaymentMethods, setDbPaymentMethods] = useState<DBPaymentMethod[]>([])

  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [selectedMonthValues, setSelectedMonthValues] = useState<string[]>([
    (new Date().getMonth() + 1).toString().padStart(2, '0'),
  ])
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([])
  const [selectedPrimaryCat, setSelectedPrimaryCat] = useState<string | null>(null)
  const [selectedSecondaryCats, setSelectedSecondaryCats] = useState<string[]>([])
  const [selectedAccountTypes, setSelectedAccountTypes] = useState<string[]>([])
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      fetchExpenses()
      fetchCustomCategories()
      fetchGoals()
      fetchPaymentMethods()
    } else {
      setExpenses([])
      setCustomCategories([])
      setGoals([])
      setDbPaymentMethods([])
    }
  }, [user])

  const fetchExpenses = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('expenses' as any)
      .select('*')
      .eq('user_id', user.id)
    if (error) {
      console.error('Error fetching expenses:', error)
      return
    }
    const mapped = (data || []).map((d: any) => ({
      id: d.id,
      date: d.date.split('T')[0],
      monthNum: d.month_num,
      competency: d.competency,
      establishment: d.description,
      primaryCategory: d.category,
      secondaryCategory: d.secondary_category,
      type: d.type,
      paymentMethod: d.payment_method,
      value: Number(d.amount),
      comment: d.comment,
      classification: d.classification,
      who: d.who,
      isInstallment: d.is_installment,
      currentInstallment: d.current_installment,
      totalInstallments: d.total_installments,
    }))
    setExpenses(mapped)
  }

  const fetchCustomCategories = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('categories' as any)
      .select('*, subcategories(*)')
      .eq('user_id', user.id)
    if (error) {
      console.error('Error fetching categories:', error)
      return
    }
    setCustomCategories(data || [])
  }

  const fetchGoals = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('goals' as any)
      .select('*')
      .eq('user_id', user.id)
    if (!error && data) {
      setGoals(data)
    }
  }

  const fetchPaymentMethods = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('payment_methods' as any)
      .select('*')
      .eq('user_id', user.id)
    if (!error && data) {
      setDbPaymentMethods(data)
    }
  }

  const categories = useMemo<AppCategory[]>(() => {
    const custom = customCategories.map((c) => ({
      id: c.id,
      name: c.name,
      color: c.color,
      icon: c.icon,
      subcategories: c.subcategories ? c.subcategories.map((s: any) => s.name) : [],
    }))
    return [...INITIAL_CATEGORIES, ...custom]
  }, [customCategories])

  const selectedMonths = useMemo(() => {
    return selectedMonthValues.map((m) => `${selectedYear}-${m}`)
  }, [selectedYear, selectedMonthValues])

  const clearFilters = () => {
    setSelectedYear(new Date().getFullYear().toString())
    setSelectedMonthValues([(new Date().getMonth() + 1).toString().padStart(2, '0')])
    setSelectedDays([])
    setSelectedPaymentMethods([])
    setSelectedPrimaryCat(null)
    setSelectedSecondaryCats([])
    setSelectedAccountTypes([])
    setSelectedAccounts([])
  }

  const toggleSecondaryCat = (name: string) => {
    setSelectedSecondaryCats((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    )
  }

  const handleSetPrimaryCat = (id: string | null) => {
    setSelectedPrimaryCat(id)
    setSelectedSecondaryCats([])
  }

  const toggleAccountType = (type: string) => {
    setSelectedAccountTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )
  }

  const toggleAccount = (account: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(account) ? prev.filter((a) => a !== account) : [...prev, account],
    )
  }

  const togglePaymentMethod = (pm: string) => {
    setSelectedPaymentMethods((prev) =>
      prev.includes(pm) ? prev.filter((p) => p !== pm) : [...prev, pm],
    )
  }

  const addExpense = async (e: Omit<Expense, 'id'>) => {
    await addExpenses([e])
  }

  const addExpenses = async (expensesToAdd: Omit<Expense, 'id'>[]) => {
    if (!user) return
    const payloads = expensesToAdd.map((e) => ({
      user_id: user.id,
      description: e.establishment,
      amount: e.value,
      category: e.primaryCategory,
      date: new Date(e.date + 'T00:00:00Z').toISOString(),
      secondary_category: e.secondaryCategory,
      type: e.type,
      payment_method: e.paymentMethod,
      comment: e.comment,
      classification: e.classification,
      who: e.who,
      month_num: e.monthNum,
      competency: e.competency,
      is_installment: e.isInstallment || false,
      current_installment: e.currentInstallment || null,
      total_installments: e.totalInstallments || null,
    }))
    const { data, error } = await supabase
      .from('expenses' as any)
      .insert(payloads)
      .select()
    if (error || !data) {
      console.error('Error inserting expenses:', error)
      return
    }
    const newExpenses: Expense[] = data.map((d: any) => ({
      id: d.id,
      date: d.date.split('T')[0],
      monthNum: d.month_num,
      competency: d.competency,
      establishment: d.description,
      primaryCategory: d.category,
      secondaryCategory: d.secondary_category,
      type: d.type,
      paymentMethod: d.payment_method,
      value: Number(d.amount),
      comment: d.comment,
      classification: d.classification,
      who: d.who,
      isInstallment: d.is_installment,
      currentInstallment: d.current_installment,
      totalInstallments: d.total_installments,
    }))
    setExpenses((prev) => [...prev, ...newExpenses])
  }

  const deleteExpenses = async (ids: string[]) => {
    if (!user || ids.length === 0) return
    const { error } = await supabase
      .from('expenses' as any)
      .delete()
      .in('id', ids)
    if (error) {
      console.error('Error deleting expenses:', error)
      throw error
    }
    setExpenses((prev) => prev.filter((e) => !ids.includes(e.id)))
  }

  const resetDatabase = async () => {
    if (!user) return
    const { error } = await supabase
      .from('expenses' as any)
      .delete()
      .eq('user_id', user.id)
    if (error) {
      console.error('Error resetting database:', error)
      throw error
    }
    setExpenses([])
  }

  const addCategory = async (name: string, type: string) => {
    if (!user) return
    const payload = {
      user_id: user.id,
      name,
      type,
      color: type === 'Receita' ? 'hsl(160 84% 39%)' : 'hsl(220 70% 50%)',
    }
    const { data, error } = await supabase
      .from('categories' as any)
      .insert(payload)
      .select()
    if (!error && data) {
      setCustomCategories((prev) => [...prev, { ...data[0], subcategories: [] }])
    }
  }

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories' as any)
      .delete()
      .eq('id', id)
    if (!error) {
      setCustomCategories((prev) => prev.filter((c) => c.id !== id))
    }
  }

  const addSubcategory = async (categoryId: string, name: string) => {
    const { data, error } = await supabase
      .from('subcategories' as any)
      .insert({ category_id: categoryId, name })
      .select()
    if (!error && data) {
      setCustomCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId ? { ...c, subcategories: [...(c.subcategories || []), data[0]] } : c,
        ),
      )
    }
  }

  const deleteSubcategory = async (id: string) => {
    const { error } = await supabase
      .from('subcategories' as any)
      .delete()
      .eq('id', id)
    if (!error) {
      setCustomCategories((prev) =>
        prev.map((c) => ({
          ...c,
          subcategories: (c.subcategories || []).filter((s: any) => s.id !== id),
        })),
      )
    }
  }

  const updateBudget = (key: string, value: number) => {
    setBudget((prev) => ({ ...prev, [key]: value }))
  }

  const bulkImportData = async (
    type: 'realizado' | 'orcamento',
    year: string,
    parsedData?: Expense[],
  ) => {
    if (type === 'realizado') {
      if (!user) return
      let itemsToInsert = parsedData || []
      await addExpenses(itemsToInsert)
    } else {
      const newBudget = { ...budget }
      Object.keys(newBudget).forEach((k) => {
        if (k.includes(`|${year}-`)) {
          newBudget[k] = parseFloat((newBudget[k] * (1 + (Math.random() * 0.6 - 0.3))).toFixed(2))
        }
      })
      setBudget(newBudget)
    }
  }

  const upsertGoal = async (
    month: number,
    year: number,
    amount: number,
    challenge_amount: number = 0,
  ) => {
    if (!user) return
    const existing = goals.find((g) => g.month === month && g.year === year)
    if (existing) {
      const { error, data } = await supabase
        .from('goals' as any)
        .update({ amount, challenge_amount })
        .eq('id', existing.id)
        .select()
      if (!error && data) {
        setGoals((prev) => prev.map((g) => (g.id === existing.id ? data[0] : g)))
      }
    } else {
      const { error, data } = await supabase
        .from('goals' as any)
        .insert({ user_id: user.id, month, year, amount, challenge_amount })
        .select()
      if (!error && data) {
        setGoals((prev) => [...prev, data[0]])
      }
    }
  }

  const addPaymentMethod = async (name: string, type: string) => {
    if (!user) return
    const { data, error } = await supabase
      .from('payment_methods' as any)
      .insert({ user_id: user.id, name, type })
      .select()
    if (!error && data) {
      setDbPaymentMethods((prev) => [...prev, data[0]])
    }
  }

  const deletePaymentMethod = async (id: string) => {
    const { error } = await supabase
      .from('payment_methods' as any)
      .delete()
      .eq('id', id)
    if (!error) {
      setDbPaymentMethods((prev) => prev.filter((pm) => pm.id !== id))
    }
  }

  return (
    <DashboardContext.Provider
      value={{
        categories,
        customCategories,
        expenses,
        budget,
        goals,
        dbPaymentMethods,
        selectedYear,
        setSelectedYear,
        selectedMonthValues,
        setSelectedMonthValues,
        selectedDays,
        setSelectedDays,
        selectedMonths,
        selectedPrimaryCat,
        setSelectedPrimaryCat: handleSetPrimaryCat,
        selectedSecondaryCats,
        toggleSecondaryCat,
        selectedAccountTypes,
        toggleAccountType,
        selectedAccounts,
        toggleAccount,
        selectedPaymentMethods,
        togglePaymentMethod,
        clearFilters,
        addExpense,
        addExpenses,
        deleteExpenses,
        updateBudget,
        bulkImportData,
        resetDatabase,
        addCategory,
        deleteCategory,
        addSubcategory,
        deleteSubcategory,
        upsertGoal,
        addPaymentMethod,
        deletePaymentMethod,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) throw new Error('useDashboard must be used within DashboardProvider')
  return context
}

export function useFilteredExpenses(applyTimeFilters = true) {
  const context = useContext(DashboardContext)
  if (!context) throw new Error('useFilteredExpenses must be used within DashboardProvider')

  const {
    expenses,
    selectedMonths,
    selectedYear,
    selectedDays,
    selectedPrimaryCat,
    selectedSecondaryCats,
    selectedAccountTypes,
    selectedAccounts,
    selectedPaymentMethods,
    categories,
  } = context

  let filtered = expenses

  if (applyTimeFilters) {
    if (selectedMonths.length > 0) {
      filtered = filtered.filter((e) => selectedMonths.some((m) => e.date.startsWith(m)))
    } else if (selectedYear) {
      filtered = filtered.filter((e) => e.date.startsWith(selectedYear))
    }
    if (selectedDays.length > 0) {
      filtered = filtered.filter((e) => {
        const d = e.date.split('-')[2]
        return selectedDays.includes(d)
      })
    }
  }

  if (selectedPrimaryCat) {
    const cat = categories.find((c) => c.id === selectedPrimaryCat)
    if (selectedPrimaryCat !== 'cat_receitas') {
      filtered = filtered.filter((e) => e.primaryCategory === cat?.name)
    } else {
      filtered = filtered.filter((e) => e.primaryCategory === 'Receitas')
    }
    if (selectedSecondaryCats.length > 0) {
      filtered = filtered.filter((e) => selectedSecondaryCats.includes(e.secondaryCategory))
    }
  }

  if (selectedAccountTypes.length > 0 || selectedAccounts.length > 0) {
    filtered = filtered.filter((e) => {
      const type = getAccountType(e.paymentMethod)
      const matchesType = selectedAccountTypes.length === 0 || selectedAccountTypes.includes(type)
      const matchesAccount =
        selectedAccounts.length === 0 || selectedAccounts.includes(e.paymentMethod)
      return matchesType && matchesAccount
    })
  }

  if (selectedPaymentMethods.length > 0) {
    filtered = filtered.filter((e) => selectedPaymentMethods.includes(e.paymentMethod))
  }

  return filtered
}

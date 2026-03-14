import { createContext, useContext, useState, ReactNode, useMemo } from 'react'
import { Expense, AppCategory, BudgetStore, getAccountType } from '@/types'

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

const INITIAL_EXPENSES: Expense[] = [
  // 2024 Data
  {
    id: '100',
    date: '2024-03-01',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'Empresa S.A',
    primaryCategory: 'Receitas',
    secondaryCategory: 'Salário',
    type: 'Receita',
    paymentMethod: 'Itaú',
    value: 12500.0,
    comment: 'Salário Mensal',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '1',
    date: '2024-03-02',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'Carrefour',
    primaryCategory: 'Alimentação',
    secondaryCategory: 'Supermercado/Feira',
    type: 'Variável',
    paymentMethod: 'CC Itaú visa infinity',
    value: 850.5,
    comment: 'Compra do mês',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '3',
    date: '2024-03-10',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'QuintoAndar',
    primaryCategory: 'Moradia',
    secondaryCategory: 'Condomínio',
    type: 'Fixa',
    paymentMethod: 'Itaú',
    value: 950.0,
    comment: 'Condomínio apto',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  // 2025 Data Sample
  {
    id: '200',
    date: '2025-01-05',
    monthNum: 1,
    competency: 'Jan',
    establishment: 'Empresa S.A',
    primaryCategory: 'Receitas',
    secondaryCategory: 'Salário',
    type: 'Receita',
    paymentMethod: 'Itaú',
    value: 13500.0,
    comment: 'Salário Atualizado',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '201',
    date: '2025-01-12',
    monthNum: 1,
    competency: 'Jan',
    establishment: 'Pão de Açúcar',
    primaryCategory: 'Alimentação',
    secondaryCategory: 'Supermercado/Feira',
    type: 'Variável',
    paymentMethod: 'CC Itaú visa infinity',
    value: 920.0,
    comment: '',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '202',
    date: '2025-02-15',
    monthNum: 2,
    competency: 'Fev',
    establishment: 'Drogasil',
    primaryCategory: 'Saúde',
    secondaryCategory: 'Medicamentos/Farmácia',
    type: 'Variável',
    paymentMethod: 'CC Nubank master',
    value: 180.0,
    comment: '',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  // 2026 Data Sample
  {
    id: '300',
    date: '2026-03-10',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'Oficina Autorizada',
    primaryCategory: 'Transporte',
    secondaryCategory: 'Manutenção',
    type: 'Variável',
    paymentMethod: 'CC Nubank master',
    value: 1200.0,
    comment: 'Revisão Anual',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  // Future Predictability Mock Data
  {
    id: '400',
    date: '2025-10-10',
    monthNum: 10,
    competency: 'Out',
    establishment: 'Parcela Carro',
    primaryCategory: 'Transporte',
    secondaryCategory: 'Financiamento do Carro',
    type: 'Fixa',
    paymentMethod: 'Itaú',
    value: 1500.0,
    comment: 'Parcela 24/36',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '401',
    date: '2025-11-10',
    monthNum: 11,
    competency: 'Nov',
    establishment: 'Parcela Carro',
    primaryCategory: 'Transporte',
    secondaryCategory: 'Financiamento do Carro',
    type: 'Fixa',
    paymentMethod: 'Itaú',
    value: 1500.0,
    comment: 'Parcela 25/36',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '402',
    date: '2025-10-15',
    monthNum: 10,
    competency: 'Out',
    establishment: 'Seguro Residencial Anual',
    primaryCategory: 'Moradia',
    secondaryCategory: 'Seguro Residencial',
    type: 'Fixa',
    paymentMethod: 'CC Itaú visa infinity',
    value: 1200.0,
    comment: 'Parcela 1/4',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '403',
    date: '2026-01-10',
    monthNum: 1,
    competency: 'Jan',
    establishment: 'Parcela Carro',
    primaryCategory: 'Transporte',
    secondaryCategory: 'Financiamento do Carro',
    type: 'Fixa',
    paymentMethod: 'Itaú',
    value: 1500.0,
    comment: 'Parcela 27/36',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '404',
    date: '2026-01-15',
    monthNum: 1,
    competency: 'Jan',
    establishment: 'IPVA',
    primaryCategory: 'Transporte',
    secondaryCategory: 'IPVA',
    type: 'Fixa',
    paymentMethod: 'CC Nubank master',
    value: 2300.0,
    comment: 'Cota Única',
    classification: 'Pessoal',
    who: 'Fabio',
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
  expenses: Expense[]
  budget: BudgetStore
  selectedYear: string
  setSelectedYear: (y: string) => void
  selectedMonthValues: string[]
  setSelectedMonthValues: (m: string[]) => void
  selectedMonths: string[] // Derived
  selectedPrimaryCat: string | null
  setSelectedPrimaryCat: (id: string | null) => void
  selectedSecondaryCats: string[]
  toggleSecondaryCat: (name: string) => void
  selectedAccountTypes: string[]
  toggleAccountType: (type: string) => void
  selectedAccounts: string[]
  toggleAccount: (account: string) => void
  addExpense: (e: Omit<Expense, 'id'>) => void
  updateBudget: (key: string, value: number) => void
  bulkImportData: (type: 'realizado' | 'orcamento', year: string, data?: Expense[]) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [categories] = useState<AppCategory[]>(INITIAL_CATEGORIES)
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES)
  const [budget, setBudget] = useState<BudgetStore>(generateInitialBudget())

  const [selectedYear, setSelectedYear] = useState<string>('2024')
  const [selectedMonthValues, setSelectedMonthValues] = useState<string[]>(['03'])

  const selectedMonths = useMemo(() => {
    return selectedMonthValues.map((m) => `${selectedYear}-${m}`)
  }, [selectedYear, selectedMonthValues])

  const [selectedPrimaryCat, setSelectedPrimaryCat] = useState<string | null>(null)
  const [selectedSecondaryCats, setSelectedSecondaryCats] = useState<string[]>([])

  const [selectedAccountTypes, setSelectedAccountTypes] = useState<string[]>([])
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])

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

  const addExpense = (e: Omit<Expense, 'id'>) => {
    const newExpense = { ...e, id: Date.now().toString() }
    setExpenses((prev) => [...prev, newExpense])
  }

  const updateBudget = (key: string, value: number) => {
    setBudget((prev) => ({ ...prev, [key]: value }))
  }

  const bulkImportData = (
    type: 'realizado' | 'orcamento',
    year: string,
    parsedData?: Expense[],
  ) => {
    if (type === 'realizado') {
      if (parsedData && parsedData.length > 0) {
        setExpenses((prev) => [...prev, ...parsedData])
        return
      }

      // Fallback generator uses realistic names instead of sequential numbers
      const newExpenses: Expense[] = []
      const numExpenses = 120
      const methods = ['Itaú', 'Nubank', 'CC Itaú visa infinity', 'Santander', 'Dinheiro']
      const establishments = [
        'Supermercado Extra',
        'Posto Ipiranga',
        'Farmácia Drogasil',
        'Restaurante do João',
        'Padaria Pão Quente',
        'Cinema Kinoplex',
        'Amazon',
        'Mercado Livre',
        'Uber',
        'Ifood',
      ]

      for (let i = 0; i < numExpenses; i++) {
        const m = Math.floor(Math.random() * 12) + 1
        const d = Math.floor(Math.random() * 28) + 1
        const date = `${year}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`
        const isReceita = Math.random() > 0.85

        let cat = categories.find((c) => c.name === 'Receitas')!
        if (!isReceita) {
          const expCats = categories.filter((c) => c.name !== 'Receitas')
          cat = expCats[Math.floor(Math.random() * expCats.length)]
        }
        const sub = cat.subcategories[Math.floor(Math.random() * cat.subcategories.length)]
        const val = isReceita ? Math.random() * 8000 + 2000 : Math.random() * 600 + 20

        newExpenses.push({
          id: `imp_${Date.now()}_${i}`,
          date,
          monthNum: m,
          competency: m.toString().padStart(2, '0'),
          establishment: isReceita
            ? 'Cliente/Empresa'
            : establishments[Math.floor(Math.random() * establishments.length)],
          primaryCategory: cat.name,
          secondaryCategory: sub,
          type: isReceita ? 'Receita' : Math.random() > 0.5 ? 'Fixa' : 'Variável',
          paymentMethod: methods[Math.floor(Math.random() * methods.length)],
          value: parseFloat(val.toFixed(2)),
          comment: '',
          classification: Math.random() > 0.8 ? 'Empresa' : 'Pessoal',
          who: 'Usuário',
        })
      }
      setExpenses((prev) => [...prev, ...newExpenses])
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

  return (
    <DashboardContext.Provider
      value={{
        categories,
        expenses,
        budget,
        selectedYear,
        setSelectedYear,
        selectedMonthValues,
        setSelectedMonthValues,
        selectedMonths,
        selectedPrimaryCat,
        setSelectedPrimaryCat: handleSetPrimaryCat,
        selectedSecondaryCats,
        toggleSecondaryCat,
        selectedAccountTypes,
        toggleAccountType,
        selectedAccounts,
        toggleAccount,
        addExpense,
        updateBudget,
        bulkImportData,
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

export function useFilteredExpenses(applyMonthFilter = true) {
  const context = useContext(DashboardContext)
  if (!context) throw new Error('useFilteredExpenses must be used within DashboardProvider')

  const {
    expenses,
    selectedMonths,
    selectedYear,
    selectedPrimaryCat,
    selectedSecondaryCats,
    selectedAccountTypes,
    selectedAccounts,
    categories,
  } = context

  let filtered = expenses

  if (applyMonthFilter) {
    if (selectedMonths.length > 0) {
      filtered = filtered.filter((e) => selectedMonths.some((m) => e.date.startsWith(m)))
    } else if (selectedYear) {
      filtered = filtered.filter((e) => e.date.startsWith(selectedYear))
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

  return filtered
}

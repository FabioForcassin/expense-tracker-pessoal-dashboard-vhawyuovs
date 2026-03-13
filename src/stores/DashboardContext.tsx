import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react'
import { Expense, AppCategory } from '@/types'

const INITIAL_CATEGORIES: AppCategory[] = [
  {
    id: '1',
    name: 'Moradia',
    color: 'hsl(var(--chart-1))',
    icon: 'Home',
    subcategories: [
      'Aluguel',
      'Conta de Luz',
      'Água',
      'Internet',
      'Condomínio',
      'Gás',
      'Lavanderia',
    ],
  },
  {
    id: '2',
    name: 'Alimentação',
    color: 'hsl(var(--chart-2))',
    icon: 'Utensils',
    subcategories: ['Supermercado', 'Restaurante', 'Padaria', 'Snacks', 'Café'],
  },
  {
    id: '3',
    name: 'Transporte',
    color: 'hsl(var(--chart-3))',
    icon: 'Car',
    subcategories: ['Combustível', 'Uber/99', 'Estacionamento', 'Manutenção', 'Transporte Público'],
  },
  {
    id: '4',
    name: 'Pessoal',
    color: 'hsl(var(--chart-4))',
    icon: 'User',
    subcategories: ['Roupas e Acessórios', 'Presentes', 'Futebol', 'Academia', 'Outros'],
  },
  {
    id: '5',
    name: 'Saúde',
    color: 'hsl(var(--chart-5))',
    icon: 'HeartPulse',
    subcategories: ['Medicamentos', 'Plano de Saúde', 'Tratamentos', 'Médico'],
  },
]

const INITIAL_EXPENSES: Expense[] = [
  {
    id: '1',
    date: '2024-03-02',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'Carrefour',
    primaryCategory: 'Alimentação',
    secondaryCategory: 'Supermercado',
    type: 'Variável',
    paymentMethod: 'CC Itaú',
    value: 450.5,
    comment: 'Compra do mês',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '2',
    date: '2024-03-05',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'Uber',
    primaryCategory: 'Transporte',
    secondaryCategory: 'Uber/99',
    type: 'Variável',
    paymentMethod: 'CC Nubank',
    value: 35.0,
    comment: 'Volta do trabalho',
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
    secondaryCategory: 'Aluguel',
    type: 'Fixa',
    paymentMethod: 'Pix',
    value: 2500.0,
    comment: 'Aluguel apto',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '4',
    date: '2024-03-12',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'Bacio di Latte',
    primaryCategory: 'Alimentação',
    secondaryCategory: 'Snacks',
    type: 'Variável',
    paymentMethod: 'CC Nubank',
    value: 45.0,
    comment: 'Sorvete',
    classification: 'Pessoal',
    who: 'Ana',
  },
  {
    id: '5',
    date: '2024-03-15',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'Drogasil',
    primaryCategory: 'Saúde',
    secondaryCategory: 'Medicamentos',
    type: 'Variável',
    paymentMethod: 'CC Itaú',
    value: 85.9,
    comment: 'Remédios',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '6',
    date: '2024-03-18',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'Enel',
    primaryCategory: 'Moradia',
    secondaryCategory: 'Conta de Luz',
    type: 'Variável',
    paymentMethod: 'Débito',
    value: 150.0,
    comment: 'Luz fev',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '7',
    date: '2024-03-20',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'Pecorino',
    primaryCategory: 'Alimentação',
    secondaryCategory: 'Restaurante',
    type: 'Variável',
    paymentMethod: 'CC Itaú',
    value: 180.0,
    comment: 'Jantar',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '8',
    date: '2024-03-25',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'Posto Ipiranga',
    primaryCategory: 'Transporte',
    secondaryCategory: 'Combustível',
    type: 'Variável',
    paymentMethod: 'CC Nubank',
    value: 200.0,
    comment: 'Gasolina',
    classification: 'Pessoal',
    who: 'Fabio',
  },
]

interface DashboardContextType {
  categories: AppCategory[]
  expenses: Expense[]
  currentMonth: string
  setCurrentMonth: (m: string) => void
  selectedPrimaryCat: string | null
  setSelectedPrimaryCat: (id: string | null) => void
  selectedSecondaryCats: string[]
  toggleSecondaryCat: (name: string) => void
  addExpense: (e: Omit<Expense, 'id'>) => void
  monthlyIncome: number
  setMonthlyIncome: (v: number) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [categories] = useState<AppCategory[]>(INITIAL_CATEGORIES)
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES)
  const [currentMonth, setCurrentMonth] = useState('2024-03')
  const [selectedPrimaryCat, setSelectedPrimaryCat] = useState<string | null>(null)
  const [selectedSecondaryCats, setSelectedSecondaryCats] = useState<string[]>([])
  const [monthlyIncome, setMonthlyIncome] = useState(10000)

  const toggleSecondaryCat = (name: string) => {
    setSelectedSecondaryCats((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    )
  }

  // When primary category changes, clear secondary selections
  const handleSetPrimaryCat = (id: string | null) => {
    setSelectedPrimaryCat(id)
    setSelectedSecondaryCats([])
  }

  const addExpense = (e: Omit<Expense, 'id'>) => {
    const newExpense = { ...e, id: Date.now().toString() }
    setExpenses((prev) => [...prev, newExpense])
  }

  return (
    <DashboardContext.Provider
      value={{
        categories,
        expenses,
        currentMonth,
        setCurrentMonth,
        selectedPrimaryCat,
        setSelectedPrimaryCat: handleSetPrimaryCat,
        selectedSecondaryCats,
        toggleSecondaryCat,
        addExpense,
        monthlyIncome,
        setMonthlyIncome,
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

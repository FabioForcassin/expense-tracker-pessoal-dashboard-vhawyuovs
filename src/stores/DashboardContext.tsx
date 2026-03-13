import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Expense, Budget, AppCategory } from '@/types'

const INITIAL_CATEGORIES: AppCategory[] = [
  { id: '1', name: 'Moradia', color: 'hsl(var(--chart-1))', icon: 'Home' },
  { id: '2', name: 'Alimentação', color: 'hsl(var(--chart-2))', icon: 'Utensils' },
  { id: '3', name: 'Transporte', color: 'hsl(var(--chart-3))', icon: 'Car' },
  { id: '4', name: 'Lazer', color: 'hsl(var(--chart-4))', icon: 'Gamepad2' },
  { id: '5', name: 'Saúde', color: 'hsl(var(--chart-5))', icon: 'HeartPulse' },
]

const INITIAL_BUDGET: Budget = {
  Moradia: 2500,
  Alimentação: 1200,
  Transporte: 600,
  Lazer: 400,
  Saúde: 300,
}

const INITIAL_EXPENSES: Expense[] = [
  {
    id: '1',
    date: '2024-03-02',
    description: 'Supermercado',
    category: 'Alimentação',
    value: 450.5,
  },
  { id: '2', date: '2024-03-05', description: 'Uber', category: 'Transporte', value: 35.0 },
  { id: '3', date: '2024-03-10', description: 'Aluguel', category: 'Moradia', value: 2000.0 },
  { id: '4', date: '2024-03-12', description: 'Cinema', category: 'Lazer', value: 120.0 },
  { id: '5', date: '2024-03-15', description: 'Farmácia', category: 'Saúde', value: 85.9 },
  { id: '6', date: '2024-03-18', description: 'Conta de Luz', category: 'Moradia', value: 150.0 },
  {
    id: '7',
    date: '2024-03-20',
    description: 'Restaurante',
    category: 'Alimentação',
    value: 180.0,
  },
  { id: '8', date: '2024-03-25', description: 'Gasolina', category: 'Transporte', value: 200.0 },
]

interface DashboardContextType {
  categories: AppCategory[]
  budget: Budget
  expenses: Expense[]
  currentMonth: string
  setCurrentMonth: (m: string) => void
  selectedCategories: string[]
  toggleCategory: (id: string) => void
  addExpense: (e: Omit<Expense, 'id'>) => void
  importBudget: (b: Budget) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [categories] = useState<AppCategory[]>(INITIAL_CATEGORIES)
  const [budget, setBudget] = useState<Budget>(INITIAL_BUDGET)
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES)
  const [currentMonth, setCurrentMonth] = useState('2024-03')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
  }

  const addExpense = (e: Omit<Expense, 'id'>) => {
    const newExpense = { ...e, id: Date.now().toString() }
    setExpenses((prev) => [...prev, newExpense])
  }

  const importBudget = (newBudget: Budget) => {
    setBudget(newBudget)
  }

  return (
    <DashboardContext.Provider
      value={{
        categories,
        budget,
        expenses,
        currentMonth,
        setCurrentMonth,
        selectedCategories,
        toggleCategory,
        addExpense,
        importBudget,
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

export interface Expense {
  id: string
  date: string // Format: YYYY-MM-DD
  monthNum: number // e.g., 8 for August
  competency: string // e.g., 'Ago'
  establishment: string // e.g., 'bacio di latte'
  primaryCategory: string // Despesa e.g., 'Alimentação'
  secondaryCategory: string // Classificação e.g., 'Snacks'
  type: 'Fixa' | 'Variável'
  paymentMethod: string // Forma pgto e.g., 'CC nubank master'
  value: number // R$ Valor
  comment: string // Comentário
  classification: string // Pessoal/Empresa
  who: string // Quem
}

export interface Budget {
  [categoryName: string]: number
}

export interface AppCategory {
  id: string
  name: string
  color: string
  icon: string
  subcategories: string[]
}

export interface MonthlyData {
  month: string // YYYY-MM
  income: number
  budget: Budget
}

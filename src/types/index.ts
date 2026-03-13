export interface Expense {
  id: string
  date: string // Format: YYYY-MM-DD
  monthNum: number // e.g., 8 for August
  competency: string // e.g., 'Ago'
  establishment: string // e.g., 'bacio di latte'
  primaryCategory: string // Despesa e.g., 'Alimentação'
  secondaryCategory: string // Classificação e.g., 'Snacks'
  type: 'Fixa' | 'Variável' | 'Receita'
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

export const PAYMENT_METHODS = [
  'Itaú',
  'Santander',
  'BTG',
  'Nubank',
  'Mercado Pago',
  'Inter - Benera',
  'CC Itaú visa infinity',
  'CC Itaú master black',
  'CC Nubank master',
  'CC Itaú empresas',
  'CC Mercado Pago visa',
  'CC Itaú Pão de Açúcar',
  'CC Itaú LATAM',
  'CC itau empresas - Benera',
  'CC inter master - Benera',
]

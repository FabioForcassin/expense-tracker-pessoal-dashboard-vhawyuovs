export interface Expense {
  id: string
  date: string // Format: YYYY-MM-DD
  description: string
  category: string
  value: number
}

export interface Budget {
  [categoryName: string]: number
}

export interface AppCategory {
  id: string
  name: string
  color: string
  icon: string
}

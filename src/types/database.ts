export type TransactionType = 'INCOME' | 'EXPENSE'

export interface Transaction {
  id: string
  userId: string
  type: TransactionType // 'income' | 'expense'
  amount: number
  category: string
  description?: string | null
  date: string | Date
  createdAt: string | Date
}

export interface User {
  id: string
  email: string
  fullName?: string | null
  createdAt: string | Date
}

export interface AiSummary {
  id: string
  userId: string
  month: string
  summary: string
  createdAt: string | Date
}

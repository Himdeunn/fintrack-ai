export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  category: string
  description?: string
  date: string
  created_at: string
}

export interface Profile {
  id: string
  full_name?: string
  email?: string
  created_at: string
}

export interface AiSummary {
  id: string
  user_id: string
  month: string
  summary: string
  created_at: string
}
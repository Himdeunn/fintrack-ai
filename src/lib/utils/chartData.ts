import type { Transaction } from '@/types/database'

export function getLast6MonthsData(transactions: Transaction[]) {
  const months = []
  const now = new Date()

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = d.toLocaleString('id-ID', { month: 'short' })
    const monthKey = d.toISOString().slice(0, 7)

    const monthlyTx = transactions.filter(t => {
      const txDate = new Date(t.date)
      return txDate.toISOString().slice(0, 7) === monthKey
    })

    const income = monthlyTx
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expense = monthlyTx
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    months.push({ label, income, expense })
  }

  return months
}

export function getExpenseByCategory(transactions: Transaction[]) {
  const expenses = transactions.filter(t => t.type === 'expense')
  const categories: Record<string, number> = {}

  expenses.forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + t.amount
  })

  return Object.entries(categories)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}
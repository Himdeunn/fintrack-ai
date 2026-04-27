import type { Transaction } from '@/types/database'

export function getDailyData(transactions: Transaction[], locale: string = 'id-ID') {
  const days = []
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
    const label = d.toLocaleString(locale, { weekday: 'short' }).toUpperCase()
    const dateKey = d.toISOString().slice(0, 10)

    const dailyTx = transactions.filter(t => {
      const txDate = new Date(t.date)
      return txDate.toISOString().slice(0, 10) === dateKey
    })

    const income = dailyTx
      .filter(t => t.type.toLowerCase() === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expense = dailyTx
      .filter(t => t.type.toLowerCase() === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    days.push({ label, income, expense })
  }

  return days
}

export function getWeeklyData(transactions: Transaction[], locale: string = 'id-ID') {
  const weeks = []
  const now = new Date()

  for (let i = 3; i >= 0; i--) {
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (i * 7))
    const start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 6)
    
    const label = `W${4-i}`
    
    const weeklyTx = transactions.filter(t => {
      const txDate = new Date(t.date)
      return txDate >= start && txDate <= end
    })

    const income = weeklyTx
      .filter(t => t.type.toLowerCase() === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expense = weeklyTx
      .filter(t => t.type.toLowerCase() === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    weeks.push({ label, income, expense })
  }

  return weeks
}

export function getLast6MonthsData(transactions: Transaction[], locale: string = 'id-ID') {
  const months = []
  const now = new Date()

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = d.toLocaleString(locale, { month: 'short' }).toUpperCase()
    const monthYear = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

    const monthlyTx = transactions.filter(t => {
      const txDate = new Date(t.date)
      const txMonthYear = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`
      return txMonthYear === monthYear
    })

    const income = monthlyTx
      .filter(t => t.type.toLowerCase() === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expense = monthlyTx
      .filter(t => t.type.toLowerCase() === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    months.push({ label, income, expense })
  }

  return months
}

export function getExpenseByCategory(transactions: Transaction[]) {
  if (!transactions || !Array.isArray(transactions)) return []
  
  const expenses = transactions.filter(t => 
    t.type && (t.type.toLowerCase() === 'expense' || t.type.toUpperCase() === 'EXPENSE')
  )
  const categories: Record<string, number> = {}

  expenses.forEach(t => {
    const cat = t.category || 'Other'
    categories[cat] = (categories[cat] || 0) + Number(t.amount)
  })

  return Object.entries(categories)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}
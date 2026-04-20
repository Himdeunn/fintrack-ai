import type { Transaction } from '@/types/database'

// Data untuk Pie Chart — pengeluaran per kategori
export function getExpenseByCategory(transactions: Transaction[]) {
  const map = new Map<string, number>()

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
    })

  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

// Data untuk Bar Chart — pemasukan vs pengeluaran 6 bulan terakhir
export function getLast6MonthsData(transactions: Transaction[]) {
  const months: { month: string; label: string; income: number; expense: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const key = d.toISOString().slice(0, 7)
    const label = d.toLocaleString('id-ID', { month: 'short' })

    const monthly = transactions.filter((t) => t.date.startsWith(key))
    months.push({
      month: key,
      label,
      income: monthly.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expense: monthly.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    })
  }
  return months
}
'use client'

import type { Transaction } from '@/types/database'
import { formatCurrency } from '@/lib/utils'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

export function BentoSummaryCards({ transactions }: { transactions: Transaction[] }) {
  const { t } = useLanguage()

  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = income - expense

  const stats = [
    { label: 'balance', value: balance, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'income', value: income, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'expense', value: expense, icon: TrendingDown, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  ]

  return (
    <>
      {stats.map((s, idx) => (
        <div 
          key={idx} 
          className="modern-card flex flex-col gap-4"
        >
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-xl ${s.bg} ${s.color}`}>
              <s.icon size={24} />
            </div>
          </div>

          <div>
            <span className="text-muted font-medium uppercase tracking-wider">{t(s.label)}</span>
            <div className={`text-3xl font-bold mt-1 ${s.color}`}>
              {formatCurrency(s.value)}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
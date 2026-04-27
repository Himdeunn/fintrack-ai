'use client'

import type { Transaction } from '@/types/database'
import { formatCurrency } from '@/lib/utils'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

export function BentoSummaryCards({ transactions }: { transactions: Transaction[] }) {
  const { t } = useLanguage()

  const income = transactions.filter(t => t.type.toLowerCase() === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter(t => t.type.toLowerCase() === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = income - expense

  const stats = [
    { label: 'balance', value: balance, icon: Wallet, color: 'text-indigo dark:text-vanilla', bg: 'bg-indigo/5 dark:bg-vanilla/5' },
    { label: 'income', value: income, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'expense', value: expense, icon: TrendingDown, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {stats.map((s, idx) => (
        <div 
          key={idx} 
          className="modern-card group"
        >
          <div className="flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm`}>
              <s.icon size={28} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo/40 dark:text-vanilla/40 mb-1 block">
                {t(s.label)}
              </span>
              <div className="text-3xl font-black tracking-tight text-indigo dark:text-vanilla">
                {formatCurrency(s.value)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
'use client'

import { useState } from 'react'
import { useTransactions, useDeleteTransaction } from '@/hooks/useTransactions'
import type { Transaction } from '@/types/database'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { BentoAddCard } from './TransactionForm'
import { formatCurrency } from '@/lib/utils'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Calendar, Tag, DollarSign, Trash2, Edit3 } from 'lucide-react'

export function BentoTxList({ month }: { month: string }) {
  const { data: transactions = [], isLoading } = useTransactions(month)
  const { t } = useLanguage()
  const del = useDeleteTransaction()
  const [editTarget, setEditTarget] = useState<Transaction | null>(null)

  if (isLoading) return <div className="h-[600px] bg-slate-100 animate-pulse rounded-2xl" />

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
        <div>
          <h3 className="text-lg font-bold">{t('history')}</h3>
          <p className="text-xs text-muted font-medium">{t('summary')} {month}</p>
        </div>
        <div className="bg-white dark:bg-slate-700 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600 shadow-sm">
          <span className="text-xs font-bold">{transactions.length} {t('transactions')}</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/30 dark:bg-slate-800/30">
              <th className="px-6 py-4">{t('date')}</th>
              <th className="px-6 py-4">{t('description')}</th>
              <th className="px-6 py-4">{t('category')}</th>
              <th className="px-6 py-4 text-right">{t('amount')}</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {!transactions.length ? (
              <tr>
                <td colSpan={5} className="py-24 text-center text-slate-300 font-medium italic">
                  {t('history')} Kosong
                </td>
              </tr>
            ) : (
              transactions.map((t: Transaction) => (
                <tr key={t.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <Calendar size={14} className="opacity-40" />
                      {new Date(t.date).toLocaleDateString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
                      {t.description || '-'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      <Tag size={10} />
                      {t.category}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold text-sm ${
                    t.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => setEditTarget(t)} 
                        className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-blue-600 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => { if(confirm('Hapus transaksi?')) del.mutate(t.id) }} 
                        className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-rose-600 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="max-w-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-0 rounded-2xl overflow-hidden shadow-2xl">
          <BentoAddCard transaction={editTarget ?? undefined} onSuccess={() => setEditTarget(null)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
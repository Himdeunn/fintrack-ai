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
import { Tag, Trash2 } from 'lucide-react'

export function BentoTxList({ month }: { month: string }) {
  const { data: transactions = [], isLoading } = useTransactions(month)
  const { t, language } = useLanguage()
  const del = useDeleteTransaction()
  const [editTarget, setEditTarget] = useState<Transaction | null>(null)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<'all' | 'INCOME' | 'EXPENSE'>('all')
  const itemsPerPage = 5

  if (isLoading) return <div className="h-[600px] bg-dusk-blue/5 dark:bg-azure-mist/5 animate-pulse rounded-[40px]" />

  // Sorting & Filtering Logic
  const sortedAndFiltered = transactions
    .filter(t => filter === 'all' ? true : t.type.toLowerCase() === filter.toLowerCase())
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      if (dateA !== dateB) return dateB - dateA
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const totalPages = Math.ceil(sortedAndFiltered.length / itemsPerPage)
  const paginatedTransactions = sortedAndFiltered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <div className="flex flex-col h-full bg-white dark:bg-dusk-blue-muted rounded-[48px] border border-dusk-blue/5 dark:border-azure-mist/10 overflow-hidden shadow-2xl shadow-dusk-blue/5">
      <div className="p-8 md:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 bg-white dark:bg-dusk-blue-muted">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-dusk-blue/40 dark:text-azure-mist/40 mb-2 block">{t('history')}</span>
          <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-dusk-blue dark:text-azure-mist leading-none">{t('ledger')}</h3>
        </div>
        
        <div className="flex flex-col items-end gap-4 w-full sm:w-auto">
          <div className="flex bg-dusk-blue/5 dark:bg-azure-mist/5 p-1 rounded-2xl border border-dusk-blue/10 dark:border-azure-mist/10 w-full sm:w-fit overflow-x-auto scrollbar-hide">
            {['all', 'INCOME', 'EXPENSE'].map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f as 'all' | 'INCOME' | 'EXPENSE'); setPage(1); }}
                className={`px-5 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${
                  filter === f 
                    ? 'bg-dusk-blue text-azure-mist shadow-lg shadow-dusk-blue/20 dark:bg-azure-mist dark:text-dusk-blue' 
                    : 'text-dusk-blue/40 hover:text-dusk-blue dark:text-azure-mist/40 dark:hover:text-azure-mist'
                }`}
              >
                {f === 'all' ? (language === 'id' ? 'SEMUA' : 'ALL') : (language === 'id' ? (f === 'INCOME' ? 'MASUK' : 'KELUAR') : f.toUpperCase())}
              </button>
            ))}
          </div>
          <div className="bg-dusk-blue/5 dark:bg-azure-mist/5 px-6 py-2 rounded-full border border-dusk-blue/10 dark:border-azure-mist/10 shadow-sm hidden sm:block">
            <span className="text-[10px] font-black uppercase tracking-widest text-dusk-blue/60 dark:text-azure-mist/60">{sortedAndFiltered.length} items</span>
          </div>
        </div>
      </div>

      <div className="p-10 space-y-4 flex-1">
        {!transactions.length ? (
          <div className="py-32 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-dusk-blue/20 dark:text-azure-mist/20 italic">DATA_STREAM_EMPTY</span>
          </div>
        ) : (
          <div className="grid gap-4">
            {paginatedTransactions.map((tItem: Transaction) => (
              <div 
                key={tItem.id} 
                onClick={() => setEditTarget(tItem)}
                role="button"
                tabIndex={0}
                className="list-button group flex-col sm:flex-row gap-6 items-start sm:items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-dusk-blue focus:ring-offset-2"
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setEditTarget(tItem); }}
              >
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-dusk-blue/5 dark:bg-azure-mist/5 flex items-center justify-center text-dusk-blue/60 dark:text-azure-mist/60 group-hover:bg-dusk-blue group-hover:text-azure-mist dark:group-hover:bg-azure-mist dark:group-hover:text-dusk-blue shadow-sm border border-dusk-blue/10 dark:border-azure-mist/10 transition-all duration-500">
                    <Tag size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-black text-dusk-blue/60 dark:text-azure-mist/60 uppercase tracking-widest mb-1">
                      {new Date(tItem.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })} • {tItem.category}
                    </div>
                    <p className="text-sm font-black text-dusk-blue dark:text-azure-mist group-hover:translate-x-1 transition-transform truncate max-w-[200px] sm:max-w-none">
                      {tItem.description || 'Untitled Transaction'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-none border-dusk-blue/5 dark:border-azure-mist/5 pt-4 sm:pt-0">
                  <div className={`text-xl font-black tracking-tight ${
                    tItem.type === 'INCOME' ? 'text-emerald-500' : 'text-dusk-blue dark:text-azure-mist'
                  }`}>
                    {tItem.type === 'INCOME' ? '+' : '-'}{formatCurrency(tItem.amount)}
                  </div>
                  <div 
                    className="p-3 text-rose-500 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-xl transition-all cursor-pointer" 
                    onClick={(e) => { e.stopPropagation(); if(confirm('Hapus?')) del.mutate(tItem.id); }}
                  >
                    <Trash2 size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="px-10 pb-10 flex items-center justify-between">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="modern-btn !py-3 !px-6 !text-[9px] disabled:opacity-20 !shadow-none border border-dusk-blue/10 dark:border-azure-mist/10 !bg-transparent !text-dusk-blue dark:!text-azure-mist hover:!bg-dusk-blue/5 dark:hover:!bg-azure-mist/5"
          >
            Previous
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-dusk-blue/40 dark:text-azure-mist/40 mb-1">
              {t('history')}
            </span>
            <span className="text-[11px] font-black text-dusk-blue dark:text-azure-mist">
              {page} / {totalPages}
            </span>
          </div>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="modern-btn !py-3 !px-6 !text-[9px] disabled:opacity-20"
          >
            Next
          </button>
        </div>
      )}

      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="max-w-2xl bg-white dark:bg-dusk-blue-muted border border-dusk-blue/10 dark:border-azure-mist/10 p-0 rounded-[40px] overflow-hidden shadow-2xl">
          <BentoAddCard transaction={editTarget ?? undefined} onSuccess={() => setEditTarget(null)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

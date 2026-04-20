'use client'

import { useState } from 'react'
import { useTransactions, useDeleteTransaction } from '@/hooks/useTransactions'
import type { Transaction } from '@/types/database'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { BentoAddCard } from './TransactionForm'
import { Trash2, Edit3, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

function fmtRupiah(v: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
}

export function BentoTxList({ month }: { month: string }) {
  const { data: transactions = [], isLoading } = useTransactions(month)
  const del = useDeleteTransaction()
  const [editTarget, setEditTarget] = useState<Transaction | null>(null)

  if (isLoading) return <div className="bento-card h-[500px] animate-pulse bg-gray-50/50" />

  return (
    <div className="bento-card flex flex-col h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="bento-label">riwayat transaksi</div>
          <h3 className="text-xl font-extrabold tracking-tight">Ledger Aktivitas</h3>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 px-3 py-1 rounded-full font-bold text-[10px] tracking-widest uppercase">
          {transactions.length} Record
        </div>
      </div>

      <div className="flex-1 overflow-auto pr-2 custom-scrollbar space-y-3">
        {!transactions.length ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-300 italic text-sm">
            Belum ada aktivitas
          </div>
        ) : (
          transactions.map((t: Transaction) => (
            <div 
              key={t.id} 
              className="group relative flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-gray-100 dark:hover:border-white/5"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  t.type === 'income' 
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' 
                    : 'bg-rose-50 text-rose-600 dark:bg-rose-950/30'
                }`}>
                  {t.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{t.description || t.category}</p>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">
                    {t.category} • {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className={`text-sm font-bold ${
                  t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {t.type === 'income' ? '+' : '-'}{fmtRupiah(t.amount)}
                </p>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setEditTarget(t)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => { if(confirm('Hapus transaksi ini?')) del.mutate(t.id) }}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="max-w-md bg-white dark:bg-[#141414] border-none p-10 rounded-[32px] shadow-2xl">
          <h2 className="text-2xl font-extrabold tracking-tight mb-8">Edit Transaksi</h2>
          {editTarget && (
            <BentoAddCard transaction={editTarget} onSuccess={() => setEditTarget(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
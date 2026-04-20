'use client'

import { useState } from 'react'
import { useTransactions, useDeleteTransaction } from '@/hooks/useTransactions'
import type { Transaction } from '@/types/database'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { BentoAddCard } from './TransactionForm'

function fmtRupiah(v: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
}

export function BentoTxList({ month }: { month: string }) {
  const { data: transactions = [], isLoading } = useTransactions(month)
  const del = useDeleteTransaction()
  const [editTarget, setEditTarget] = useState<Transaction | null>(null)

  if (isLoading) return <div className="bento-card h-[400px] border-dashed" />

  return (
    <div className="bento-card flex flex-col h-[500px]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="bento-label bg-black text-white">HISTORY</div>
          <h3 className="text-4xl font-black uppercase tracking-tighter">ledger</h3>
        </div>
        <div className="bg-yellow-300 border-4 border-black px-4 py-1 font-black text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {transactions.length} ITEMS
        </div>
      </div>

      <div className="flex-1 overflow-auto pr-4 space-y-4">
        {!transactions.length ? (
          <div className="h-full flex flex-col items-center justify-center font-black uppercase text-gray-300">Empty</div>
        ) : (
          transactions.map((t) => (
            <div 
              key={t.id} 
              className="border-4 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 border-4 border-black flex items-center justify-center text-2xl ${
                    t.type === 'income' ? 'bg-emerald-400' : 'bg-pink-400'
                  }`}>
                    {t.type === 'income' ? '↓' : '↑'}
                  </div>
                  <div>
                    <p className="font-black uppercase text-lg leading-none">{t.description || t.category}</p>
                    <p className="font-bold text-[10px] text-gray-500 uppercase mt-1">
                      {t.category} • {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-xl font-black ${
                    t.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}{fmtRupiah(t.amount)}
                  </p>
                  <div className="flex gap-2 justify-end mt-2">
                    <button 
                      onClick={() => setEditTarget(t)}
                      className="border-2 border-black p-1 hover:bg-cyan-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button 
                      onClick={() => del.mutate(t.id)}
                      className="border-2 border-black p-1 hover:bg-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="max-w-md bg-white border-8 border-black p-10 rounded-none shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-4xl font-black uppercase mb-10 tracking-tighter">Edit Data</h2>
          {editTarget && (
            <BentoAddCard transaction={editTarget} onSuccess={() => setEditTarget(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
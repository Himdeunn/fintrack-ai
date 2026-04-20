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

  if (isLoading) return <div className="h-[600px] bg-white/[0.01] animate-pulse" />

  return (
    <div className="p-10 bg-white/[0.01] flex flex-col h-[600px] relative overflow-hidden">
      {/* Background Kinetic Text */}
      <div className="absolute top-0 right-0 text-[15vw] font-black text-white/[0.01] pointer-events-none select-none italic -mr-10 -mt-5">
        LEDGER
      </div>

      <div className="flex justify-between items-end mb-16 relative z-10">
        <div>
          <span className="ev-label !mb-4">SYSTEM_LEDGER_STREAM</span>
          <h3 className="text-6xl font-black uppercase tracking-tighter leading-none italic">RECORDS_LOG</h3>
        </div>
        <div className="text-right">
          <div className="ev-label opacity-40 mb-2">QUERY_MONTH: {month}</div>
          <div className="text-2xl font-black italic">{transactions.length.toString().padStart(2, '0')}</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto pr-4 custom-scrollbar relative z-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">
              <th className="pb-6 font-normal">TIMESTAMP</th>
              <th className="pb-6 font-normal">IDENTIFIER</th>
              <th className="pb-6 font-normal">TAG_ID</th>
              <th className="pb-6 font-normal text-right">VAL_CREDIT</th>
              <th className="pb-6 font-normal text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {!transactions.length ? (
              <tr>
                <td colSpan={5} className="py-40 text-center ev-label opacity-10 uppercase tracking-[1em]">NO_LOGS_DETECTED</td>
              </tr>
            ) : (
              transactions.map((t: Transaction) => (
                <tr key={t.id} className="group hover:bg-white/[0.02] transition-all">
                  <td className="py-6 font-mono text-[9px] text-white/20 group-hover:text-white/60">
                    {new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '.')}
                  </td>
                  <td className="py-6">
                    <p className="text-base font-black uppercase tracking-tighter truncate max-w-[250px] group-hover:text-lime-400 transition-all italic">
                      {t.description || 'GENERIC_ENTRY_LOG'}
                    </p>
                  </td>
                  <td className="py-6">
                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">{t.category}</span>
                  </td>
                  <td className={`py-6 text-right font-black text-lg italic ${
                    t.type === 'income' ? 'text-lime-400' : 'text-white'
                  }`}>
                    {fmtRupiah(t.amount).replace('Rp', '')}
                  </td>
                  <td className="py-6 text-right opacity-0 group-hover:opacity-100 transition-all">
                    <div className="flex gap-8 justify-end">
                      <button 
                        onClick={() => setEditTarget(t)} 
                        className="text-[8px] font-black text-white/40 hover:text-white uppercase tracking-[0.3em]"
                      >
                        [ MOD ]
                      </button>
                      <button 
                        onClick={() => { if(confirm('Delete log?')) del.mutate(t.id) }} 
                        className="text-[8px] font-black text-rose-900 hover:text-rose-500 uppercase tracking-[0.3em]"
                      >
                        [ DEL ]
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
        <DialogContent className="max-w-4xl bg-black border border-white/5 p-24 rounded-none shadow-none text-white overflow-hidden">
          <div className="absolute top-0 right-0 text-[10vw] font-black text-white/[0.02] pointer-events-none select-none -mr-10 -mt-10 italic">PATCH</div>
          <BentoAddCard transaction={editTarget} onSuccess={() => setEditTarget(null)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
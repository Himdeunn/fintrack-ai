'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transactionSchema, type TransactionFormData } from '@/lib/validations'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/constants'
import { useCreateTransaction, useUpdateTransaction } from '@/hooks/useTransactions'
import type { Transaction, TransactionType } from '@/types/database'
import { getExpenseByCategory } from '@/lib/utils/chartData'

import { formatCurrency } from '@/lib/utils'

export function BentoAddCard({ onSuccess, transaction }: { onSuccess?: () => void; transaction?: Transaction }) {
  const [type, setType] = useState<TransactionType>(transaction?.type ?? 'expense')
  const create = useCreateTransaction()
  const update = useUpdateTransaction()
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const { register, handleSubmit, setValue, watch, reset } =
    useForm<TransactionFormData>({
      resolver: zodResolver(transactionSchema),
      defaultValues: {
        type: transaction?.type ?? 'expense',
        amount: transaction?.amount?.toString() ?? '',
        category: transaction?.category ?? '',
        description: transaction?.description ?? '',
        date: transaction?.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      },
    })

  const selectedCat = watch('category')

  async function onSubmit(data: TransactionFormData) {
    try {
      if (transaction) {
        await update.mutateAsync({ id: transaction.id, data })
      } else {
        await create.mutateAsync(data)
        reset()
        setType('expense')
      }
      onSuccess?.()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={transaction ? "" : "p-10 bg-white/[0.01] backdrop-blur-sm relative h-full"}>
      {!transaction && (
        <div className="mb-12">
          <span className="ev-label !mb-4">DATA_ENTRY_NODE</span>
          <h3 className="text-4xl font-black uppercase tracking-tighter leading-none italic">LOG_STREAM</h3>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        <div className="flex gap-1 border-b border-white/5 pb-8">
          {['expense', 'income'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setType(t as TransactionType); setValue('type', t as TransactionType); setValue('category', ''); }}
              className={`flex-1 py-3 text-center transition-all ${
                type === t ? 'bg-white text-black' : 'text-white/20 hover:text-white/40'
              }`}
            >
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">{t}</span>
            </button>
          ))}
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <label className="ev-label !mb-1 opacity-30">NOMINAL_VALUE</label>
            <input 
              {...register('amount')} 
              placeholder="0.00"
              className="w-full bg-transparent border-b border-white/5 py-2 text-4xl font-black tracking-[-0.08em] text-white focus:outline-none transition-all placeholder:text-white/5"
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="ev-label !mb-1 opacity-30">TIMESTAMP</label>
              <input 
                {...register('date')} 
                type="date"
                className="w-full bg-transparent border-b border-white/5 py-2 text-[11px] font-mono uppercase text-white focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="ev-label !mb-1 opacity-30">CATEGORY_TAG</label>
              <select 
                {...register('category')}
                className="w-full bg-transparent border-b border-white/5 py-2 text-[11px] font-bold uppercase text-white focus:outline-none appearance-none"
              >
                <option value="" disabled className="bg-black">SELECT_CAT</option>
                {categories.map(c => (
                  <option key={c} value={c} className="bg-black">{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="ev-btn w-full !py-6 text-[10px] font-black bg-white text-black hover:bg-lime-400 border-none transition-all duration-1000"
          disabled={create.isPending || update.isPending}
        >
          {transaction ? 'COMMIT_UPDATE' : 'EXECUTE_ENTRY_SESSION'}
        </button>
      </form>
    </div>
  )
}

export function BentoTopCatCard({ transactions }: { transactions: Transaction[] }) {
  const data = getExpenseByCategory(transactions).slice(0, 4)

  return (
    <div className="p-10 bg-white/[0.01] h-[350px]">
      <div className="flex justify-between items-start mb-12">
        <div>
          <span className="ev-label !mb-4">ALLOCATION_GRID</span>
          <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none">DISTRIBUTION</h3>
        </div>
      </div>
      
      {!data.length ? (
        <div className="h-40 flex items-center justify-center ev-label opacity-10">ZERO_DATA</div>
      ) : (
        <div className="space-y-8">
          {data.map((item, idx) => (
            <div key={item.name} className="group">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[9px] font-bold text-white/30 group-hover:text-white transition-colors uppercase tracking-widest">{item.name}</span>
                <span className="font-mono text-[10px] text-white/10 group-hover:text-lime-400 transition-colors">{formatCurrency(item.value)}</span>
              </div>
              <div className="h-[1px] bg-white/5">
                <div 
                  className="h-full bg-white transition-all duration-1000 group-hover:bg-lime-400"
                  style={{ width: `${(item.value / data[0].value) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
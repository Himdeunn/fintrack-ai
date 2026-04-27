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
import { useLanguage } from '@/components/providers/LanguageProvider'
import { PlusCircle, Save, X } from 'lucide-react'

export function BentoAddCard({ onSuccess, transaction }: { onSuccess?: () => void; transaction?: Transaction }) {
  const { t } = useLanguage()
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
    <div className={transaction ? "p-10" : "p-0"}>
      {!transaction && (
        <div className="mb-10">
          <span className="text-indigo/40 dark:text-vanilla/40 text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">Quick Action</span>
          <h3 className="text-3xl font-black uppercase tracking-tighter text-indigo dark:text-vanilla">
            {t('add_transaction')}
          </h3>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex bg-indigo/5 dark:bg-vanilla/5 p-1 rounded-2xl border border-indigo/10 dark:border-vanilla/10">
          {['expense', 'income'].map((tType) => (
            <button
              key={tType}
              type="button"
              onClick={() => { setType(tType as TransactionType); setValue('type', tType as TransactionType); setValue('category', ''); }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                type === tType 
                  ? "bg-indigo text-vanilla shadow-lg shadow-indigo/20 dark:bg-vanilla dark:text-indigo" 
                  : "text-indigo/40 dark:text-vanilla/40 hover:text-indigo dark:hover:text-vanilla"
              }`}
            >
              {t(tType)}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest mb-3 block text-indigo/40 dark:text-vanilla/40">{t('amount')}</label>
            <div className="relative">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 font-black text-3xl opacity-20 text-indigo dark:text-vanilla">Rp</span>
              <input 
                {...register('amount')} 
                placeholder="0"
                type="number"
                min="0"
                className="w-full bg-transparent border-b-2 border-indigo/10 dark:border-vanilla/10 text-indigo dark:text-vanilla py-6 pl-14 pr-4 text-5xl font-black tracking-tighter outline-none focus:border-indigo dark:focus:border-vanilla transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-3 block text-indigo/40 dark:text-vanilla/40">{t('date')}</label>
              <input 
                {...register('date')} 
                type="date"
                className="w-full bg-indigo/5 dark:bg-vanilla/5 border border-indigo/10 dark:border-vanilla/10 text-indigo dark:text-vanilla rounded-2xl p-4 text-xs font-bold outline-none focus:border-indigo dark:focus:border-vanilla"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-3 block text-indigo/40 dark:text-vanilla/40">{t('category')}</label>
              <select 
                {...register('category')}
                className="w-full bg-indigo/5 dark:bg-vanilla/5 border border-indigo/10 dark:border-vanilla/10 text-indigo dark:text-vanilla rounded-2xl p-4 text-xs font-bold outline-none appearance-none focus:border-indigo dark:focus:border-vanilla"
              >
                <option value="" disabled className="bg-vanilla dark:bg-indigo">PILIH</option>
                {categories.map(c => (
                  <option key={c} value={c} className="bg-vanilla dark:bg-indigo text-indigo dark:text-vanilla">{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest mb-3 block text-indigo/40 dark:text-vanilla/40">{t('description')}</label>
            <input 
              {...register('description')} 
              placeholder="..."
              className="w-full bg-indigo/5 dark:bg-vanilla/5 border border-indigo/10 dark:border-vanilla/10 text-indigo dark:text-vanilla rounded-2xl p-4 text-xs font-bold outline-none focus:border-indigo dark:focus:border-vanilla"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="modern-btn w-full py-5 active:scale-95 disabled:opacity-50"
          disabled={create.isPending || update.isPending}
        >
          <Save size={16} />
          {transaction ? t('save') : t('add_transaction')}
        </button>
      </form>
    </div>
  )
}

export function BentoTopCatCard({ transactions }: { transactions: Transaction[] }) {
  const { t } = useLanguage()
  const data = getExpenseByCategory(transactions).slice(0, 4)

  return (
    <div className="flex flex-col h-full">
      {!data.length ? (
        <div className="flex-1 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-700 italic">No Data Analysis</div>
      ) : (
        <div className="space-y-8">
          {data.map((item, idx) => (
            <div key={item.name} className="group">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo/40 group-hover:text-indigo dark:text-vanilla/40 dark:group-hover:text-vanilla transition-colors">{item.name}</span>
                <span className="text-sm font-black tracking-tight text-indigo dark:text-vanilla">{formatCurrency(item.value)}</span>
              </div>
              <div className="h-1.5 bg-indigo/5 dark:bg-indigo-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 shadow-sm ${
                    idx === 0 ? 'bg-indigo shadow-indigo/20' : 'bg-indigo/20 dark:bg-vanilla/10'
                  }`}
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
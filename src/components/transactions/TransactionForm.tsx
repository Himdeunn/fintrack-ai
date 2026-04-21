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
    <div className={transaction ? "p-8" : "p-0"}>
      {!transaction && (
        <div className="mb-8">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <PlusCircle size={20} className="text-blue-600" />
            {t('add_transaction')}
          </h3>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          {['expense', 'income'].map((tType) => (
            <button
              key={tType}
              type="button"
              onClick={() => { setType(tType as TransactionType); setValue('type', tType as TransactionType); setValue('category', ''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                type === tType ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600' : 'text-slate-400'
              }`}
            >
              {t(tType).toUpperCase()}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{t('amount')}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">Rp</span>
              <input 
                {...register('amount')} 
                placeholder="0"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-12 pr-4 text-2xl font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{t('date')}</label>
              <input 
                {...register('date')} 
                type="date"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{t('category')}</label>
              <select 
                {...register('category')}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none"
              >
                <option value="" disabled>PILIH</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{t('description')}</label>
            <input 
              {...register('description')} 
              placeholder="..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="modern-btn w-full py-4 shadow-lg shadow-blue-500/20"
          disabled={create.isPending || update.isPending}
        >
          <Save size={18} />
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
      <div className="mb-8">
        <h3 className="text-lg font-bold">{t('financial_efficiency')}</h3>
        <p className="text-xs text-muted font-medium">{t('category')} Terbesar</p>
      </div>
      
      {!data.length ? (
        <div className="flex-1 flex items-center justify-center text-slate-300 italic text-sm">{t('history')} Kosong</div>
      ) : (
        <div className="space-y-6">
          {data.map((item, idx) => (
            <div key={item.name} className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-500">{item.name}</span>
                <span className="text-slate-900 dark:text-white">{formatCurrency(item.value)}</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    idx === 0 ? 'bg-blue-600' : 'bg-slate-400'
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
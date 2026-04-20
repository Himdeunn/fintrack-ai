'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transactionSchema, type TransactionFormData } from '@/lib/validations'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/constants'
import { useCreateTransaction, useUpdateTransaction } from '@/hooks/useTransactions'
import type { Transaction } from '@/types/database'
import { getExpenseByCategory } from '@/lib/utils/chartData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function BentoAddCard({ onSuccess, transaction }: { onSuccess?: () => void; transaction?: Transaction }) {
  const [type, setType] = useState<'income' | 'expense'>(transaction?.type ?? 'expense')
  const create = useCreateTransaction()
  const update = useUpdateTransaction()
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } =
    useForm<TransactionFormData>({
      resolver: zodResolver(transactionSchema),
      defaultValues: {
        type: transaction?.type ?? 'expense',
        amount: transaction?.amount?.toString() ?? '',
        category: transaction?.category ?? '',
        description: transaction?.description ?? '',
        date: transaction?.date ?? new Date().toISOString().split('T')[0],
      },
    })

  const selectedCat = watch('category')

  async function onSubmit(data: TransactionFormData) {
    if (transaction) {
      await update.mutateAsync({ id: transaction.id, data })
    } else {
      await create.mutateAsync(data)
      reset()
      setType('expense')
    }
    onSuccess?.()
  }

  return (
    <div className={transaction ? "" : "bento-card bg-white border-4"}>
      {!transaction && (
        <div className="mb-10">
          <div className="bento-label bg-yellow-300 text-black">ENTRY FORM</div>
          <h3 className="text-4xl font-black uppercase tracking-tighter">Quick Record</h3>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex border-4 border-black p-1 bg-black gap-1">
          <button
            type="button"
            onClick={() => { setType('expense'); setValue('type', 'expense'); setValue('category', ''); }}
            className={`flex-1 py-3 font-black uppercase tracking-widest text-xs transition-all ${
              type === 'expense' ? 'bg-pink-400 text-black' : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => { setType('income'); setValue('type', 'income'); setValue('category', ''); }}
            className={`flex-1 py-3 font-black uppercase tracking-widest text-xs transition-all ${
              type === 'income' ? 'bg-emerald-400 text-black' : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            Income
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-black uppercase text-xs">Amount (IDR)</Label>
            <Input 
              {...register('amount')} 
              type="number" 
              className="h-16 border-4 border-black rounded-none font-black text-2xl focus-visible:ring-0"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-black uppercase text-xs">Date</Label>
            <Input 
              {...register('date')} 
              type="date"
              className="h-16 border-4 border-black rounded-none font-black focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-black uppercase text-xs">Category Selection</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setValue('category', cat)}
                className={`border-4 border-black p-2 text-[10px] font-black uppercase transition-all ${
                  selectedCat === cat 
                    ? 'bg-yellow-300 translate-x-1 translate-y-1 shadow-none' 
                    : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-black uppercase text-xs">Notes</Label>
          <Input 
            {...register('description')} 
            className="h-16 border-4 border-black rounded-none font-bold focus-visible:ring-0"
          />
        </div>

        <Button 
          type="submit" 
          className={`neo-btn w-full h-16 text-xl ${
            type === 'expense' ? 'bg-pink-400' : 'bg-emerald-400'
          }`}
          disabled={create.isPending || update.isPending}
        >
          {transaction ? 'UPDATE RECORD' : 'SAVE TRANSACTION →'}
        </Button>
      </form>
    </div>
  )
}

export function BentoTopCatCard({ transactions }: { transactions: Transaction[] }) {
  const data = getExpenseByCategory(transactions).slice(0, 4)

  return (
    <div className="bento-card h-full bg-white border-4">
      <div className="bento-label">Top Categories</div>
      <h3 className="text-3xl font-black uppercase mb-8 tracking-tighter">Burning Cash</h3>
      
      {!data.length ? (
        <div className="h-40 flex items-center justify-center font-black uppercase text-gray-300 italic">No Data</div>
      ) : (
        <div className="space-y-8">
          {data.map((item) => (
            <div key={item.name}>
              <div className="flex justify-between items-end mb-2">
                <span className="font-black uppercase text-xs">{item.name}</span>
                <span className="font-black text-xs text-red-600">{fmtRupiah(item.value)}</span>
              </div>
              <div className="h-6 border-4 border-black bg-white">
                <div 
                  className="h-full bg-red-500 border-r-4 border-black"
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
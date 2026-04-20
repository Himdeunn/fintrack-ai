'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transactionSchema, type TransactionFormData } from '@/lib/validations'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/constants'
import { useCreateTransaction, useUpdateTransaction } from '@/hooks/useTransactions'
import type { Transaction, TransactionType } from '@/types/database'
import { getExpenseByCategory } from '@/lib/utils/chartData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function fmtRupiah(v: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(v)
}

export function BentoAddCard({ onSuccess, transaction }: { onSuccess?: () => void; transaction?: Transaction }) {
  const [type, setType] = useState<TransactionType>(transaction?.type ?? 'expense')
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
    <div className={transaction ? "" : "bento-card"}>
      {!transaction && (
        <div className="mb-8">
          <div className="bento-label">catat aktivitas</div>
          <h3 className="text-xl font-extrabold tracking-tight">Tambah Transaksi</h3>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Toggle Type */}
        <div className="flex p-1.5 bg-gray-100 dark:bg-white/5 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => { setType('expense'); setValue('type', 'expense'); setValue('category', ''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              type === 'expense' ? 'bg-white dark:bg-zinc-800 text-rose-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Pengeluaran
          </button>
          <button
            type="button"
            onClick={() => { setType('income'); setValue('type', 'income'); setValue('category', ''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              type === 'income' ? 'bg-white dark:bg-zinc-800 text-emerald-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Pemasukan
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Jumlah (IDR)</Label>
            <Input 
              {...register('amount')} 
              type="number" 
              className="h-12 bg-gray-50 dark:bg-white/5 border-none rounded-xl font-bold text-lg focus-visible:ring-2 focus-visible:ring-indigo-500"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Tanggal</Label>
            <Input 
              {...register('date')} 
              type="date"
              className="h-12 bg-gray-50 dark:bg-white/5 border-none rounded-xl font-bold focus-visible:ring-2 focus-visible:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Pilih Kategori</Label>
          <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setValue('category', cat)}
                className={`py-2.5 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  selectedCat === cat 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Catatan (Opsional)</Label>
          <Input 
            {...register('description')} 
            placeholder="Misal: Beli nasi padang"
            className="h-12 bg-gray-50 dark:bg-white/5 border-none rounded-xl font-medium focus-visible:ring-2 focus-visible:ring-indigo-500"
          />
        </div>

        <Button 
          type="submit" 
          className={`w-full h-14 rounded-2xl font-bold text-base transition-all active:scale-[0.98] shadow-lg ${
            type === 'expense' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-100' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'
          }`}
          disabled={create.isPending || update.isPending}
        >
          {transaction ? 'Perbarui Data' : 'Simpan Transaksi →'}
        </Button>
      </form>
    </div>
  )
}

export function BentoTopCatCard({ transactions }: { transactions: Transaction[] }) {
  const data = getExpenseByCategory(transactions).slice(0, 4)

  return (
    <div className="bento-card h-full">
      <div className="bento-label">kategori teratas</div>
      <h3 className="text-xl font-extrabold tracking-tight mb-8">Paling Boros</h3>
      
      {!data.length ? (
        <div className="h-40 flex items-center justify-center text-gray-300 italic text-sm">Belum ada data</div>
      ) : (
        <div className="space-y-6">
          {data.map((item, idx) => (
            <div key={item.name}>
              <div className="flex justify-between items-end mb-2">
                <span className="font-bold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wide">{item.name}</span>
                <span className="font-bold text-xs text-rose-600">{fmtRupiah(item.value)}</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    idx === 0 ? 'bg-indigo-600' : idx === 1 ? 'bg-emerald-500' : 'bg-amber-400'
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
'use client'

import type { Transaction } from '@/types/database'

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n)
}

export function BentoSummaryCards({ transactions }: { transactions: Transaction[] }) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)
  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)
  const balance = income - expense
  const savingRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0

  return (
    <>
      {/* Saldo — Large Accent Card */}
      <div className="bento-card bento-card--accent md:col-span-2 flex flex-col justify-between min-h-[160px]">
        <div>
          <div className="bento-label text-indigo-100/70">total saldo saat ini</div>
          <div className="text-4xl font-extrabold tracking-tighter">
            {formatRupiah(balance)}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs font-medium bg-white/10 w-fit px-3 py-1.5 rounded-full">
          {balance >= 0 ? '✨ Kondisi keuangan sehat' : '⚠️ Pengeluaran berlebih'}
        </div>
      </div>

      {/* Pemasukan */}
      <div className="bento-card bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30">
        <div className="bento-label text-emerald-600">pemasukan</div>
        <div className="bento-value text-emerald-700 dark:text-emerald-400">{formatRupiah(income)}</div>
        <div className="mt-2 text-[10px] font-bold text-emerald-600/50 uppercase tracking-widest">
          {transactions.filter((t) => t.type === 'income').length} Transaksi
        </div>
      </div>

      {/* Pengeluaran */}
      <div className="bento-card bg-rose-50/50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30">
        <div className="bento-label text-rose-600">pengeluaran</div>
        <div className="bento-value text-rose-700 dark:text-rose-400">{formatRupiah(expense)}</div>
        <div className="mt-2 text-[10px] font-bold text-rose-600/50 uppercase tracking-widest">
          {transactions.filter((t) => t.type === 'expense').length} Transaksi
        </div>
      </div>

      {/* Saving Rate */}
      <div className="bento-card md:col-span-4 flex flex-col md:flex-row items-center justify-between gap-6 py-6">
        <div className="flex-1">
          <div className="bento-label">saving rate bulan ini</div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tighter" style={{ color: savingRate >= 20 ? '#10b981' : '#f59e0b' }}>
              {savingRate}%
            </span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Target 20%</span>
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-1 shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
              style={{
                width: `${Math.min(savingRate, 100)}%`,
                background: savingRate >= 20 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
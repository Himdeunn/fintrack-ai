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
      <div className="bento-card bg-yellow-300 md:col-span-2">
        <div className="bento-label">NET BALANCE</div>
        <div className="bento-value text-5xl">{formatRupiah(balance)}</div>
        <div className="mt-4 font-black uppercase text-xs">
          {balance >= 0 ? '✓ Status: Healthy' : '✗ Status: Overspent'}
        </div>
      </div>

      <div className="bento-card bg-emerald-400">
        <div className="bento-label">INCOME</div>
        <div className="bento-value">{formatRupiah(income)}</div>
        <div className="mt-2 font-black text-[10px] uppercase">
          {transactions.filter((t) => t.type === 'income').length} EVENTS
        </div>
      </div>

      <div className="bento-card bg-pink-400">
        <div className="bento-label">EXPENSES</div>
        <div className="bento-value">{formatRupiah(expense)}</div>
        <div className="mt-2 font-black text-[10px] uppercase">
          {transactions.filter((t) => t.type === 'expense').length} EVENTS
        </div>
      </div>

      <div className="bento-card md:col-span-4 bg-cyan-300 flex flex-col md:flex-row items-center gap-8">
        <div className="shrink-0">
          <div className="bento-label">SAVING RATE</div>
          <div className="bento-value text-6xl">{savingRate}%</div>
        </div>
        <div className="w-full">
          <div className="h-10 border-4 border-black bg-white p-1">
            <div
              className="h-full bg-black transition-all duration-1000"
              style={{ width: `${Math.min(savingRate, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 font-black uppercase text-[10px]">
            <span>0%</span>
            <span>Target: 20%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </>
  )
}
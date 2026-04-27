'use client'

import { useEffect, useState } from 'react'
import { BentoTxList } from '@/components/transactions/TransactionList'
import { BentoAddCard } from '@/components/transactions/TransactionForm'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function TransactionsPage() {
  const { t, language } = useLanguage()
  const [currentMonth] = useState(() => new Date().toISOString().slice(0, 7))

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Header */}
      <div className="col-span-12 mb-10">
        <span className="text-rich-muted mb-4 block">
          {language === 'id' ? 'Manajemen Transaksi' : 'Transaction Management'}
        </span>
        <h1 className="text-6xl font-black uppercase tracking-tighter text-indigo dark:text-vanilla leading-none">
          {language === 'id' ? 'Riwayat' : 'Ledger'} <span>{language === 'id' ? 'Buku Besar' : 'History'}</span>
        </h1>
      </div>

      {/* Add Form */}
      <div className="col-span-12 lg:col-span-4">
        <div className="modern-card bg-white dark:bg-indigo-muted !text-vanilla shadow-xl shadow-indigo/5 border-none lg:sticky lg:top-12 dark:!text-indigo">
           <BentoAddCard />
        </div>
      </div>

      {/* List */}
      <div className="col-span-12 lg:col-span-8">
        <BentoTxList month={currentMonth} />
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
import { BentoNavbar } from '@/components/Navbar'
import { BentoSummaryCards } from '@/components/dashboard/SummaryCards'
import { BentoBarChart, BentoPieChart } from '@/components/dashboard/ExpensePieChart'
import { BentoAiCard } from '@/components/dashboard/AiSummaryCard'
import { BentoTxList } from '@/components/transactions/TransactionList'
import { BentoAddCard, BentoTopCatCard } from '@/components/transactions/TransactionForm'
import { useUser } from '@/hooks/useUser'
import Link from 'next/link'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function DashboardPage() {
  const { user } = useUser()
  const { t } = useLanguage()
  const [currentMonth, setCurrentMonth] = useState('')
  const [currentMonthLabel, setCurrentMonthLabel] = useState('')

  useEffect(() => {
    const now = new Date()
    setCurrentMonth(now.toISOString().slice(0, 7))
    setCurrentMonthLabel(now.toLocaleString('id-ID', {
      month: 'long', year: 'numeric',
    }))
  }, [])

  // Hooks must be called here, at the top level
  const monthlyTransactions = useTransactions(currentMonth).data || []
  const allTransactions = useTransactions().data || []

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 lg:p-12 transition-colors">
      <div className="max-w-7xl mx-auto">
        <BentoNavbar user={user} currentMonth={currentMonthLabel} />

        {/* HERO */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="heading-l mb-2 text-slate-900 dark:text-white">
                {currentMonthLabel}
              </h1>
              <p className="text-slate-500 font-medium">{t('summary')} {t('transactions')}</p>
            </div>
          </div>
        </section>

        {/* GRID */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Row 1: Key Metrics */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <BentoSummaryCards transactions={monthlyTransactions} />
          </div>

          {/* Row 2: Analytics */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <div className="modern-card min-h-[400px]">
               <BentoBarChart transactions={allTransactions} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="modern-card h-[400px]"><BentoPieChart transactions={monthlyTransactions} /></div>
              <div className="modern-card h-[400px]"><BentoTopCatCard transactions={monthlyTransactions} /></div>
            </div>
          </div>

          {/* Action & AI */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="modern-card bg-blue-600 !text-white flex-1 shadow-xl shadow-blue-500/20">
              <BentoAddCard />
            </div>
            <div className="modern-card h-[350px]">
              <BentoAiCard month={currentMonth} />
            </div>
          </div>

          {/* Ledger */}
          <div className="col-span-12 mt-12">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold">{t('ledger')}</h2>
              <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="modern-card !p-0 overflow-hidden border-none shadow-none bg-transparent">
              <BentoTxList month={currentMonth} />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-24 pt-12 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="font-bold text-slate-900 dark:text-white">FINTRACK.AI</div>
            <p className="text-xs">© 2026 Smart Finance Tracker. All rights reserved.</p>
          </div>
          <div className="flex gap-8 text-sm font-medium">
            <Link href="/terms" className="hover:text-blue-600 transition-colors">{t('terms')}</Link>
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">{t('privacy')}</Link>
          </div>
        </footer>
      </div>
    </div>
  )
}
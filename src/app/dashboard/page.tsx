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

export default function DashboardPage() {
  const { user } = useUser()
  const [currentMonth, setCurrentMonth] = useState('')
  const [currentMonthLabel, setCurrentMonthLabel] = useState('')

  useEffect(() => {
    const now = new Date()
    setCurrentMonth(now.toISOString().slice(0, 7))
    setCurrentMonthLabel(now.toLocaleString('id-ID', {
      month: 'long', year: 'numeric',
    }))
  }, [])

  // Fetch bulan ini — summary cards, pie chart, tx list
  const { data: monthlyTx = [] } = useTransactions(currentMonth)

  // Fetch semua data — bar chart 6 bulan
  const { data: allTx = [] } = useTransactions()

  if (!user) return null

  return (
    <div className="min-h-screen p-8 md:p-12 lg:p-20">
      <BentoNavbar user={user} currentMonth={currentMonthLabel} />

      <div className="bento-grid">
        {/* ROW 1: Summary Stats */}
        <BentoSummaryCards transactions={monthlyTx} />

        {/* ROW 2: Analytical Visuals */}
        <div className="md:col-span-2">
          <BentoBarChart transactions={allTx} />
        </div>
        <div className="md:col-span-2">
          <BentoPieChart transactions={monthlyTx} />
        </div>

        {/* ROW 3: AI Insights & Details */}
        <div className="md:col-span-2">
          <BentoAiCard month={currentMonth} />
        </div>
        <div className="md:col-span-2">
          <BentoTxList month={currentMonth} />
        </div>

        {/* ROW 4: Actions & More */}
        <div className="md:col-span-1">
          <BentoTopCatCard transactions={monthlyTx} />
        </div>
        <div className="md:col-span-3">
          <BentoAddCard />
        </div>
      </div>
      
      <div className="mt-20 text-center font-bold uppercase opacity-20 tracking-widest text-[10px]">
        Smart Finance AI — Powered by Neon & Gemini
      </div>
    </div>
  )
}
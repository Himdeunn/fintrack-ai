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

  const { data: monthlyTx = [] } = useTransactions(currentMonth)
  const { data: allTx = [] } = useTransactions()

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 lg:p-20 selection:bg-lime-400 selection:text-black">
      <BentoNavbar user={user} currentMonth={currentMonthLabel} />

      {/* REFINED HERO */}
      <section className="mt-20 mb-32 border-b-8 border-white/5 pb-20">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          <h1 className="dr-title text-[clamp(4rem,15vw,12rem)] leading-none">
            {currentMonthLabel.split(' ')[0]}<br />
            <span className="text-white/5 italic">PORTFOLIO.</span>
          </h1>
          <div className="text-right">
            <span className="dr-label !text-lime-400 mb-2">SYSTEM_HEALTH</span>
            <div className="flex items-center justify-end gap-3">
              <div className="w-3 h-3 bg-lime-400 rounded-full animate-pulse" />
              <span className="dr-title text-2xl tracking-widest">STABLE</span>
            </div>
          </div>
        </div>
      </section>

      {/* BALANCED MODULAR GRID */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Row 1: Key Metrics (3 Cards) */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
          <BentoSummaryCards transactions={monthlyTx} />
        </div>

        {/* Row 2: Analytics & Interaction Split */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          {/* Main Chart */}
          <div className="dr-card flex-1 min-h-[500px]">
             <BentoBarChart transactions={allTx} />
          </div>
          
          {/* Sub Analytics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="dr-card h-[450px]"><BentoPieChart transactions={monthlyTx} /></div>
            <div className="dr-card h-[450px]"><BentoTopCatCard transactions={monthlyTx} /></div>
          </div>
        </div>

        {/* Action & AI Column */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <div className="dr-card bg-lime-400 !text-black flex-1 shadow-[20px_20px_0px_rgba(255,255,255,0.05)]">
            <BentoAddCard />
          </div>
          <div className="dr-card h-[350px]">
            <BentoAiCard month={currentMonth} />
          </div>
        </div>

        {/* Full Width Ledger */}
        <div className="col-span-12 mt-20">
          <div className="flex justify-between items-center mb-10 px-4">
            <h2 className="dr-title text-5xl italic">LEDGER_LOGS</h2>
            <div className="h-2 flex-1 bg-white/5 mx-10" />
            <span className="dr-label opacity-20 tracking-[1em]">END_OF_STREAM</span>
          </div>
          <div className="dr-card !p-0 overflow-hidden border-none bg-transparent">
            <BentoTxList month={currentMonth} />
          </div>
        </div>
      </div>

      {/* REFINED FOOTER */}
      <footer className="mt-40 pt-20 border-t-2 border-white/10 flex flex-col md:flex-row justify-between items-start gap-10">
        <div className="space-y-6">
          <div className="dr-title text-4xl">FINTRACK.AI</div>
          <p className="dr-label !text-white/20 max-w-sm">DEVELOPED FOR HIGH-PERFORMANCE FINANCIAL MONITORING. ALL SYSTEMS NOMINAL.</p>
        </div>
        <div className="grid grid-cols-2 gap-20">
          <div>
            <span className="dr-label block mb-4">LEGAL</span>
            <div className="flex flex-col gap-2 dr-title text-lg opacity-40">
              <Link href="/terms" className="hover:text-lime-400">TERMS</Link>
              <Link href="/privacy" className="hover:text-lime-400">PRIVACY</Link>
            </div>
          </div>
          <div className="text-right">
            <span className="dr-label block mb-4">VERSION</span>
            <span className="dr-title text-2xl text-lime-400">2.0.0_STABLE</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
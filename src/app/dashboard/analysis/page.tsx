'use client'

import { useEffect, useState, useMemo } from 'react'
import { BentoAiCard } from '@/components/dashboard/AiSummaryCard'
import { BentoPieChart, BentoBarChart } from '@/components/dashboard/ExpensePieChart'
import { useTransactions } from '@/hooks/useTransactions'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function AnalysisPage() {
  const { t, language } = useLanguage()
  const [currentMonth] = useState(() => new Date().toISOString().slice(0, 7))

  const { data: monthlyData } = useTransactions(currentMonth)
  const { data: allData } = useTransactions()
  
  const monthlyTransactions = useMemo(() => monthlyData || [], [monthlyData])
  const allTransactions = useMemo(() => allData || [], [allData])

  return (
    <div className="grid grid-cols-12 gap-8">
       {/* Header */}
       <div className="col-span-12 mb-10">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-dusk-blue/40 dark:text-azure-mist/40 mb-4 block">
          {language === 'id' ? 'Intelejensi Finansial AI' : 'AI Financial Intelligence'}
        </span>
        <h1 className="text-6xl font-black uppercase tracking-tighter text-dusk-blue dark:text-azure-mist leading-none">
          {language === 'id' ? 'Analisis' : 'Deep'} <span className="opacity-40">{language === 'id' ? 'Mendalam' : 'Analysis'}</span>
        </h1>
      </div>

      {/* AI Card */}
      <div className="col-span-12 lg:col-span-5">
        <div className="modern-card h-full">
          <BentoAiCard month={currentMonth} />
        </div>
      </div>

      {/* Charts */}
      <div className="col-span-12 lg:col-span-7 space-y-8">
        <div className="modern-card min-h-[400px]">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-dusk-blue/40 dark:text-azure-mist/40 mb-10 block">
            {language === 'id' ? 'Distribusi Pengeluaran' : 'Expense Distribution'}
          </span>
          <BentoPieChart transactions={allTransactions} />
        </div>
        <div className="modern-card min-h-[400px]">
          <BentoBarChart transactions={allTransactions} />
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState, useMemo } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
import { BentoSummaryCards } from '@/components/dashboard/SummaryCards'
import { BentoBarChart } from '@/components/dashboard/ExpensePieChart'
import { BentoTopCatCard } from '@/components/transactions/TransactionForm'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function DashboardPage() {
  const { t, language } = useLanguage()
  const [currentMonth] = useState(() => new Date().toISOString().slice(0, 7))
  const [currentMonthLabel, setCurrentMonthLabel] = useState('')

  useEffect(() => {
    const now = new Date()
    const locale = language === 'id' ? 'id-ID' : 'en-US'
    setCurrentMonthLabel(now.toLocaleString(locale, {
      month: 'long', year: 'numeric',
    }))
  }, [language])

  const { data: monthlyData } = useTransactions(currentMonth)
  const { data: allData } = useTransactions()
  
  const monthlyTransactions = useMemo(() => monthlyData || [], [monthlyData])
  const allTransactions = useMemo(() => allData || [], [allData])

  return (
    <>
      {/* HERO */}
      <section className="mb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-dusk-blue/40 dark:text-azure-mist/40 mb-4 block">
              {t('summary')}
            </span>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] md:leading-[0.85] text-dusk-blue dark:text-azure-mist">
              {currentMonthLabel.split(' ')[0]}<br/>
              <span className="opacity-20">{currentMonthLabel.split(' ')[1]}</span>
            </h1>
          </div>
        </div>
      </section>

      {/* GRID */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Row 1: Key Metrics */}
        <div className="col-span-12">
          <BentoSummaryCards transactions={monthlyTransactions} />
        </div>

        {/* Row 2: Analytics */}
        <div className="col-span-12 lg:col-span-8">
          <div className="modern-card min-h-[450px] flex flex-col">
             <BentoBarChart transactions={allTransactions} />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="modern-card h-full flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-dusk-blue/40 dark:text-azure-mist/40 mb-10 block">
              {language === 'id' ? 'Kategori Teratas' : 'Top Categories'}
            </span>
            <div className="flex-1">
              <BentoTopCatCard transactions={monthlyTransactions} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import type { Transaction } from '@/types/database'
import { getDailyData, getWeeklyData, getLast6MonthsData, getExpenseByCategory } from '@/lib/utils/chartData'
import { formatCurrency } from '@/lib/utils'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useTheme } from 'next-themes'

export function BentoBarChart({ transactions }: { transactions: Transaction[] }) {
  const { t, language } = useLanguage()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly')
  const locale = language === 'id' ? 'id-ID' : 'en-US'
  
  const data = useMemo(() => {
    if (period === 'daily') return getDailyData(transactions, locale)
    if (period === 'weekly') return getWeeklyData(transactions, locale)
    return getLast6MonthsData(transactions, locale)
  }, [transactions, locale, period])

  useEffect(() => {
    setMounted(true)
  }, [])

  const colors = {
    income: theme === 'dark' ? '#F0E7D5' : '#212842',
    expense: '#f43f5e',
    text: theme === 'dark' ? 'rgba(240, 231, 213, 0.4)' : 'rgba(33, 40, 66, 0.4)',
    tooltipBg: theme === 'dark' ? '#2d3654' : '#ffffff',
    tooltipBorder: theme === 'dark' ? 'rgba(240, 231, 213, 0.1)' : 'rgba(33, 40, 66, 0.1)',
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo/40 dark:text-vanilla/40">
          {language === 'id' ? 'Analisis Arus Kas' : 'Cashflow Analytics'}
        </span>
        <div className="flex bg-indigo/5 dark:bg-vanilla/5 p-1.5 rounded-2xl border border-indigo/10 dark:border-vanilla/10 w-full sm:w-fit overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max">
            {(['daily', 'weekly', 'monthly'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  period === p 
                    ? 'bg-indigo text-vanilla dark:bg-vanilla dark:text-indigo shadow-lg' 
                    : 'text-indigo/40 dark:text-vanilla/40 hover:text-indigo dark:hover:text-vanilla'
                }`}
              >
                {p === 'daily' ? (language === 'id' ? 'Harian' : 'Daily') : 
                 p === 'weekly' ? (language === 'id' ? 'Mingguan' : 'Weekly') : 
                 (language === 'id' ? 'Bulanan' : 'Monthly')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full h-[350px] relative">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={12}>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: colors.text, fontWeight: 900 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                tickFormatter={(v) => `Rp ${v.toLocaleString()}`}
                tick={{ fontSize: 10, fill: colors.text, fontWeight: 900 }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                cursor={{ fill: colors.income, opacity: 0.05 }}
                contentStyle={{ 
                  background: colors.tooltipBg,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${colors.tooltipBorder}`, 
                  borderRadius: '24px', 
                  fontSize: '10px',
                  fontWeight: 'bold',
                  padding: '16px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: theme === 'dark' ? '#F0E7D5' : '#212842'
                }}
                itemStyle={{ color: theme === 'dark' ? '#F0E7D5' : '#212842' }}
              />
              <Bar dataKey="income"  name={t('income').toUpperCase()} fill={colors.income} radius={[6, 6, 6, 6]} barSize={12} />
              <Bar dataKey="expense" name={t('expense').toUpperCase()} fill={colors.expense} radius={[6, 6, 6, 6]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo/20 dark:text-vanilla/20 italic animate-pulse">
              INITIALIZING_CORE...
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export function BentoPieChart({ transactions }: { transactions: Transaction[] }) {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  const data = useMemo(() => getExpenseByCategory(transactions), [transactions])

  useEffect(() => {
    setMounted(true)
  }, [])

  const PIE_COLORS = theme === 'dark' 
    ? ['#F0E7D5', '#34d399', '#fb7185', '#fbbf24', '#a78bfa', '#94a3b8']
    : ['#212842', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#64748b']

  // Fallback UI to check if data exists but chart fails
  if (mounted && data.length > 0) {
    return (
      <div className="flex flex-col h-full space-y-10">
        {/* The Pie Chart Container */}
        <div className="h-[250px] w-full relative flex justify-center items-center">
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie
                 data={data}
                 cx="50%"
                 cy="50%"
                 innerRadius={60}
                 outerRadius={80}
                 paddingAngle={5}
                 dataKey="value"
                 stroke="transparent"
                 isAnimationActive={false} // Disable animation for max stability
               >
                 {data.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                 ))}
               </Pie>
               <Tooltip />
             </PieChart>
           </ResponsiveContainer>
        </div>

        {/* Detailed List (Always visible if data exists) */}
        <div className="space-y-6">
          {data.map((item, idx) => (
            <div key={item.name} className="group">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo/40 dark:text-vanilla/40 group-hover:text-indigo dark:group-hover:text-vanilla transition-colors">
                  {item.name}
                </span>
                <span className="text-xs font-black text-indigo dark:text-vanilla">
                  {formatCurrency(item.value)}
                </span>
              </div>
              <div className="h-1 bg-indigo/5 dark:bg-vanilla/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo dark:bg-vanilla transition-all duration-1000"
                  style={{ width: `${(item.value / data[0].value) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 py-20">
      <div className="w-16 h-16 rounded-[24px] bg-indigo/5 dark:bg-vanilla/5 flex items-center justify-center border border-indigo/10 dark:border-vanilla/10">
        <div className="w-8 h-8 rounded-full border-2 border-dashed border-indigo/20 dark:border-vanilla/20 animate-spin" />
      </div>
      <div className="text-center px-10">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo/20 dark:text-vanilla/20 italic block mb-2 text-center">
          DATA_STREAM_EMPTY
        </span>
        <p className="text-[9px] font-bold text-indigo/40 dark:text-vanilla/40 uppercase tracking-widest text-center leading-relaxed">
          Record some expenses to activate the analysis engine.
        </p>
      </div>
    </div>
  )
}
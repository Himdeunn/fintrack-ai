'use client'

import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import type { Transaction } from '@/types/database'
import { getLast6MonthsData, getExpenseByCategory } from '@/lib/utils/chartData'
import { formatCurrency } from '@/lib/utils'
import { useLanguage } from '@/components/providers/LanguageProvider'

const COLORS = ['#2563eb', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#64748b']

export function BentoBarChart({ transactions }: { transactions: Transaction[] }) {
  const { t, language } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const data = getLast6MonthsData(transactions)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h3 className="text-lg font-bold">{t('summary')} 6 {language === 'id' ? 'Bulan Terakhir' : 'Months'}</h3>
        <p className="text-xs text-muted font-medium">{t('income')} vs {t('expense')}</p>
      </div>
      <div className="flex-1 w-full min-h-[300px]">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                tickFormatter={(v) => formatCurrency(v)}
                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                  background: '#ffffff',
                  border: '1px solid #e2e8f0', 
                  borderRadius: '12px', 
                  fontSize: '12px',
                  padding: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              />
              <Bar dataKey="income"  name={t('income')} fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar dataKey="expense" name={t('expense')} fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

export function BentoPieChart({ transactions }: { transactions: Transaction[] }) {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const data = getExpenseByCategory(transactions)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold">{t('category')} {t('expense')}</h3>
        <p className="text-xs text-muted font-medium">{t('summary')} Alokasi</p>
      </div>
      
      {!data.length ? (
        <div className="flex-1 flex items-center justify-center text-slate-300 italic text-sm">{t('history')} Kosong</div>
      ) : (
        <div className="flex-1 w-full relative min-h-[250px]">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="transparent"
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: '#ffffff', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}
                  formatter={(v: any) => formatCurrency(Number(v))}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
    </div>
  )
}
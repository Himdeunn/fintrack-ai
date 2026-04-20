'use client'

import { useEffect, useState } from 'react'
import type { Transaction } from '@/types/database'
import { motion } from 'framer-motion'

function fmtRupiah(v: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(v)
}

export function BentoSummaryCards({ transactions }: { transactions: Transaction[] }) {
  const [hash, setHash] = useState('')
  
  useEffect(() => {
    setHash(Math.random().toString(36).substring(7).toUpperCase())
  }, [])

  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = income - expense

  const stats = [
    { label: 'CASH_INFLOW', value: income, accent: 'text-lime-400' },
    { label: 'CASH_OUTFLOW', value: expense, accent: 'text-white' },
    { label: 'NET_REVENUE', value: balance, accent: 'text-lime-400' },
  ]

  return (
    <>
      {stats.map((s, idx) => (
        <motion.div 
          key={idx} 
          whileHover={{ scale: 1.02, y: -5 }}
          className="dr-card flex flex-col justify-between h-[300px] group relative overflow-hidden"
        >
          {/* Background ID Decoration */}
          <div className="absolute -right-10 -bottom-10 dr-title text-[15rem] opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
            0{idx+1}
          </div>

          <div className="relative z-10">
            <span className="dr-label block mb-8 opacity-40 group-hover:opacity-100 transition-opacity">REF_CODE_{hash}</span>
            <div className={`dr-title text-7xl ${s.accent} tracking-[-0.1em] group-hover:tracking-normal transition-all duration-700`}>
              {Math.abs(s.value).toLocaleString('id-ID')}
            </div>
            <span className="dr-label text-white/20">IDR_CURRENCY_CORE</span>
          </div>

          <div className="relative z-10 border-t-2 border-white/5 pt-10 flex justify-between items-end">
            <div className="dr-title text-xl opacity-20 group-hover:opacity-100">{s.label}</div>
            <div className="w-12 h-1 bg-white/10 group-hover:bg-lime-400 transition-colors" />
          </div>
        </motion.div>
      ))}
    </>
  )
}
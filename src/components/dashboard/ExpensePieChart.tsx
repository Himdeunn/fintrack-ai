'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import type { Transaction } from '@/types/database'
import { getLast6MonthsData, getExpenseByCategory } from '@/lib/utils/chartData'

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6']

function formatShort(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}jt`
  if (v >= 1_000) return `${(v / 1_000)}rb`
  return v.toString()
}

export function BentoBarChart({ transactions }: { transactions: Transaction[] }) {
  const data = getLast6MonthsData(transactions)
  return (
    <div className="bento-card flex flex-col h-[400px]">
      <div className="bento-label">Statistik 6 Bulan</div>
      <h3 className="text-xl font-extrabold tracking-tight mb-6">Tren Pemasukan & Pengeluaran</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#888', fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tickFormatter={formatShort}
              tick={{ fontSize: 10, fill: '#888', fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.02)' }}
              contentStyle={{ 
                border: 'none', 
                borderRadius: '16px', 
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
                fontSize: '12px',
                fontWeight: '700'
              }}
            />
            <Bar dataKey="income"  name="Masuk" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Keluar" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function BentoPieChart({ transactions }: { transactions: Transaction[] }) {
  const data = getExpenseByCategory(transactions)

  return (
    <div className="bento-card flex flex-col h-[400px]">
      <div className="bento-label">Distribusi Kategori</div>
      <h3 className="text-xl font-extrabold tracking-tight mb-6">Persentase Pengeluaran</h3>
      
      {!data.length ? (
        <div className="flex-1 flex items-center justify-center text-gray-300 italic text-sm">Belum ada data</div>
      ) : (
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={85}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} className="focus:outline-none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ border: 'none', borderRadius: '16px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)', fontWeight: '700' }}
              />
              <Legend
                iconType="circle"
                verticalAlign="bottom"
                formatter={(value) => (
                  <span className="text-[10px] font-bold uppercase text-gray-500 ml-1">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
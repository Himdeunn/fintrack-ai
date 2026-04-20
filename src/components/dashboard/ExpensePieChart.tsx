'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import type { Transaction } from '@/types/database'
import { getLast6MonthsData, getExpenseByCategory } from '@/lib/utils/chartData'

const PIE_COLORS = ['#ffff00', '#00ffff', '#ff00ff', '#00ff00', '#ff3333', '#000000']

function fmtRupiah(v: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
}

function fmtShort(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `${(v / 1_000)}K`
  return v.toString()
}

export function BentoBarChart({ transactions }: { transactions: Transaction[] }) {
  const data = getLast6MonthsData(transactions)
  return (
    <div className="bento-card flex flex-col h-[400px]">
      <div className="bento-label">STATISTICS</div>
      <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter">6-Month Trend</h3>
      <div className="flex-1 min-h-0 border-4 border-black p-4 bg-gray-50">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="0" stroke="#000" vertical={false} strokeOpacity={0.1} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#000', fontWeight: 900 }}
              axisLine={{ stroke: '#000', strokeWidth: 2 }}
              tickLine={{ stroke: '#000', strokeWidth: 2 }}
            />
            <YAxis
              tickFormatter={fmtShort}
              tick={{ fontSize: 10, fill: '#000', fontWeight: 900 }}
              axisLine={{ stroke: '#000', strokeWidth: 2 }}
              tickLine={{ stroke: '#000', strokeWidth: 2 }}
              width={40}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              contentStyle={{ 
                border: '4px solid black', 
                borderRadius: '0', 
                boxShadow: '4px 4px 0px 0px black',
                fontWeight: '900',
                textTransform: 'uppercase'
              }}
            />
            <Bar dataKey="income"  fill="#00ff00" stroke="#000" strokeWidth={2} />
            <Bar dataKey="expense" fill="#ff3333" stroke="#000" strokeWidth={2} />
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
      <div className="bento-label">DISTRIBUTION</div>
      <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter">Category Split</h3>
      
      {!data.length ? (
        <div className="flex-1 flex items-center justify-center font-black uppercase text-gray-300">No Data</div>
      ) : (
        <div className="flex-1 min-h-0 border-4 border-black p-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={80}
                paddingAngle={0}
                dataKey="value"
                stroke="#000"
                strokeWidth={3}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ border: '4px solid black', borderRadius: '0', boxShadow: '4px 4px 0px 0px black', fontWeight: '900' }}
              />
              <Legend
                iconType="rect"
                formatter={(value) => (
                  <span className="text-[10px] font-black uppercase text-black ml-1">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
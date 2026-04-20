'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import type { Transaction } from '@/types/database'
import { getLast6MonthsData, getExpenseByCategory } from '@/lib/utils/chartData'

const COLORS = ['#d4ff00', '#ffffff', '#1a1a1a', '#333333', '#4d4d4d', '#666666']

function formatShort(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `${(v / 1_000)}K`
  return v.toString()
}

export function BentoBarChart({ transactions }: { transactions: Transaction[] }) {
  const data = getLast6MonthsData(transactions)
  return (
    <div className="p-10 flex flex-col h-[400px] bg-white/[0.01]">
      <span className="ev-label !mb-4">METRIC_FLOW_ANALYSIS</span>
      <h3 className="text-4xl font-black uppercase tracking-tighter italic mb-12">PULSE_CHART</h3>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={0}>
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#ffffff05" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: '#333', fontFamily: 'monospace', letterSpacing: '0.2em' }}
              axisLine={false}
              tickLine={false}
              dy={15}
            />
            <YAxis
              tickFormatter={formatShort}
              tick={{ fontSize: 9, fill: '#333', fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              width={35}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.02)' }}
              contentStyle={{ 
                background: '#000',
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '0px', 
                fontSize: '9px',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                padding: '12px'
              }}
            />
            <Bar dataKey="income"  name="IN" fill="#fff" radius={0} barSize={20} opacity={0.8} />
            <Bar dataKey="expense" name="OUT" fill="#d4ff00" radius={0} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function BentoPieChart({ transactions }: { transactions: Transaction[] }) {
  const data = getExpenseByCategory(transactions)

  return (
    <div className="p-10 flex flex-col h-[350px] bg-white/[0.01]">
      <span className="ev-label !mb-4">RESOURCE_DENSITY</span>
      <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-8">ALLOC_NODE</h3>
      
      {!data.length ? (
        <div className="flex-1 flex items-center justify-center ev-label opacity-10 uppercase tracking-[0.5em]">ZERO_DATA</div>
      ) : (
        <div className="flex-1 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={85}
                paddingAngle={0}
                dataKey="value"
                stroke="#000"
                strokeWidth={5}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: '#000', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0px', fontFamily: 'monospace', fontSize: '9px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
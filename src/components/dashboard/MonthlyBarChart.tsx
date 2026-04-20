'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import type { Transaction } from '@/types/database'
import { getLast6MonthsData } from '@/lib/utils/chartData'
import { formatRupiahShort } from '@/lib/utils/formatters'

export function MonthlyBarChart({ transactions }: { transactions: Transaction[] }) {
  const data = getLast6MonthsData(transactions)

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Tren 6 Bulan Terakhir
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tickFormatter={formatRupiahShort}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false} tickLine={false}
            width={60}
          />
          <Tooltip
            formatter={(value, name) => [
              new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value)),
              name === 'income' ? 'Pemasukan' : 'Pengeluaran',
            ]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ fontSize: 12, color: '#6b7280' }}>
                {value === 'income' ? 'Pemasukan' : 'Pengeluaran'}
              </span>
            )}
          />
          <Bar dataKey="income" fill="#4ade80" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" fill="#f87171" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
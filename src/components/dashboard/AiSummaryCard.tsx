'use client'

import { useEffect } from 'react'
import { useAiSummary } from '@/hooks/useAiSummary'
import { Sparkles } from 'lucide-react'

function renderMarkdown(text: string) {
  return text
    .split('\n')
    .filter((l) => l.trim())
    .map((line, i) => {
      // Basic formatting for **bold** text
      const parts = line.split(/\*\*(.*?)\*\*/)
      return (
        <p key={i} className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {parts.map((part, j) => (
            j % 2 === 1 ? <strong key={j} className="text-indigo-600 dark:text-indigo-400 font-bold">{part}</strong> : part
          ))}
        </p>
      )
    })
}

export function BentoAiCard({ month }: { month: string }) {
  const { summary, loading, error, fetchSummary } = useAiSummary()

  useEffect(() => {
    if (month) fetchSummary(month)
  }, [month, fetchSummary])

  return (
    <div className="bento-card h-full flex flex-col group">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="bento-label flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            AI Financial Assistant
          </div>
          <h3 className="text-xl font-extrabold tracking-tight text-black dark:text-white">Analisis Cerdas</h3>
        </div>
      </div>

      <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-3 py-10">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Menganalisis Transaksi...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">
            Gagal mendapatkan analisis: {error}
          </div>
        ) : summary ? (
          <div className="space-y-1">
            {renderMarkdown(summary)}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-300 italic text-sm">
            Pilih bulan untuk memulai analisis AI
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Gemini 1.5 Flash</span>
        <button 
          onClick={() => fetchSummary(month)}
          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider transition-colors disabled:opacity-50"
          disabled={loading || !month}
        >
          {loading ? 'Sabar ya...' : 'Analisis Ulang'}
        </button>
      </div>
    </div>
  )
}
'use client'

import { useEffect } from 'react'
import { useAiSummary } from '@/hooks/useAiSummary'

function renderMarkdown(text: string) {
  return text
    .split('\n')
    .filter((l) => l.trim())
    .map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/)
      return (
        <p key={i} className="mb-4 text-sm font-bold leading-tight uppercase">
          {parts.map((part, j) => (
            j % 2 === 1 ? <span key={j} className="bg-yellow-300 px-1 border-2 border-black">{part}</span> : part
          ))}
        </p>
      )
    })
}

export function BentoAiCard({ month }: { month: string }) {
  const { summary, loading, error, fetchSummary } = useAiSummary()

  useEffect(() => {
    if (month) fetchSummary(month)
  }, [month])

  return (
    <div className="bento-card h-full flex flex-col bg-white border-4">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="bento-label bg-magenta-500 bg-pink-500">AI Intelligence</div>
          <h3 className="text-4xl font-black uppercase tracking-tighter leading-none mt-2">Gemini Reports</h3>
        </div>
        <div className="bg-black text-white p-4 font-black text-2xl shadow-[4px_4px_0px_0px_rgba(255,255,0,1)]">
          AI
        </div>
      </div>

      <div className="flex-1 overflow-auto pr-4 border-l-4 border-black pl-4">
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="text-2xl font-black uppercase animate-pulse">Analyzing Data...</div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-500 text-white font-black border-4 border-black">
            {error}
          </div>
        ) : summary ? (
          <div className="space-y-2">
            {renderMarkdown(summary)}
          </div>
        ) : (
          <p className="font-black uppercase text-gray-300">Select Month</p>
        )}
      </div>

      <div className="mt-8 pt-6 border-t-4 border-black flex justify-between items-center">
        <span className="text-[10px] font-black uppercase">Model: Gemini 1.5 Flash</span>
        <button 
          onClick={() => fetchSummary(month)}
          className="neo-btn bg-white text-[10px] py-1 px-3"
        >
          Re-Analyze
        </button>
      </div>
    </div>
  )
}
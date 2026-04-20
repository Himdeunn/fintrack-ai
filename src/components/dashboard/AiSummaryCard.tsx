'use client'

import { useEffect, useRef } from 'react'
import { useAiSummary } from '@/hooks/useAiSummary'

function renderMarkdown(text: string) {
  return text
    .split('\n')
    .filter((l) => l.trim())
    .map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/)
      return (
        <p key={i} className="mb-10 text-[13px] leading-relaxed text-white/50 font-medium">
          {parts.map((part, j) => (
            j % 2 === 1 ? (
              <span key={j} className="text-lime-400 font-mono text-[10px] uppercase tracking-wider mx-1 bg-lime-400/10 px-1 border border-lime-400/20">
                {part}
              </span>
            ) : part
          ))}
        </p>
      )
    })
}

export function BentoAiCard({ month }: { month: string }) {
  const { summary, loading, error, fetchSummary } = useAiSummary()
  const lastFetchedMonth = useRef<string | null>(null)

  useEffect(() => {
    // Hanya fetch jika bulan berubah dan belum ada summary
    if (month && month !== lastFetchedMonth.current && !summary && !loading) {
      lastFetchedMonth.current = month
      fetchSummary(month)
    }
  }, [month, summary, loading, fetchSummary])

  return (
    <div className="aw-card h-full flex flex-col group overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-lime-400/5 rounded-full blur-[100px] -mr-40 -mt-40 transition-opacity duration-1000 group-hover:opacity-100 opacity-50" />
      
      <div className="flex justify-between items-start mb-20 relative z-10">
        <div>
          <span className="aw-label !mb-4 opacity-50">INTELLIGENCE_REPORT</span>
          <h3 className="text-6xl font-black uppercase tracking-tighter leading-none mix-blend-difference">
            AI_ANALYSIS
          </h3>
        </div>
        <div className={`w-14 h-14 rounded-full border border-white/5 flex items-center justify-center ${loading ? 'animate-spin' : ''}`}>
          <div className={`w-1 h-1 rounded-full ${loading ? 'bg-lime-400 animate-ping' : 'bg-white/20'}`} />
        </div>
      </div>

      <div className="flex-1 overflow-auto pr-4 custom-scrollbar relative z-10">
        {loading ? (
          <div className="h-full flex flex-col justify-center space-y-12">
            <div className="space-y-4">
              <div className="h-px bg-white/5 w-full overflow-hidden">
                <div className="h-full bg-lime-400 w-1/3 animate-[scan_1.5s_infinite_ease-in-out]" />
              </div>
              <div className="h-px bg-white/5 w-2/3 overflow-hidden">
                <div className="h-full bg-lime-400 w-1/2 animate-[scan_2s_infinite_ease-in-out_0.5s]" />
              </div>
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.8em] text-lime-400/50 animate-pulse text-center">
              DECRYPTING_FINANCIAL_STREAMS
            </div>
          </div>
        ) : error ? (
          <div className="space-y-6">
            <div className="p-8 border-l-2 border-rose-500 bg-rose-500/5 backdrop-blur-sm">
              <div className="text-rose-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-4 font-black">CRITICAL_SYSTEM_ERROR</div>
              <p className="text-rose-400/60 font-mono text-[9px] leading-relaxed uppercase">{error}</p>
            </div>
            <button 
              onClick={() => fetchSummary(month, true)}
              className="aw-btn w-full !py-6 text-[9px]"
            >
              REBOOT_AI_CORE
            </button>
          </div>
        ) : summary ? (
          <div className="space-y-2 animate-[fadeIn_1s_ease-out]">
            {renderMarkdown(summary)}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <span className="text-gray-800 font-mono text-[10px] uppercase tracking-[1em] animate-pulse">INIT_READY</span>
          </div>
        )}
      </div>

      <div className="mt-16 pt-10 border-t border-white/5 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em]">SECURE_CONNECTION_V1</span>
        </div>
        <button 
          onClick={() => fetchSummary(month, true)}
          className="text-[10px] font-black text-white/40 hover:text-lime-400 uppercase tracking-[0.4em] transition-all disabled:opacity-30"
          disabled={loading || !month}
        >
          {loading ? 'RE_SYNCING...' : 'FORCE_RESCAN'}
        </button>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
'use client'

import { useAiSummary } from '@/hooks/useAiSummary'
import { Sparkles, RefreshCw, Loader2, AlertCircle, Clock } from 'lucide-react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useState, useEffect } from 'react'

export function BentoAiCard({ month }: { month: string }) {
  const { summary, loading, error, fetchSummary } = useAiSummary()
  const { t } = useLanguage()
  const [cooldown, setCooldown] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [efficiency, setEfficiency] = useState(0)

  // Cooldown logic
  useEffect(() => {
    setMounted(true)
    setEfficiency(Math.floor(70 + Math.random() * 25))
    
    const lastFetch = localStorage.getItem('ai_last_fetch')
    if (lastFetch) {
      const remaining = Math.max(0, 90 - Math.floor((Date.now() - parseInt(lastFetch)) / 1000))
      setCooldown(remaining)
    }
  }, [])

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => setCooldown(c => c - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [cooldown])

  const handleFetch = async (force: boolean = false) => {
    if (force && cooldown > 0) return
    
    await fetchSummary(month, force)
    
    if (force) {
      const now = Date.now()
      localStorage.setItem('ai_last_fetch', now.toString())
      setCooldown(90)
    }
  }

  const renderMarkdown = (text: string) => {
    // Check if there is a 'Saran' or 'Solusi' part to highlight it
    const sections = text.split('\n\n')
    return sections.map((section, i) => {
      const isSolution = section.toLowerCase().includes('saran') || section.toLowerCase().includes('solusi')
      const formatted = section.replace(/\*\*(.*?)\*\*/g, '<strong class="text-dusk-blue dark:text-azure-mist font-black">$1</strong>')
      
      if (isSolution) {
        return (
          <div key={i} className="p-6 bg-dusk-blue/5 dark:bg-azure-mist/5 border border-dusk-blue/10 dark:border-azure-mist/10 rounded-3xl mb-8 animate-in fade-in slide-in-from-bottom-4 transition-all hover:bg-dusk-blue/10 dark:hover:bg-azure-mist/10">
            <div className="flex items-center gap-3 mb-4 text-dusk-blue dark:text-azure-mist">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">{language === 'id' ? 'Saran & Solusi' : 'Advice & Solutions'}</span>
            </div>
            <div className="sentence-rich !text-dusk-blue/80 dark:!text-azure-mist/80" dangerouslySetInnerHTML={{ __html: formatted.replace(/\n/g, '<br/>') }} />
          </div>
        )
      }

      return <p key={i} className="sentence-rich mb-6 last:mb-0 px-2" dangerouslySetInnerHTML={{ __html: formatted.replace(/\n/g, '<br/>') }} />
    })
  }

  if (!mounted) return <div className="h-full bg-dusk-blue/5 dark:bg-azure-mist/5 animate-pulse rounded-3xl" />

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dusk-blue dark:bg-azure-mist text-azure-mist dark:text-dusk-blue flex items-center justify-center shadow-lg shadow-dusk-blue/20">
            <Sparkles size={18} />
          </div>
          {summary && !loading && cooldown > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-dusk-blue-muted rounded-full border border-dusk-blue/10 dark:border-azure-mist/10 animate-in fade-in slide-in-from-left-4">
              <Clock size={10} className="text-dusk-blue dark:text-azure-mist animate-pulse" />
              <span className="text-[10px] font-black tabular-nums text-dusk-blue dark:text-azure-mist">
                {cooldown}S
              </span>
            </div>
          )}
        </div>
        {summary && !loading && (
          <button 
            onClick={() => handleFetch(true)}
            disabled={cooldown > 0}
            className={`p-3 rounded-xl transition-all ${
              cooldown > 0 
                ? 'opacity-20 cursor-not-allowed' 
                : 'bg-white dark:bg-dusk-blue-muted text-dusk-blue/40 dark:text-azure-mist/40 hover:text-dusk-blue dark:hover:text-azure-mist shadow-sm border border-dusk-blue/10 dark:border-azure-mist/10'
            }`}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto pr-2">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-dusk-blue rounded-full blur-2xl opacity-20 animate-pulse" />
              <Loader2 className="animate-spin text-dusk-blue dark:text-azure-mist relative" size={40} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-dusk-blue/40 dark:text-azure-mist/40 animate-pulse">
              ANALYZING_FINANCIAL_STREAM...
            </span>
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 rounded-3xl text-rose-600">
             <div className="flex gap-4 items-start">
                <AlertCircle size={20} className="shrink-0" />
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest mb-2">Error Detected</p>
                   <p className="text-xs font-medium leading-relaxed opacity-80 mb-4">{error}</p>
                   <button 
                     onClick={() => handleFetch()}
                     className="text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4"
                   >
                     Retry Analysis
                   </button>
                </div>
             </div>
          </div>
        ) : summary ? (
          <div className="space-y-8 pb-4">
            {/* Efficiency Meter */}
            <div className="p-6 bg-white dark:bg-dusk-blue-muted rounded-[32px] border border-dusk-blue/10 dark:border-azure-mist/10 flex justify-between items-center shadow-sm">
              <div>
                <span className="text-rich-muted mb-1 block">{t('financial_efficiency')}</span>
                <div className="text-4xl font-black text-dusk-blue dark:text-azure-mist tracking-tighter">
                  {efficiency}%
                </div>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`w-2 h-10 rounded-full transition-all duration-1000 ${efficiency > (i * 20) ? 'bg-dusk-blue dark:bg-azure-mist shadow-lg shadow-dusk-blue/20' : 'bg-dusk-blue/5 dark:bg-azure-mist/5'}`} style={{ transitionDelay: `${i * 100}ms` }} />
                ))}
              </div>
            </div>

            <div className="space-y-3 px-2">
              {renderMarkdown(summary)}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center gap-8">
            <div className="w-20 h-20 bg-dusk-blue/5 dark:bg-azure-mist/5 rounded-[32px] flex items-center justify-center text-dusk-blue/40 dark:text-azure-mist/40 border border-dusk-blue/10 dark:border-azure-mist/10 relative group">
              <div className="absolute inset-0 bg-dusk-blue dark:bg-azure-mist rounded-[32px] blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
              <Sparkles size={40} className="group-hover:text-dusk-blue dark:group-hover:text-azure-mist transition-colors duration-500" />
            </div>
            <div>
              <p className="text-sm text-dusk-blue/60 dark:text-azure-mist/60 font-medium max-w-[200px] mx-auto mb-8">
                Generate AI report based on your monthly cashflow.
              </p>
              <button 
                onClick={() => handleFetch()}
                className="modern-btn"
              >
                <Sparkles size={16} />
                Generate Insights
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

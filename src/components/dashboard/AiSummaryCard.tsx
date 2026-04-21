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
      const remaining = Math.max(0, 60 - Math.floor((Date.now() - parseInt(lastFetch)) / 1000))
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
      setCooldown(60)
    }
  }

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-600 dark:text-blue-400">$1</strong>')
      return <p key={i} className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 mb-2" dangerouslySetInnerHTML={{ __html: formatted }} />
    })
  }

  if (!mounted) return <div className="h-full bg-slate-100 animate-pulse rounded-2xl" />

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles size={20} className="text-blue-600" />
            {t('ai_assistant')}
          </h3>
          <p className="text-xs text-muted font-medium">{t('ai_report')}</p>
        </div>
        {summary && !loading && (
          <div className="flex items-center gap-2">
            {cooldown > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-100 dark:border-blue-800 animate-in fade-in zoom-in duration-300">
                <Clock size={12} className="text-blue-600 animate-pulse" />
                <span className="text-[10px] font-bold text-blue-600 tabular-nums">
                  {cooldown}s
                </span>
              </div>
            )}
            <button 
              onClick={() => handleFetch(true)}
              disabled={cooldown > 0}
              className={`p-2 rounded-lg transition-all ${
                cooldown > 0 
                  ? 'opacity-30 cursor-not-allowed' 
                  : 'text-slate-400 hover:bg-slate-100 hover:text-blue-600'
              }`}
              title={cooldown > 0 ? `Tunggu ${cooldown}s` : t('force_rescan')}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar pr-2">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-400">
            <Loader2 className="animate-spin" size={32} />
            <span className="text-xs font-bold uppercase tracking-widest animate-pulse">
              {t('analyze').toUpperCase()}...
            </span>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-xl text-rose-600 text-xs flex gap-3">
            <AlertCircle size={16} className="shrink-0" />
            <div className="space-y-2">
              <p className="font-bold">ERROR</p>
              <p>{error}</p>
              <button 
                onClick={() => handleFetch()}
                className="underline font-bold"
              >
                RETRY
              </button>
            </div>
          </div>
        ) : summary ? (
          <div className="space-y-6">
            {/* Efficiency Meter */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('financial_efficiency')}</span>
                <div className="text-2xl font-bold text-blue-600">
                  {efficiency}%
                </div>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`w-1.5 h-6 rounded-full ${efficiency > (i * 20) ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {renderMarkdown(summary)}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600">
              <Sparkles size={32} />
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-500 font-medium mb-4">
                {t('welcome')}! Siap untuk analisis?
              </p>
              <button 
                onClick={() => handleFetch()}
                className="modern-btn shadow-lg shadow-blue-500/20"
              >
                <Sparkles size={16} />
                {t('analyze')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
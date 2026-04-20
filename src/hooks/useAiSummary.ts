'use client'

import { useState, useCallback, useRef } from 'react'

interface AiSummaryState {
  summary: string | null
  loading: boolean
  error: string | null
  cached: boolean
}

export function useAiSummary() {
  const [state, setState] = useState<AiSummaryState>({
    summary: null,
    loading: false,
    error: null,
    cached: false,
  })

  // Gunakan ref untuk mencegah double-call yang tidak sinkron
  const isFetching = useRef(false)

  const fetchSummary = useCallback(async (month: string, force: boolean = false) => {
    if (isFetching.current) return;
    
    isFetching.current = true;
    setState(s => ({ ...s, loading: true, error: null }))
    
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, forceRefresh: force }),
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      setState({ 
        summary: data.summary, 
        loading: false, 
        error: null, 
        cached: !!data.summary 
      })
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Gagal mendapatkan ringkasan AI'
      setState({ summary: null, loading: false, error: message, cached: false })
    } finally {
      isFetching.current = false;
    }
  }, [])

  return { ...state, fetchSummary }
}
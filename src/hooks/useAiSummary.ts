'use client'

import { useState } from 'react'

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

  async function fetchSummary(month: string) {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setState({ summary: data.summary, loading: false, error: null, cached: data.cached })
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Gagal mendapatkan ringkasan AI'
      setState({ summary: null, loading: false, error: message, cached: false })
    }
  }

  return { ...state, fetchSummary }
}
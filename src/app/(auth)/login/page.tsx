'use client'

import { useState } from 'react'
import { loginUser } from '@/lib/actions/auth'
import Link from 'next/link'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Wallet, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const { language, setLanguage } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await loginUser(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-6 transition-colors text-slate-900 dark:text-white">
      {/* Lang Switcher */}
      <div className="absolute top-8 right-8 flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <button onClick={() => setLanguage('id')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${language === 'id' ? 'bg-slate-100 dark:bg-slate-800 shadow-inner' : 'text-slate-400'}`}>ID</button>
        <button onClick={() => setLanguage('en')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${language === 'en' ? 'bg-slate-100 dark:bg-slate-800 shadow-inner' : 'text-slate-400'}`}>EN</button>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center text-white shadow-xl shadow-blue-500/20 mb-6">
            <Wallet size={32} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">FinTrack.</h1>
          <p className="text-slate-500 font-medium">{language === 'id' ? 'Kelola keuangan dengan cerdas.' : 'Smart financial management.'}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{language === 'id' ? 'Email' : 'Email Address'}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="admin@fintrack.ai"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{language === 'id' ? 'Kata Sandi' : 'Password'}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-xl text-rose-600 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="modern-btn w-full py-4 shadow-lg shadow-blue-500/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : language === 'id' ? 'Masuk Sekarang' : 'Sign In'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500">
              {language === 'id' ? 'Belum punya akun?' : "Don't have an account?"}{' '}
              <Link href="/register" className="text-blue-600 font-bold hover:underline">
                {language === 'id' ? 'Daftar' : 'Register'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
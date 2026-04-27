'use client'

import { useState } from 'react'
import { registerUser } from '@/lib/actions/auth'
import Link from 'next/link'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const { language, setLanguage } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await registerUser(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-vanilla dark:bg-indigo flex flex-col justify-center items-center p-6 transition-colors text-indigo dark:text-vanilla">
      {/* Lang Switcher */}
      <div className="absolute top-8 right-8 flex bg-white/40 dark:bg-indigo-muted/40 backdrop-blur-md p-1 rounded-2xl border border-indigo/10 dark:border-vanilla/10">
        <button onClick={() => setLanguage('id')} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${language === 'id' ? 'bg-indigo text-vanilla shadow-lg dark:bg-vanilla dark:text-indigo' : 'text-indigo/40 dark:text-vanilla/40'}`}>ID</button>
        <button onClick={() => setLanguage('en')} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${language === 'en' ? 'bg-indigo text-vanilla shadow-lg dark:bg-vanilla dark:text-indigo' : 'text-indigo/40 dark:text-vanilla/40'}`}>EN</button>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center justify-center gap-3 mb-8 group">
            <img src="/image.png" alt="FinTrack AI Logo" className="w-16 h-16 rounded-2xl shadow-2xl shadow-indigo/20 group-hover:scale-110 transition-all duration-500 grayscale dark:invert" />
            <div className="text-left">
              <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">FinTrack AI</h1>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Financial Freedom</span>
            </div>
          </Link>
          <p className="text-sm font-medium opacity-60">{language === 'id' ? 'Buat akun untuk mulai mengelola.' : 'Create an account to start managing.'}</p>
        </div>

        <div className="modern-card !p-8 sm:!p-12 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-indigo/40 dark:text-vanilla/40 uppercase tracking-widest ml-1">{language === 'id' ? 'Nama Lengkap' : 'Full Name'}</label>
              <div className="relative">
                <User className="absolute left-0 top-1/2 -translate-y-1/2 text-indigo/20 dark:text-vanilla/20" size={18} />
                <input
                  name="fullName"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full bg-transparent border-b-2 border-indigo/10 dark:border-vanilla/10 rounded-none py-4 pl-10 pr-4 text-indigo dark:text-vanilla outline-none focus:border-indigo dark:focus:border-vanilla transition-all font-bold placeholder:opacity-100"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-indigo/40 dark:text-vanilla/40 uppercase tracking-widest ml-1">{language === 'id' ? 'Email' : 'Email Address'}</label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-indigo/20 dark:text-vanilla/20" size={18} />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="admin@fintrack.ai"
                  className="w-full bg-transparent border-b-2 border-indigo/10 dark:border-vanilla/10 rounded-none py-4 pl-10 pr-4 text-indigo dark:text-vanilla outline-none focus:border-indigo dark:focus:border-vanilla transition-all font-bold placeholder:opacity-100"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-indigo/40 dark:text-vanilla/40 uppercase tracking-widest ml-1">{language === 'id' ? 'Kata Sandi' : 'Password'}</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-indigo/20 dark:text-vanilla/20" size={18} />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b-2 border-indigo/10 dark:border-vanilla/10 rounded-none py-4 pl-10 pr-4 text-indigo dark:text-vanilla outline-none focus:border-indigo dark:focus:border-vanilla transition-all font-bold placeholder:opacity-100"
                />
              </div>
            </div>

            {error && (
              <div className="p-5 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 rounded-2xl text-rose-600 text-[10px] font-black uppercase tracking-widest text-center animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="modern-btn w-full py-5 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : language === 'id' ? 'Daftar Sekarang' : 'Register Now'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-indigo/5 dark:border-vanilla/5 text-center">
            <p className="text-xs font-medium opacity-60">
              {language === 'id' ? 'Sudah punya akun?' : "Already have an account?"}{' '}
              <Link href="/login" className="text-indigo dark:text-vanilla font-black hover:underline uppercase tracking-widest text-[10px] ml-2">
                {language === 'id' ? 'Masuk' : 'Login'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
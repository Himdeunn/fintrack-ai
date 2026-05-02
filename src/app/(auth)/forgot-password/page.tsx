'use client'

import { useState } from 'react'
import { forgotPassword } from '@/lib/actions/auth'
import Link from 'next/link'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Mail, ArrowRight, Loader2, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const { language } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await forgotPassword(formData, language)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-azure-mist dark:bg-dusk-blue flex flex-col justify-center items-center p-6 transition-colors text-dusk-blue dark:text-azure-mist">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-dusk-blue/40 dark:text-azure-mist/40 hover:text-dusk-blue dark:hover:text-azure-mist transition-all mb-8 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            {language === 'id' ? 'Kembali ke Masuk' : 'Back to Login'}
          </Link>
          
          <img src="/LogoNoBG.png" alt="Logo" className="w-16 h-16 rounded-2xl mx-auto mb-8 shadow-2xl shadow-dusk-blue/20 object-contain" />
          
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4">
            {language === 'id' ? 'Lupa' : 'Forgot'} <span className="opacity-40">{language === 'id' ? 'Sandi?' : 'Password?'}</span>
          </h1>
          <p className="text-sm font-medium opacity-60">
            {language === 'id' 
              ? 'Masukkan email Anda untuk menerima link atur ulang.' 
              : 'Enter your email to receive a reset link.'}
          </p>
        </div>

        <div className="modern-card !p-8 sm:!p-12 shadow-2xl">
          {success ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail size={32} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-dusk-blue dark:text-azure-mist mb-4">
                {language === 'id' ? 'Email Terkirim' : 'Email Sent'}
              </h3>
              <p className="text-sm font-bold opacity-60 uppercase tracking-widest leading-relaxed">
                {language === 'id' 
                  ? 'Silakan periksa kotak masuk (dan folder spam) Anda.' 
                  : 'Please check your inbox (and spam folder) for the link.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-dusk-blue/40 dark:text-azure-mist/40 uppercase tracking-widest ml-1">{language === 'id' ? 'Alamat Email' : 'Email Address'}</label>
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-dusk-blue/20 dark:text-azure-mist/20" size={18} />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="w-full bg-transparent border-b-2 border-dusk-blue/10 dark:border-azure-mist/10 rounded-none py-4 pl-10 pr-4 text-dusk-blue dark:text-azure-mist outline-none focus:border-dusk-blue dark:focus:border-azure-mist transition-all font-bold placeholder:opacity-100"
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
                {loading ? <Loader2 className="animate-spin" /> : language === 'id' ? 'Kirim Link' : 'Send Reset Link'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

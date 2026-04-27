'use client'

import { useState, Suspense } from 'react'
import { resetPassword } from '@/lib/actions/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

function ResetPasswordForm() {
  const { language } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!token) return
    
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.append('token', token)
    
    const result = await resetPassword(formData)

    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => router.push('/login'), 3000)
    }
  }

  if (!token) {
    return (
      <div className="text-center py-10">
        <h3 className="text-rose-500 font-black uppercase tracking-widest text-[10px]">Invalid Link</h3>
        <p className="text-sm font-bold opacity-60 mt-4 uppercase">This reset link is invalid or has expired.</p>
        <Link href="/forgot-password" className="modern-btn mt-8">Try Again</Link>
      </div>
    )
  }

  return (
    <div>
      {success ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight text-indigo dark:text-vanilla mb-4">
            {language === 'id' ? 'Sandi Berhasil Diubah' : 'Password Reset Successful'}
          </h3>
          <p className="text-sm font-bold opacity-60 uppercase tracking-widest leading-relaxed">
            {language === 'id' 
              ? 'Anda akan dialihkan ke halaman masuk...' 
              : 'You will be redirected to the login page...'}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-indigo/40 dark:text-vanilla/40 uppercase tracking-widest ml-1">
              {language === 'id' ? 'Kata Sandi Baru' : 'New Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-indigo/20 dark:text-vanilla/20" size={18} />
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-transparent border-b-2 border-indigo/10 dark:border-vanilla/10 rounded-none py-4 pl-10 pr-4 text-indigo dark:text-vanilla outline-none focus:border-indigo dark:focus:border-vanilla transition-all font-black text-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="modern-btn w-full py-5 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : language === 'id' ? 'Atur Ulang Sandi' : 'Reset Password'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-vanilla dark:bg-indigo flex flex-col justify-center items-center p-6 transition-colors text-indigo dark:text-vanilla">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <img src="/image.png" alt="Logo" className="w-16 h-16 rounded-2xl mx-auto mb-8 shadow-2xl shadow-indigo/20 object-contain" />
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4">
            {language === 'id' ? 'Reset' : 'Reset'} <span className="opacity-40">{language === 'id' ? 'Sandi' : 'Password'}</span>
          </h1>
          <p className="text-sm font-medium opacity-60">
            {language === 'id' ? 'Masukkan kata sandi baru Anda.' : 'Please enter your new password.'}
          </p>
        </div>

        <div className="modern-card !p-8 sm:!p-12 shadow-2xl">
          <Suspense fallback={<div className="text-center py-10"><Loader2 className="animate-spin mx-auto opacity-20" /></div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

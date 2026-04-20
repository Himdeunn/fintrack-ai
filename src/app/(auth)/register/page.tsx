'use client'

import { useState } from 'react'
import Link from 'next/link'
import { registerUser } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    try {
      await registerUser(data)
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftar')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8f9fa] dark:bg-[#0a0a0a]">
      <div className="bento-card max-w-md w-full shadow-2xl p-10 bg-white dark:bg-[#141414]">
        <div className="mb-10">
          <div className="bento-logo mb-6">
            <div className="bento-logo-dot" />
            fintrack.ai
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-black dark:text-white">Mulai Langkahmu</h1>
          <p className="text-gray-500 dark:text-gray-400">Bergabunglah dan mulai kelola keuanganmu dengan cerdas.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input 
              name="fullName"
              id="fullName" 
              placeholder="Tegar Arjuna"
              className="h-12 bg-gray-50 dark:bg-zinc-900 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500"
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              name="email"
              id="email" 
              type="email" 
              placeholder="kamu@email.com"
              className="h-12 bg-gray-50 dark:bg-zinc-900 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500"
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              name="password"
              id="password" 
              type="password" 
              placeholder="Min. 6 karakter"
              className="h-12 bg-gray-50 dark:bg-zinc-900 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500"
              minLength={6} 
              required 
            />
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]" disabled={loading}>
            {loading ? 'Mendaftarkan...' : 'Buat Akun Sekarang →'}
          </Button>
        </form>

        <div className="mt-10 text-center text-sm text-gray-500">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-indigo-600 font-bold hover:underline">Masuk</Link>
        </div>
      </div>
    </div>
  )
}
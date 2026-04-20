'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        if (error.message.includes('fetch')) {
          setError('Koneksi ke server gagal. Cek internet atau VPN kamu.')
        } else {
          setError('Email atau password salah')
        }
        setLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Terjadi kesalahan sistem')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-yellow-300">
      <div className="bento-card max-w-md w-full bg-white">
        <div className="mb-10 text-center">
          <div className="inline-block bg-black text-white font-black px-4 py-1 mb-4 text-sm uppercase tracking-widest">
            Identity Check
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">Log In</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label className="font-black uppercase text-xs" htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="YOUR@EMAIL.COM"
              className="h-14 border-4 border-black rounded-none font-bold placeholder:text-gray-300 focus-visible:ring-0 focus-visible:translate-x-1 focus-visible:translate-y-1 transition-transform"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label className="font-black uppercase text-xs" htmlFor="password">Security Code</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              className="h-14 border-4 border-black rounded-none font-bold placeholder:text-gray-300 focus-visible:ring-0 focus-visible:translate-x-1 focus-visible:translate-y-1 transition-transform"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          {error && (
            <div className="p-4 bg-red-500 text-white font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-xs">
              {error}
            </div>
          )}

          <Button type="submit" className="neo-btn w-full h-16 bg-cyan-300 text-xl" disabled={loading}>
            {loading ? 'WAIT...' : 'ENTER →'}
          </Button>
        </form>

        <div className="mt-10 text-center font-bold">
          NO ACCOUNT?{' '}
          <Link href="/register" className="underline decoration-4 hover:bg-yellow-300 transition-colors">SIGN UP</Link>
        </div>
      </div>
    </div>
  )
}
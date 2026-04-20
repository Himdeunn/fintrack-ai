'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      console.error('Register error:', err)
      setError(err.message || 'Terjadi kesalahan sistem')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-cyan-300">
      <div className="bento-card max-w-md w-full bg-white">
        <div className="mb-10 text-center">
          <div className="inline-block bg-black text-white font-black px-4 py-1 mb-4 text-sm uppercase tracking-widest">
            New Citizen
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">Join Us</h1>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <Label className="font-black uppercase text-xs">Your Name</Label>
            <Input 
              placeholder="FULL NAME HERE"
              className="h-14 border-4 border-black rounded-none font-bold placeholder:text-gray-300 focus-visible:ring-0 focus-visible:translate-x-1 focus-visible:translate-y-1 transition-transform"
              value={fullName} 
              onChange={e => setFullName(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label className="font-black uppercase text-xs">Email</Label>
            <Input 
              type="email" 
              placeholder="YOUR@EMAIL.COM"
              className="h-14 border-4 border-black rounded-none font-bold placeholder:text-gray-300 focus-visible:ring-0 focus-visible:translate-x-1 focus-visible:translate-y-1 transition-transform"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label className="font-black uppercase text-xs">Password</Label>
            <Input 
              type="password" 
              placeholder="MIN. 6 CHARS"
              className="h-14 border-4 border-black rounded-none font-bold placeholder:text-gray-300 focus-visible:ring-0 focus-visible:translate-x-1 focus-visible:translate-y-1 transition-transform"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              minLength={6} 
              required 
            />
          </div>
          
          {error && (
            <div className="p-4 bg-red-500 text-white font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-xs">
              {error}
            </div>
          )}

          <Button type="submit" className="neo-btn w-full h-16 bg-yellow-300 text-xl" disabled={loading}>
            {loading ? 'CREATING...' : 'SIGN UP →'}
          </Button>
        </form>

        <div className="mt-10 text-center font-bold">
          ALREADY JOINED?{' '}
          <Link href="/login" className="underline decoration-4 hover:bg-cyan-300 transition-colors">LOG IN</Link>
        </div>
      </div>
    </div>
  )
}
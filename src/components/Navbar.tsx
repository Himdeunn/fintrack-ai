'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface BentoNavbarProps {
  user: User
  currentMonth: string
}

export function BentoNavbar({ user, currentMonth }: BentoNavbarProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const initials = (user.user_metadata?.full_name as string)
    ?.split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || user.email?.[0].toUpperCase() || 'U'

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="flex justify-between items-center mb-12 border-b-4 border-black pb-6">
      <div className="flex items-center gap-10">
        <div className="text-2xl font-black uppercase tracking-tighter border-4 border-black px-4 py-1 bg-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          FINTRACK<span className="text-white">.AI</span>
        </div>
        
        <div className="hidden md:block bg-black text-white px-4 py-1 font-black uppercase text-xs tracking-widest">
          {currentMonth}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-black uppercase leading-none mb-1">{user.user_metadata?.full_name || 'User'}</p>
          <p className="text-[10px] font-bold text-gray-500 uppercase">{user.email}</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-14 h-14 bg-cyan-300 border-4 border-black font-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer"
        >
          {initials}
        </button>
      </div>
    </nav>
  )
}
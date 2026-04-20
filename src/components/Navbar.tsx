'use client'

import { logoutUser } from '@/lib/actions/auth'

interface BentoNavbarProps {
  user: { email: string; fullName?: string | null }
  currentMonth: string
}

export function BentoNavbar({ user, currentMonth }: BentoNavbarProps) {
  const initials = (user.fullName || user.email)
    ?.split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U'

  return (
    <nav className="flex justify-between items-center mb-10">
      <div className="flex items-center gap-10">
        <div className="bento-logo">
          <div className="bento-logo-dot" />
          fintrack.ai
        </div>
        
        <div className="hidden md:flex items-center gap-2 bg-white dark:bg-[#141414] px-4 py-2 rounded-full border border-black/5 dark:border-white/5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{currentMonth}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <p className="text-xs font-bold leading-none mb-1">{user.fullName || 'User'}</p>
          <p className="text-[10px] text-gray-400 font-medium">{user.email}</p>
        </div>
        
        <button
          onClick={() => logoutUser()}
          className="w-11 h-11 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-200 cursor-pointer"
          title="Klik untuk keluar"
        >
          {initials}
        </button>
      </div>
    </nav>
  )
}
'use client'

import { logoutUser } from '@/lib/actions/auth'
import type { User } from '@/types/database'
import { useEffect, useState } from 'react'

export function BentoNavbar({ user, currentMonth }: { user: User; currentMonth: string }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }))
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <nav className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-32 gap-10">
      {/* Brand Section */}
      <div className="group cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-lime-400 rounded-full flex items-center justify-center font-black text-black text-2xl shadow-[5px_5px_0px_#fff]">F</div>
          <h2 className="dr-title text-7xl group-hover:text-lime-400 transition-colors">FINTRACK.</h2>
        </div>
        <p className="dr-label !text-white/20 mt-6 tracking-[0.8em] font-bold">SYSTEM_V2.0 // SYNC_ONLINE // {time}</p>
      </div>

      {/* User Info & Actions */}
      <div className="flex flex-wrap items-center gap-12 lg:gap-24 w-full lg:w-auto">
        <div className="flex flex-col">
          <span className="dr-label text-lime-400 mb-2">OPERATOR_ID</span>
          <span className="dr-title text-3xl uppercase tracking-tighter">{user.fullName || user.email}</span>
        </div>
        
        <div className="flex flex-col border-l-2 border-white/10 pl-10">
          <span className="dr-label mb-2">ACTIVE_CYCLE</span>
          <span className="dr-title text-3xl opacity-20 uppercase tracking-tighter">{currentMonth}</span>
        </div>

        {/* Improved Logout with Form Action */}
        <form action={logoutUser}>
          <button
            type="submit"
            className="dr-btn hover:shadow-[0px_0px_50px_rgba(212,255,0,0.3)]"
          >
            LOG_OFF.
          </button>
        </form>
      </div>
    </nav>
  )
}
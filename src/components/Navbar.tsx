'use client'

import { logoutUser } from '@/lib/actions/auth'
import type { User } from '@/types/database'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'

export function BentoNavbar({ user, currentMonth }: { user: User; currentMonth: string }) {
  const { t, language, setLanguage } = useLanguage()
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }))
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <nav className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
      {/* Brand Section */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg">F</div>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">FinTrack.</h2>
          <p className="text-xs text-slate-400 font-medium">{t('system_status')}: {t('stable')} // {time}</p>
        </div>
      </div>

      {/* User Info & Actions */}
      <div className="flex flex-wrap items-center gap-8 w-full lg:w-auto">
        {/* Language Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => setLanguage('id')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${language === 'id' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-400'}`}
          >
            ID
          </button>
          <button 
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${language === 'en' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-400'}`}
          >
            EN
          </button>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('welcome')}</span>
          <span className="text-sm font-semibold">{user.fullName || user.email}</span>
        </div>
        
        <form action={logoutUser}>
          <button
            type="submit"
            className="modern-btn !py-2 !px-6 text-sm"
          >
            {t('logout')}
          </button>
        </form>
      </div>
    </nav>
  )
}
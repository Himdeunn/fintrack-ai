'use client'

import { logoutUser } from '@/lib/actions/auth'
import type { User } from '@/types/database'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Receipt, Sparkles, LogOut, Globe, Moon, Sun } from 'lucide-react'

export function MainNavbar({ user }: { user?: User | null }) {
  const { t, language, setLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/dashboard', label: language === 'id' ? 'Ringkasan' : 'Overview', icon: LayoutGrid },
    { href: '/dashboard/transactions', label: t('transactions'), icon: Receipt },
    { href: '/dashboard/analysis', label: language === 'id' ? 'Analisis' : 'Analysis', icon: Sparkles },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'py-4 glass-effect border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm' : 'py-8 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-4 group">
          <img 
            src="/image.png" 
            alt="FinTrack Logo" 
            className="w-10 h-10 rounded-xl group-hover:rotate-12 transition-transform duration-500" 
          />
          <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white hidden sm:block">FinTrack AI</h2>
        </Link>

        {/* Links (Desktop) */}
        {user && (
          <div className="hidden md:flex items-center gap-2 bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#212842] text-[#F0E7D5] shadow-lg shadow-[#212842]/20' 
                      : 'text-[#212842]/40 hover:text-[#212842] dark:text-[#F0E7D5]/40 dark:hover:text-[#F0E7D5]'
                  }`}
                >
                  <link.icon size={12} />
                  {link.label}
                </Link>
              )
            })}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Theme & Language Group */}
          <div className="flex items-center gap-2 bg-indigo/5 dark:bg-vanilla/5 p-1 rounded-2xl border border-indigo/10 dark:border-vanilla/10">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-indigo hover:text-indigo-muted dark:text-vanilla dark:hover:text-vanilla-muted transition-all rounded-xl"
            >
              {mounted && (theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />)}
            </button>
            <div className="w-px h-4 bg-indigo/10 dark:bg-vanilla/10" />
            <button 
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-indigo dark:text-vanilla hover:opacity-70 transition-all"
            >
              {language.toUpperCase()}
            </button>
          </div>

          {user && (
            <div className="flex items-center gap-4 border-l border-indigo/10 dark:border-vanilla/10 pl-6 ml-2">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[9px] font-black uppercase tracking-widest text-indigo/40 dark:text-vanilla/40 leading-none mb-1">
                  {t('welcome')}
                </span>
                <span className="text-sm font-black text-indigo dark:text-vanilla">
                  {user.fullName?.split(' ')[0] || user.email.split('@')[0]}
                </span>
              </div>
              
              <div className="group relative">
                <div className="w-10 h-10 rounded-full bg-indigo dark:bg-vanilla text-vanilla dark:text-indigo flex items-center justify-center font-black text-xs shadow-lg shadow-indigo/20 cursor-pointer">
                  {user.fullName?.[0] || user.email[0]}
                </div>
                
                {/* Simple Dropdown for Logout */}
                <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="bg-white dark:bg-indigo-muted border border-indigo/10 dark:border-vanilla/10 rounded-2xl shadow-2xl p-2 min-w-[160px]">
                    <form action={logoutUser}>
                      <button
                        type="submit"
                        className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all"
                      >
                        <LogOut size={14} />
                        {t('logout')}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!user && (
            <Link href="/login" className="modern-btn !py-2.5 !px-6 text-[9px]">
              {language === 'id' ? 'MASUK' : 'LOGIN'}
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
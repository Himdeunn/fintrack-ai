'use client'

import { logoutUser } from '@/lib/actions/auth'
import type { User } from '@/types/database'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Receipt, Sparkles, LogOut, Globe, Moon, Sun, Menu, X } from 'lucide-react'

export function MainNavbar({ user }: { user?: User | null }) {
  const { t, language, setLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[calc(100%-1.5rem)] md:w-fit md:min-w-[700px] lg:min-w-[800px] max-w-7xl px-4 py-2 rounded-[2rem] md:rounded-full border border-dusk-blue/10 dark:border-azure-mist/10 shadow-2xl backdrop-blur-2xl ${
      isScrolled ? 'bg-white/90 dark:bg-dusk-blue/90' : 'bg-white/60 dark:bg-dusk-blue/60'
    }`}>
      <div className="flex items-center justify-between gap-8 px-2 md:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <img 
            src="/LogoNoBG.png" 
            alt="Avaraé Logo" 
            className="w-8 h-8 md:w-10 md:h-10 group-hover:rotate-12 transition-transform duration-500 object-contain" 
          />
          <h2 className="text-xl md:text-2xl font-black tracking-tighter text-dusk-blue dark:text-azure-mist uppercase">Avaraé</h2>
        </Link>

        {/* Links (Desktop) */}
        {user && (
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                    isActive 
                      ? 'bg-dusk-blue text-azure-mist shadow-lg shadow-dusk-blue/20 dark:bg-azure-mist dark:text-dusk-blue' 
                      : 'text-dusk-blue/40 hover:text-dusk-blue dark:text-azure-mist/40 dark:hover:text-azure-mist'
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
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Menu Toggle */}
          {user && (
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-dusk-blue dark:text-azure-mist hover:bg-dusk-blue/5 dark:hover:bg-azure-mist/5 rounded-full transition-all"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          {/* Theme & Language Group - Compact */}
          <div className="hidden md:flex items-center gap-1 bg-dusk-blue/5 dark:bg-azure-mist/5 p-1 rounded-full border border-dusk-blue/5 dark:border-azure-mist/5">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 text-dusk-blue hover:text-dusk-blue-muted dark:text-azure-mist dark:hover:text-azure-mist-muted transition-all rounded-full"
            >
              {mounted && (theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />)}
            </button>
            <div className="w-px h-3 bg-dusk-blue/10 dark:bg-azure-mist/10" />
            <button 
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              className="px-2 py-1 text-[8px] font-black uppercase tracking-widest text-dusk-blue dark:text-azure-mist hover:opacity-70 transition-all"
            >
              {language.toUpperCase()}
            </button>
          </div>

          {user && (
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[8px] font-black uppercase tracking-widest text-dusk-blue/40 dark:text-azure-mist/40 leading-none">
                  {t('welcome')}
                </span>
                <span className="text-[10px] font-black text-dusk-blue dark:text-azure-mist">
                  {user.fullName?.split(' ')[0] || user.email.split('@')[0]}
                </span>
              </div>
              
              <div className="group relative">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-dusk-blue dark:bg-azure-mist text-azure-mist dark:text-dusk-blue flex items-center justify-center font-black text-xs shadow-lg shadow-dusk-blue/20 cursor-pointer overflow-hidden border-2 border-white/20">
                  {user.fullName?.[0] || user.email[0]}
                </div>
                
                {/* Dropdown */}
                <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="bg-white dark:bg-dusk-blue-muted border border-dusk-blue/10 dark:border-azure-mist/10 rounded-2xl shadow-2xl p-2 min-w-[180px]">
                    <Link
                      href="/dashboard/profile"
                      className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-dusk-blue dark:text-azure-mist hover:bg-dusk-blue/5 dark:hover:bg-azure-mist/5 rounded-xl transition-all mb-1"
                    >
                      <LayoutGrid size={14} className="opacity-40" />
                      {language === 'id' ? 'Profil Saya' : 'My Profile'}
                    </Link>
                    <div className="h-px bg-dusk-blue/5 dark:bg-azure-mist/5 my-1 mx-2" />
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
            <Link href="/login" className="bg-dusk-blue dark:bg-azure-mist text-azure-mist dark:text-dusk-blue px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-dusk-blue/20 hover:scale-105 active:scale-95 transition-all">
              {language === 'id' ? 'MULAI' : 'GET STARTED'}
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {user && mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 mt-4 px-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-white/95 dark:bg-dusk-blue/95 backdrop-blur-xl border border-dusk-blue/10 dark:border-azure-mist/10 rounded-[2rem] p-4 shadow-2xl space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    isActive 
                      ? 'bg-dusk-blue text-azure-mist dark:bg-azure-mist dark:text-dusk-blue' 
                      : 'text-dusk-blue/40 hover:text-dusk-blue dark:text-azure-mist/40 dark:hover:text-azure-mist'
                  }`}
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              )
            })}
            
            <div className="h-px bg-dusk-blue/10 dark:bg-azure-mist/10 my-4 mx-4" />
            
            <div className="flex items-center justify-between px-4 pb-2">
               <div className="flex items-center gap-2 bg-dusk-blue/5 dark:bg-azure-mist/5 p-1 rounded-full border border-dusk-blue/5 dark:border-azure-mist/5">
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 text-dusk-blue dark:text-azure-mist rounded-full"
                >
                  {mounted && (theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />)}
                </button>
                <div className="w-px h-4 bg-dusk-blue/10 dark:bg-azure-mist/10" />
                <button 
                  onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-dusk-blue dark:text-azure-mist"
                >
                  {language.toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

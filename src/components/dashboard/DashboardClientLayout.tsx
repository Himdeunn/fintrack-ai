'use client'

import { MainNavbar } from '@/components/MainNavbar'
import { useUser } from '@/hooks/useUser'
import Link from 'next/link'

export function DashboardClientLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser()

  if (!user) return null

  return (
    <div className="min-h-screen bg-vanilla dark:bg-indigo transition-colors selection:bg-indigo selection:text-vanilla">
      <MainNavbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-12 lg:px-20 pt-32">
        <main className="min-h-[60vh]">
          {children}
        </main>

        <footer className="mt-32 pb-20 pt-12 border-t border-indigo/10 dark:border-vanilla/10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <img src="/favicon.ico" alt="FinTrack AI Logo" className="w-8 h-8 rounded-lg grayscale dark:invert transition-all" />
              <span className="text-xs font-black uppercase tracking-widest text-indigo dark:text-vanilla">FinTrack AI</span>
            </div>
            <p className="text-[9px] font-black text-indigo/40 dark:text-vanilla/40 uppercase tracking-[0.2em]">© 2026 Build for the future of finance.</p>
          </div>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-indigo/40 dark:text-vanilla/40">
            <Link href="/terms" className="hover:text-indigo dark:hover:text-vanilla transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-indigo dark:hover:text-vanilla transition-colors">Privacy</Link>
          </div>
        </footer>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { LayoutGrid, Receipt, Sparkles } from 'lucide-react'

export function DashboardSubNav() {
  const pathname = usePathname()
  const { t, language } = useLanguage()

  const links = [
    { href: '/dashboard', label: language === 'id' ? 'Ringkasan' : 'Overview', icon: LayoutGrid },
    { href: '/dashboard/transactions', label: t('transactions'), icon: Receipt },
    { href: '/dashboard/analysis', label: language === 'id' ? 'Analisis AI' : 'AI Analysis', icon: Sparkles },
  ]

  return (
    <div className="flex bg-dusk-blue/5 dark:bg-azure-mist/5 p-1.5 rounded-[24px] border border-dusk-blue/10 dark:border-azure-mist/10 mb-12 w-full lg:w-fit overflow-x-auto scrollbar-hide">
      <div className="flex min-w-max">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-6 lg:px-8 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                isActive 
                  ? 'bg-dusk-blue text-azure-mist dark:bg-azure-mist dark:text-dusk-blue shadow-xl shadow-dusk-blue/20' 
                  : 'text-dusk-blue/40 dark:text-azure-mist/40 hover:text-dusk-blue dark:hover:text-azure-mist'
              }`}
            >
              <link.icon size={14} />
              {link.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

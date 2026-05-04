'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Download, X, Smartphone } from 'lucide-react'

export function PwaInstallPrompt() {
  const { language } = useLanguage()
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Delay 10 seconds before showing the prompt
      const timer = setTimeout(() => {
        const isDismissed = localStorage.getItem('pwa-prompt-dismissed')
        if (!isDismissed) {
          setShowPrompt(true)
        }
      }, 10000)

      return () => clearTimeout(timer)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Store dismissal in localStorage for 7 days (simplified as just a flag for now)
    localStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  if (!mounted || !showPrompt) return null

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white/80 dark:bg-dusk-blue/80 backdrop-blur-2xl border border-dusk-blue/10 dark:border-azure-mist/10 rounded-[2.5rem] p-6 shadow-2xl flex items-center gap-6">
        <div className="w-14 h-14 shrink-0 bg-dusk-blue dark:bg-azure-mist rounded-2xl flex items-center justify-center text-azure-mist dark:text-dusk-blue shadow-xl">
          <Smartphone size={28} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-dusk-blue dark:text-azure-mist mb-1">
            {language === 'id' ? 'Instal Avaraé' : 'Install Avaraé'}
          </h3>
          <p className="text-[10px] font-bold text-dusk-blue/40 dark:text-azure-mist/40 leading-relaxed">
            {language === 'id' ? 'Akses lebih cepat & lancar langsung dari layar utama Anda.' : 'Faster & smoother access directly from your home screen.'}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button 
            onClick={handleInstall}
            className="p-3 bg-dusk-blue dark:bg-azure-mist text-azure-mist dark:text-dusk-blue rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={handleDismiss}
            className="p-3 bg-dusk-blue/5 dark:bg-azure-mist/5 text-dusk-blue/40 dark:text-azure-mist/40 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

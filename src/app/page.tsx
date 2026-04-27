'use client'

import Link from 'next/link'
import { Wallet, Sparkles, Shield, BarChart3, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { MainNavbar } from '@/components/MainNavbar'
import { useUser } from '@/hooks/useUser'

export default function LandingPage() {
  const { language } = useLanguage()
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-vanilla dark:bg-indigo text-indigo dark:text-vanilla transition-colors selection:bg-indigo selection:text-vanilla">
      <MainNavbar user={user} />

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-indigo/5 dark:bg-vanilla/5 text-indigo dark:text-vanilla text-[10px] font-black uppercase tracking-widest border border-indigo/10 dark:border-vanilla/10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Sparkles size={14} />
              {language === 'id' ? 'DIDUKUNG OLEH GEMINI AI' : 'POWERED BY GEMINI AI'}
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.85]">
              {language === 'id' ? 'Kelola Keuangan ' : 'Manage Finances '}
              <span className="opacity-40 block mt-4">
                {language === 'id' ? 'Tanpa Pusing' : 'Without Worries'}
              </span>
            </h1>
            <p className="sentence-rich text-xl mb-12 max-w-2xl mx-auto opacity-70">
              {language === 'id' 
                ? 'Tracker keuangan cerdas yang membantu Anda mencatat, menganalisis, dan mengoptimalkan pengeluaran dengan bantuan kecerdasan buatan.'
                : 'Smart financial tracker that helps you record, analyze, and optimize spending with the help of artificial intelligence.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" className="modern-btn">
                {language === 'id' ? 'Mulai Gratis' : 'Start for Free'}
                <ArrowRight size={20} />
              </Link>
              <Link href="/login" className="modern-btn modern-btn-secondary">
                {language === 'id' ? 'Lihat Demo' : 'View Demo'}
              </Link>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
            {[
              { icon: BarChart3, titleId: 'Visualisasi Data', titleEn: 'Data Visualization', descId: 'Grafik interaktif untuk memantau arus kas Anda secara real-time.', descEn: 'Interactive charts to monitor your cash flow in real-time.' },
              { icon: Sparkles, titleId: 'Analisis AI', titleEn: 'AI Analysis', descId: 'Dapatkan saran hemat dan ringkasan bulanan langsung dari Gemini AI.', descEn: 'Get saving tips and monthly summaries directly from Gemini AI.' },
              { icon: Shield, titleId: 'Keamanan Data', titleEn: 'Data Security', descId: 'Data Anda dienkripsi dan disimpan dengan aman menggunakan teknologi terbaru.', descEn: 'Your data is encrypted and safely stored using the latest technology.' },
            ].map((f, i) => (
              <div key={i} className="modern-card group">
                <div className="w-14 h-14 bg-indigo/5 dark:bg-vanilla/5 rounded-2xl flex items-center justify-center text-indigo dark:text-vanilla mb-6 group-hover:bg-indigo group-hover:text-vanilla dark:group-hover:bg-vanilla dark:group-hover:text-indigo transition-all duration-500 shadow-sm border border-indigo/10 dark:border-vanilla/10">
                  <f.icon size={24} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-40">{language === 'id' ? f.titleId : f.titleEn}</h3>
                <p className="sentence-rich !text-sm leading-relaxed">{language === 'id' ? f.descId : f.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-indigo/10 dark:border-vanilla/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img src="/favicon.ico" alt="FinTrack AI Logo" className="w-10 h-10 rounded-xl grayscale dark:invert transition-all" />
            <span className="font-black uppercase tracking-widest text-xs">FinTrack AI</span>
          </div>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-indigo/40 dark:text-vanilla/40">
            <Link href="/terms" className="hover:text-indigo dark:hover:text-vanilla transition-colors">{language === 'id' ? 'Ketentuan' : 'Terms'}</Link>
            <Link href="/privacy" className="hover:text-indigo dark:hover:text-vanilla transition-colors">{language === 'id' ? 'Privasi' : 'Privacy'}</Link>
            <a href="#" className="hover:text-indigo dark:hover:text-vanilla transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { Wallet, Sparkles, Shield, BarChart3, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function LandingPage() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">F</div>
            <span className="text-xl font-bold tracking-tight">FinTrack.</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
              <button onClick={() => setLanguage('id')} className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${language === 'id' ? 'bg-white dark:bg-slate-800 shadow-sm' : 'text-slate-400'}`}>ID</button>
              <button onClick={() => setLanguage('en')} className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${language === 'en' ? 'bg-white dark:bg-slate-800 shadow-sm' : 'text-slate-400'}`}>EN</button>
            </div>
            <Link href="/login" className="text-sm font-semibold hover:text-blue-600 transition-colors">
              {language === 'id' ? 'Masuk' : 'Login'}
            </Link>
            <Link href="/register" className="modern-btn !py-2 !px-6 text-sm">
              {language === 'id' ? 'Daftar' : 'Join Now'}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Sparkles size={14} />
              {language === 'id' ? 'DIDUKUNG OLEH GEMINI AI' : 'POWERED BY GEMINI AI'}
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              {language === 'id' ? 'Kelola Keuangan ' : 'Manage Finances '}
              <span className="text-blue-600">Tanpa Pusing.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-12 leading-relaxed">
              {language === 'id' 
                ? 'Tracker keuangan cerdas yang membantu Anda mencatat, menganalisis, dan mengoptimalkan pengeluaran dengan bantuan kecerdasan buatan.'
                : 'Smart financial tracker that helps you record, analyze, and optimize spending with the help of artificial intelligence.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" className="modern-btn !py-4 !px-10 text-lg">
                {language === 'id' ? 'Mulai Gratis' : 'Start for Free'}
                <ArrowRight size={20} />
              </Link>
              <Link href="/login" className="modern-btn-secondary !py-4 !px-10 text-lg rounded-xl font-bold">
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
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <f.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-4">{language === 'id' ? f.titleId : f.titleEn}</h3>
                <p className="text-slate-500 leading-relaxed">{language === 'id' ? f.descId : f.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">F</div>
            <span className="font-bold">FinTrack.</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500 font-medium">
            <Link href="/terms" className="hover:text-blue-600 transition-colors">{language === 'id' ? 'Ketentuan' : 'Terms'}</Link>
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">{language === 'id' ? 'Privasi' : 'Privacy'}</Link>
            <a href="#" className="hover:text-blue-600 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

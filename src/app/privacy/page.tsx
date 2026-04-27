'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { ArrowLeft, Lock, Database, Sparkles, UserX } from 'lucide-react'

export default function PrivacyPage() {
  const { t, language } = useLanguage()

  const content = [
    {
      icon: Database,
      titleId: 'Pengumpulan Data',
      titleEn: 'Data Collection',
      descId: 'Kami mengumpulkan data transaksi keuangan termasuk nominal, waktu, dan kategori. Data ini penting bagi mesin sintesis neural untuk memberikan perkiraan yang akurat.',
      descEn: 'We collect financial transaction data including amounts, timestamps, and categories. This data is essential for the neural synthesis engine to provide accurate forecasting.',
    },
    {
      icon: Lock,
      titleId: 'Penyimpanan Aman',
      titleEn: 'Secure Storage',
      descId: 'Semua data disimpan menggunakan protokol enkripsi tingkat tinggi. Kami tidak menjual aliran data keuangan Anda ke pihak ketiga.',
      descEn: 'All data is stored using high-grade encryption protocols. We do not sell your financial data streams to third parties.',
    },
    {
      icon: Sparkles,
      titleId: 'Interaksi AI',
      titleEn: 'AI Interaction',
      descId: 'Metadata transaksi Anda diproses melalui Gemini AI. Interaksi ini bersifat transien dan dirancang hanya untuk menghasilkan Laporan Kecerdasan di dashboard Anda.',
      descEn: 'Your transaction metadata is processed through Gemini AI. This interaction is transient and designed solely for generating the Intelligence Report in your dashboard.',
    },
    {
      icon: UserX,
      titleId: 'Hak Penghapusan',
      titleEn: 'Right to Erasure',
      descId: 'Pengguna memiliki hak untuk menghapus seluruh aliran data keuangan mereka dari database kami kapan saja. Penghapusan akun mengakibatkan penghapusan data permanen.',
      descEn: 'Users maintain the right to purge their entire financial stream from our database at any time. Account deletion results in permanent data erasure.',
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-indigo-muted p-6 md:p-12 lg:p-20 transition-colors selection:bg-indigo selection:text-white">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <Link href="/" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo transition-all group">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
              <ArrowLeft size={14} />
            </div>
            {language === 'id' ? 'Kembali' : 'Back'}
          </Link>
        </header>

        <main>
          <div className="mb-20">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
              {language === 'id' ? 'Privasi' : 'Data'}<br/>
              <span className="text-indigo">{language === 'id' ? 'Data.' : 'Privacy.'}</span>
            </h1>
            <p className="text-lg font-medium text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              {language === 'id' 
                ? 'Kebijakan enkripsi dan perlindungan data untuk ekosistem FinTrack AI.' 
                : 'Encryption and data protection policies for the FinTrack AI ecosystem.'}
            </p>
          </div>

          <div className="grid gap-6">
            {content.map((item, idx) => (
              <section key={idx} className="group p-8 rounded-[32px] border border-slate-100 bg-white dark:bg-indigo-muted dark:border-slate-900 hover:border-indigo/20 dark:hover:border-blue-900/50 hover:shadow-2xl hover:shadow-indigo/5 transition-all duration-500">
                <div className="flex gap-8 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-indigo group-hover:text-white transition-all duration-500 shadow-sm">
                    <item.icon size={28} />
                  </div>
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-widest mb-4 text-slate-900 dark:text-white group-hover:text-indigo transition-colors">
                      {language === 'id' ? item.titleId : item.titleEn}
                    </h2>
                    <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                      {language === 'id' ? item.descId : item.descEn}
                    </p>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </main>

        <footer className="mt-32 pt-12 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em]">
            ENCRYPTION // AES_256_GCM // STATUS_SECURE
          </p>
        </footer>
      </div>
    </div>
  )
}

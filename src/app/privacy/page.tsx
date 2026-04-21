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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 lg:p-20 transition-colors">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">
            <ArrowLeft size={16} />
            {language === 'id' ? 'KEMBALI KE BERANDA' : 'BACK TO HOME'}
          </Link>
        </header>

        <main>
          <div className="mb-20">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
              {language === 'id' ? 'Privasi' : 'Data'}<br/>
              <span className="text-blue-600">{language === 'id' ? 'Data.' : 'Privacy.'}</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-xl">
              {language === 'id' 
                ? 'Kebijakan enkripsi dan perlindungan data untuk pengguna FinTrack.ai.' 
                : 'Encryption and data protection policies for FinTrack.ai users.'}
            </p>
          </div>

          <div className="grid gap-8">
            {content.map((item, idx) => (
              <section key={idx} className="modern-card group hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-500">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-4">{language === 'id' ? item.titleId : item.titleEn}</h2>
                    <p className="text-slate-500 leading-relaxed">
                      {language === 'id' ? item.descId : item.descEn}
                    </p>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </main>

        <footer className="mt-32 pt-12 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            ENCRYPTION: AES_256_GCM // STATUS: SECURE
          </p>
        </footer>
      </div>
    </div>
  )
}

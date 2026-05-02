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
    <div className="min-h-screen bg-white dark:bg-dusk-blue-muted p-6 md:p-12 lg:p-20 transition-colors selection:bg-dusk-blue selection:text-white">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <Link href="/" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-dusk-blue/40 hover:text-dusk-blue transition-all group">
            <div className="p-2 rounded-lg bg-dusk-blue/5 dark:bg-dusk-blue group-hover:bg-azure-mist dark:group-hover:bg-dusk-blue/20 transition-colors">
              <ArrowLeft size={14} />
            </div>
            {language === 'id' ? 'Kembali' : 'Back'}
          </Link>
        </header>

        <main>
          <div className="mb-20">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
              {language === 'id' ? 'Privasi' : 'Data'}<br/>
              <span className="text-dusk-blue">{language === 'id' ? 'Data.' : 'Privacy.'}</span>
            </h1>
            <p className="text-lg font-medium text-dusk-blue/60 dark:text-dusk-blue/40 max-w-xl leading-relaxed">
              {language === 'id' 
                ? 'Kebijakan enkripsi dan perlindungan data untuk ekosistem Avaraé.' 
                : 'Encryption and data protection policies for the Avaraé ecosystem.'}
            </p>
          </div>

          <div className="grid gap-6">
            {content.map((item, idx) => (
              <section key={idx} className="group p-8 rounded-[32px] border border-dusk-blue/10 bg-white dark:bg-dusk-blue-muted dark:border-dusk-blue hover:border-dusk-blue/20 dark:hover:border-dusk-blue/50 hover:shadow-2xl hover:shadow-dusk-blue/5 transition-all duration-500">
                <div className="flex gap-8 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-dusk-blue/5 dark:bg-dusk-blue flex items-center justify-center text-dusk-blue/40 shrink-0 group-hover:bg-dusk-blue group-hover:text-white transition-all duration-500 shadow-sm">
                    <item.icon size={28} />
                  </div>
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-widest mb-4 text-dusk-blue dark:text-white group-hover:text-dusk-blue transition-colors">
                      {language === 'id' ? item.titleId : item.titleEn}
                    </h2>
                    <p className="text-sm font-medium leading-relaxed text-dusk-blue/60 dark:text-dusk-blue/40">
                      {language === 'id' ? item.descId : item.descEn}
                    </p>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </main>

        <footer className="mt-32 pt-12 border-t border-dusk-blue/10 dark:border-azure-mist/10 text-center">
          <p className="text-[10px] font-black text-dusk-blue/30 dark:text-azure-mist/70 uppercase tracking-[0.3em]">
            ENCRYPTION // AES_256_GCM // STATUS_SECURE
          </p>
        </footer>
      </div>
    </div>
  )
}

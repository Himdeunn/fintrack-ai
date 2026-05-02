'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { ArrowLeft, ShieldCheck, FileText, UserCheck, Trash2 } from 'lucide-react'

export default function TermsPage() {
  const { t, language } = useLanguage()

  const content = [
    {
      icon: UserCheck,
      titleId: 'Penerimaan Layanan',
      titleEn: 'Acceptance of Service',
      descId: 'Dengan mengakses sistem Avaraé, Anda setuju untuk mematuhi protokol operasional kami. Ketentuan ini merupakan perjanjian yang mengikat antara pengguna dan arsitektur sistem.',
      descEn: 'By accessing the Avaraé system, you agree to comply with our operational protocols. These terms constitute a binding agreement between the user and the system architecture.',
    },
    {
      icon: ShieldCheck,
      titleId: 'Pemrosesan Data',
      titleEn: 'Data Processing',
      descId: 'Data transaksi Anda diproses melalui jaringan neural tingkat lanjut (Gemini AI). Dengan menggunakan sistem ini, Anda memberikan izin untuk analisis data guna menghasilkan laporan kecerdasan finansial.',
      descEn: 'Your transaction data is processed through advanced neural networks (Gemini AI). By using this system, you grant permission for data analysis to generate financial intelligence reports.',
    },
    {
      icon: FileText,
      titleId: 'Tanggung Jawab Pengguna',
      titleEn: 'User Responsibility',
      descId: 'Pengguna bertanggung jawab untuk menjaga keamanan ID akses mereka. Setiap kebocoran data yang diakibatkan oleh kelalaian kata sandi adalah tanggung jawab penuh pengguna.',
      descEn: 'Users are responsible for maintaining the security of their access IDs. Any data leakage resulting from password negligence is the sole responsibility of the user.',
    },
    {
      icon: Trash2,
      titleId: 'Pemutusan Layanan',
      titleEn: 'Termination',
      descId: 'Sistem berhak untuk memutuskan akses ke akun mana pun yang ditemukan melanggar protokol keamanan inti atau melakukan manipulasi data yang berbahaya.',
      descEn: 'The system reserves the right to terminate access to any account found to be violating core security protocols or engaging in malicious data manipulation.',
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
              {language === 'id' ? 'Ketentuan' : 'Terms of'}<br/>
              <span className="text-dusk-blue">{language === 'id' ? 'Layanan.' : 'Service.'}</span>
            </h1>
            <p className="text-lg font-medium text-dusk-blue/60 dark:text-dusk-blue/40 max-w-xl leading-relaxed">
              {language === 'id' 
                ? 'Protokol hukum standar untuk penggunaan ekosistem Avaraé.' 
                : 'Standard legal protocols for the use of the Avaraé ecosystem.'}
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
            LAST_UPDATE // 2026.04.21 // AVARAE_LEGAL
          </p>
        </footer>
      </div>
    </div>
  )
}

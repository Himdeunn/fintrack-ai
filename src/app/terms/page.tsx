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
      descId: 'Dengan mengakses sistem FinTrack.ai, Anda setuju untuk mematuhi protokol operasional kami. Ketentuan ini merupakan perjanjian yang mengikat antara pengguna dan arsitektur sistem.',
      descEn: 'By accessing the FinTrack.ai system, you agree to comply with our operational protocols. These terms constitute a binding agreement between the user and the system architecture.',
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
              {language === 'id' ? 'Ketentuan' : 'Terms of'}<br/>
              <span className="text-blue-600">{language === 'id' ? 'Layanan.' : 'Service.'}</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-xl">
              {language === 'id' 
                ? 'Protokol hukum standar untuk penggunaan sistem FinTrack.ai v2.0.' 
                : 'Standard legal protocols for the use of FinTrack.ai v2.0 system.'}
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
            LAST_UPDATE: 2026.04.21 // FINTRACK_LEGAL_DEPT
          </p>
        </footer>
      </div>
    </div>
  )
}

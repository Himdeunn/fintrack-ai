import type { Metadata } from 'next'
import { DM_Sans, DM_Mono } from 'next/font/google'
import { QueryProvider } from '@/components/providers/QueryProvider'
import './globals.css'

// Inisialisasi Font
const dmSans = DM_Sans({ 
  subsets: ['latin'], 
  variable: '--font-sans' // Menggunakan nama yang lebih deskriptif
})

const dmMono = DM_Mono({ 
  subsets: ['latin'], 
  weight: ['400', '500'], 
  variable: '--font-mono' 
})

export const metadata: Metadata = {
  title: 'Finance AI',
  description: 'Catat keuanganmu dengan cerdas',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      {/* PENTING: Masukkan variabel font ke className body 
          antialiased membantu font terlihat lebih halus
      */}
      <body className={`${dmSans.variable} ${dmMono.variable} font-sans antialiased`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
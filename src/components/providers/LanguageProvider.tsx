'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'id' | 'en'

interface Translations {
  [key: string]: {
    [lang in Language]: string
  }
}

export const translations: Translations = {
  dashboard: { id: 'Dashboard', en: 'Dashboard' },
  transactions: { id: 'Transaksi', en: 'Transactions' },
  summary: { id: 'Ringkasan', en: 'Summary' },
  income: { id: 'Pemasukan', en: 'Income' },
  expense: { id: 'Pengeluaran', en: 'Expense' },
  balance: { id: 'Saldo', en: 'Balance' },
  ai_assistant: { id: 'Asisten AI', en: 'AI Assistant' },
  analyze: { id: 'Analisis', en: 'Analyze' },
  add_transaction: { id: 'Tambah Transaksi', en: 'Add Transaction' },
  history: { id: 'Riwayat', en: 'History' },
  category: { id: 'Kategori', en: 'Category' },
  amount: { id: 'Jumlah', en: 'Amount' },
  date: { id: 'Tanggal', en: 'Date' },
  description: { id: 'Deskripsi', en: 'Description' },
  save: { id: 'Simpan', en: 'Save' },
  cancel: { id: 'Batal', en: 'Cancel' },
  logout: { id: 'Keluar', en: 'Logout' },
  welcome: { id: 'Selamat Datang', en: 'Welcome' },
  system_status: { id: 'Status Sistem', en: 'System Status' },
  stable: { id: 'Stabil', en: 'Stable' },
  financial_efficiency: { id: 'Indeks Efisiensi Keuangan', en: 'Financial Efficiency Index' },
  ai_report: { id: 'Laporan AI', en: 'AI Report' },
  force_rescan: { id: 'Pindai Ulang', en: 'Force Rescan' },
  ledger: { id: 'Buku Besar', en: 'Ledger' },
  terms: { id: 'Syarat & Ketentuan', en: 'Terms of Service' },
  privacy: { id: 'Kebijakan Privasi', en: 'Privacy Policy' },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('id')

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language
    if (saved) setLanguage(saved)
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string) => {
    return translations[key]?.[language] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}

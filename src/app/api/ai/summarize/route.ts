import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { month } = await req.json()
    const [year, m] = month.split('-')
    const start = new Date(Number(year), Number(m) - 1, 1)
    const end = new Date(Number(year), Number(m), 0, 23, 59, 59)

    // Fetch transactions using Prisma
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        date: { gte: start, lte: end }
      }
    })

    if (transactions.length === 0) {
      return NextResponse.json({ summary: "Belum ada data transaksi untuk dianalisis bulan ini. Ayo mulai mencatat!" })
    }

    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    
    // Group by category for better prompt
    const categories: Record<string, number> = {}
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount
    })

    const catSummary = Object.entries(categories)
      .map(([cat, amt]) => `${cat}: Rp${amt.toLocaleString('id-ID')}`)
      .join(', ')

    const prompt = `
      Analisis data keuangan berikut untuk bulan ${month}:
      Total Pemasukan: Rp${income.toLocaleString('id-ID')}
      Total Pengeluaran: Rp${expense.toLocaleString('id-ID')}
      Detail Pengeluaran: ${catSummary}

      Berikan ringkasan dalam 2-3 kalimat yang santai namun informatif. 
      Berikan juga 1 tips hemat yang spesifik berdasarkan data tersebut.
      Gunakan bahasa Indonesia yang akrab (Gue/Lo atau Saya/Anda).
    `

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ summary: text })
  } catch (error: any) {
    console.error('AI Summary Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
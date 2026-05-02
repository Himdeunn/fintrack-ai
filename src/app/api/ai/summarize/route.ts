import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { month, forceRefresh } = await req.json()
    if (!month) return NextResponse.json({ error: 'Month is required' }, { status: 400 })

    const userId = session.user.id

    // 1. Cek cache
    if (!forceRefresh) {
      const cached = await prisma.aiSummary.findUnique({
        where: { userId_month: { userId, month } }
      })
      if (cached) return NextResponse.json({ summary: cached.summary })
    }

    // 2. Agregasi Data (PRD 3.3 & 5)
    const startDate = new Date(`${month}-01`)
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + 1)

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: startDate, lt: endDate }
      }
    })

    if (transactions.length === 0) {
      return NextResponse.json({ summary: "Belum ada data transaksi untuk bulan ini. Mulai mencatat agar saya bisa menganalisisnya! 🚀" })
    }

    interface CategorySummary {
      [category: string]: number
    }
    interface TypeSummary {
      [type: string]: CategorySummary
    }

    const summaryData = transactions.reduce((acc, t) => {
      const type = t.type.toLowerCase() === 'income' ? 'Pemasukan' : 'Pengeluaran'
      if (!acc[type]) acc[type] = {}
      acc[type][t.category] = (acc[type][t.category] || 0) + t.amount
      return acc
    }, {} as TypeSummary)

    const dataString = Object.entries(summaryData).map(([type, cats]) => {
      const catDetails = Object.entries(cats).map(([cat, amt]) => `${cat}: ${amt}`).join(', ')
      return `${type} -> ${catDetails}`
    }).join(' | ')

    // 3. Prompt Engineering (PRD 5)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `Saya memiliki data keuangan berikut: [ ${dataString} ]. 
    Berikan ringkasan dalam 2 kalimat dan 1 tips hemat yang spesifik. 
    Gunakan nada bicara santai seperti teman tapi tetap profesional. 
    Format output harus menggunakan markdown tebal pada poin-poin penting.`

    const result = await model.generateContent(prompt)
    const aiText = result.response.text()

    // 4. Update Cache
    await prisma.aiSummary.upsert({
      where: { userId_month: { userId, month } },
      update: { summary: aiText },
      create: { userId, month, summary: aiText }
    })

    return NextResponse.json({ summary: aiText })
  } catch (error: any) {
    console.error('AI Error:', error)
    return NextResponse.json({ error: error.message || 'Gagal sinkronisasi AI' }, { status: 500 })
  }
}

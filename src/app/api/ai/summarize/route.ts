import { GoogleGenerativeAI } from '@google/generative-ai'
import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Ignored in route handlers when response is already started
            }
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { month } = await req.json()

    // Cek cache dulu — hindari panggil Gemini berulang
    const { data: cached } = await supabase
      .from('ai_summaries')
      .select('summary, created_at')
      .eq('user_id', user.id)
      .eq('month', month)
      .single()

    if (cached) {
      const age = Date.now() - new Date(cached.created_at).getTime()
      const maxAge = 1000 * 60 * 60 * 24 // 24 jam
      if (age < maxAge) {
        return NextResponse.json({ summary: cached.summary, cached: true })
      }
    }

    // Fetch transaksi bulan ini
    const [year, m] = month.split('-')
    const start = `${year}-${m}-01`
    const end = new Date(+year, +m, 0).toISOString().split('T')[0]

    const { data: transactions } = await supabase
      .from('transactions')
      .select('type, amount, category, description, date')
      .eq('user_id', user.id)
      .gte('date', start)
      .lte('date', end)

    if (!transactions?.length) {
      return NextResponse.json({
        summary: 'Belum ada transaksi bulan ini. Mulai catat pengeluaranmu!',
        cached: false,
      })
    }

    // Hitung ringkasan numerik untuk prompt
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0)
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0)

    const byCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc: Record<string, number>, t) => {
        acc[t.category] = (acc[t.category] ?? 0) + t.amount
        return acc
      }, {})

    const topCategories = Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat, amt]) => `${cat}: Rp${amt.toLocaleString('id-ID')}`)
      .join(', ')

    const prompt = `Kamu adalah asisten keuangan pribadi yang ramah dan berbicara dalam Bahasa Indonesia.

Data keuangan bulan ${month}:
- Total pemasukan: Rp${income.toLocaleString('id-ID')}
- Total pengeluaran: Rp${expense.toLocaleString('id-ID')}  
- Saldo: Rp${(income - expense).toLocaleString('id-ID')}
- Saving rate: ${income > 0 ? Math.round(((income - expense) / income) * 100) : 0}%
- Top 3 kategori pengeluaran: ${topCategories}
- Jumlah transaksi: ${transactions.length}

Berikan respons dalam format berikut (gunakan emoji yang relevan):
1. **Ringkasan** (1-2 kalimat tentang kondisi keuangan bulan ini)
2. **Sorotan** (1 hal positif dan 1 hal yang perlu diperhatikan)
3. **Saran** (2 saran praktis dan spesifik untuk bulan depan)

Gunakan bahasa yang santai, positif, dan memotivasi. Maksimal 150 kata.`

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(prompt)
    const summary = result.response.text()

    // Simpan ke cache (upsert)
    await supabase.from('ai_summaries').upsert({
      user_id: user.id,
      month,
      summary,
      created_at: new Date().toISOString(),
    }, { onConflict: 'user_id,month' })

    return NextResponse.json({ summary, cached: false })

  } catch (err) {
    console.error('AI summarize error:', err)
    return NextResponse.json(
      { error: 'Gagal mendapatkan ringkasan AI' },
      { status: 500 }
    )
  }
}
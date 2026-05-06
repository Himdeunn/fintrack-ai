import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const month = searchParams.get('month')

    let where: any = { userId: session.user.id }

    if (month) {
      const [year, m] = month.split('-')
      const start = new Date(Number(year), Number(m) - 1, 1)
      const end = new Date(Number(year), Number(m), 0, 23, 59, 59)
      where.date = { gte: start, lte: end }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' }
    })

    // Map to ensure consistency with mobile expectations if needed
    const formatted = transactions.map(t => ({
      ...t,
      type: t.type.toUpperCase(), // Standardize to UPPERCASE for mobile
      date: t.date.toISOString(),
      amount: Number(t.amount)
    }))

    return NextResponse.json(formatted)
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const data = await req.json()
    
    const transaction = await prisma.transaction.create({
      data: {
        amount: Number(data.amount),
        type: data.type.toUpperCase(), // Store as UPPERCASE for consistency
        category: data.category,
        description: data.description || '',
        date: new Date(data.date),
        userId: session.user.id,
      },
    })

    return NextResponse.json(transaction)
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

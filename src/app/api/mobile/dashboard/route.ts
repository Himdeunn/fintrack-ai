import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { getDailyData, getExpenseByCategory } from '@/lib/utils/chartData'

export async function GET(req: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = session.user.id
    
    // Get all transactions for summary calculation
    const allTransactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    })

    // Calculate Summary
    const income = allTransactions
      .filter(t => t.type.toUpperCase() === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expense = allTransactions
      .filter(t => t.type.toUpperCase() === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const balance = income - expense

    // Get Chart Data (Last 7 days)
    const dailyData = getDailyData(allTransactions as any)
    const categoryData = getExpenseByCategory(allTransactions as any)

    return NextResponse.json({
      summary: {
        balance,
        income,
        expense
      },
      charts: {
        daily: dailyData,
        categories: categoryData
      },
      recentTransactions: allTransactions.slice(0, 5)
    })
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

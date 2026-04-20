'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import type { TransactionFormData } from '@/lib/validations'

export async function createTransaction(data: TransactionFormData) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  await prisma.transaction.create({
    data: {
      amount: Number(data.amount),
      type: data.type,
      category: data.category,
      description: data.description,
      date: new Date(data.date),
      userId: session.user.id,
    },
  })

  revalidatePath('/dashboard')
}

export async function updateTransaction(id: string, data: TransactionFormData) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  await prisma.transaction.update({
    where: { id, userId: session.user.id },
    data: {
      amount: Number(data.amount),
      type: data.type,
      category: data.category,
      description: data.description,
      date: new Date(data.date),
    },
  })

  revalidatePath('/dashboard')
}

export async function deleteTransaction(id: string) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  await prisma.transaction.delete({
    where: { id, userId: session.user.id },
  })

  revalidatePath('/dashboard')
}

export async function getTransactions(month?: string) {
  const session = await getSession()
  if (!session) return []

  let where: any = { userId: session.user.id }

  if (month) {
    const [year, m] = month.split('-')
    const start = new Date(Number(year), Number(m) - 1, 1)
    const end = new Date(Number(year), Number(m), 0, 23, 59, 59)
    where.date = { gte: start, lte: end }
  }

  return await prisma.transaction.findMany({
    where,
    orderBy: { date: 'desc' },
  })
}

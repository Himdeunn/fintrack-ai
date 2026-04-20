'use server'

import { prisma } from '@/lib/prisma'
import { login, logout } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function registerUser(formData: any) {
  const { email, password, fullName } = formData

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('Email sudah terdaftar')

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName,
    },
  })

  await login({ id: user.id, email: user.email, fullName: user.fullName })
  redirect('/dashboard')
}

export async function loginUser(formData: any) {
  const { email, password } = formData

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('Email atau password salah')

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw new Error('Email atau password salah')

  await login({ id: user.id, email: user.email, fullName: user.fullName })
  redirect('/dashboard')
}

export async function logoutUser() {
  await logout()
  redirect('/login')
}

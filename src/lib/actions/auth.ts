'use server'

import { prisma } from '@/lib/prisma'
import { login, logout } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function registerUser(formData: FormData) {
  try {
    const data = Object.fromEntries(formData)
    const { email, password, fullName } = data as any

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return { error: 'Email sudah terdaftar' }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
      },
    })

    await login({ id: user.id, email: user.email, fullName: user.fullName })
  } catch (e: any) {
    return { error: e.message || 'Terjadi kesalahan' }
  }
  redirect('/dashboard')
}

export async function loginUser(formData: FormData) {
  try {
    const data = Object.fromEntries(formData)
    const { email, password } = data as any

    if (!email || !password) return { error: 'Email dan password wajib diisi' }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return { error: 'Email atau password salah' }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return { error: 'Email atau password salah' }

    await login({ id: user.id, email: user.email, fullName: user.fullName })
  } catch (e: any) {
    return { error: e.message || 'Terjadi kesalahan' }
  }
  redirect('/dashboard')
}

export async function logoutUser() {
  await logout()
  redirect('/login')
}

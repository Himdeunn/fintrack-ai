'use server'

import { prisma } from '@/lib/prisma'
import { login, logout, getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email'

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

export async function updateProfile(formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  try {
    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string

    if (!fullName || !email) return { error: 'All fields are required' }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { fullName, email }
    })

    // Update session cookie
    await login({ id: user.id, email: user.email, fullName: user.fullName })
    
    revalidatePath('/dashboard/profile')
    return { success: true }
  } catch (e: any) {
    return { error: e.message || 'Failed to update profile' }
  }
}

export async function updatePassword(formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  try {
    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string

    if (!currentPassword || !newPassword) return { error: 'All fields are required' }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) return { error: 'User not found' }

    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) return { error: 'Current password incorrect' }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    })

    return { success: true }
  } catch (e: any) {
    return { error: e.message || 'Failed to update password' }
  }
}

export async function forgotPassword(formData: FormData, language: string = 'en') {
  const email = formData.get('email') as string
  if (!email) return { error: 'Email is required' }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return { error: 'User not found' }

  const token = crypto.randomBytes(32).toString('hex')
  const expiry = new Date(Date.now() + 3600000) // 1 hour

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry
    }
  })

  const emailRes = await sendPasswordResetEmail(email, token, language)
  if (emailRes.error) return { error: emailRes.error }

  return { success: true }
}

export async function resetPassword(formData: FormData) {
  const token = formData.get('token') as string
  const password = formData.get('password') as string

  if (!token || !password) return { error: 'Token and password are required' }

  const user = await prisma.user.findUnique({
    where: { resetToken: token }
  })

  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    return { error: 'Token invalid or expired' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    }
  })

  return { success: true }
}

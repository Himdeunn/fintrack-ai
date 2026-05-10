import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days for mobile
    const token = await encrypt({ 
      user: { id: user.id, email: user.email, fullName: user.fullName }, 
      expires 
    }, '7d')

    return NextResponse.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

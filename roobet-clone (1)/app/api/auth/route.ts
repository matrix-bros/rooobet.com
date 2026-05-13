import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret')

// In-memory user store (replace with database in production)
const users: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, password, username } = body

    if (action === 'register') {
      const existingUser = users.find(u => u.email === email)
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        username: username || email.split('@')[0],
        password: hashedPassword,
        balance: 10000,
        currency: 'USD',
        createdAt: new Date().toISOString(),
      }
      users.push(user)

      const token = await new SignJWT({ userId: user.id })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(JWT_SECRET)

      return NextResponse.json({
        token,
        user: { ...user, password: undefined },
      })
    }

    if (action === 'login') {
      const user = users.find(u => u.email === email)
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const token = await new SignJWT({ userId: user.id })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(JWT_SECRET)

      return NextResponse.json({
        token,
        user: { ...user, password: undefined },
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

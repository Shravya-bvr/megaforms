import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(req: Request) {
  try {
    const text = await req.text()
    const body = JSON.parse(text)
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password min 6 characters' }, { status: 400 })
    }

    await connectDB()

    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const user = await User.create({ name, email, password })
    console.log('User created:', user._id)

    return NextResponse.json({ message: 'Account created!' }, { status: 201 })
  } catch (err: unknown) {
    console.error('Register error:', err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
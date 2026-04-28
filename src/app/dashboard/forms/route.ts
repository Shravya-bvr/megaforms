import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Form from '@/models/Form'
import User from '@/models/User'

const FORM_LIMITS: Record<string, number> = {
  free: 3, lite: 10, standard: 25, unlimited: 999999
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    if (!user) return NextResponse.json({ forms: [] })
    const forms = await Form.find({ user: user._id }).sort({ createdAt: -1 })
    return NextResponse.json({ forms })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const formCount = await Form.countDocuments({ user: user._id })
    const limit = FORM_LIMITS[user.plan] || 3
    if (formCount >= limit) {
      return NextResponse.json({ error: `Your ${user.plan} plan allows max ${limit} forms.` }, { status: 403 })
    }
    const body = await req.json()
    const form = await Form.create({ ...body, user: user._id })
    return NextResponse.json({ form }, { status: 201 })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
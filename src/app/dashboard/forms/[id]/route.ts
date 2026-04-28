import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Form from '@/models/Form'
import User from '@/models/User'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const form = await Form.findOne({ _id: params.id, user: user._id })
    if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    return NextResponse.json({ form })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const body = await req.json()
    const form = await Form.findOneAndUpdate(
      { _id: params.id, user: user._id },
      body,
      { new: true }
    )
    if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    return NextResponse.json({ form })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const form = await Form.findOneAndDelete({ _id: params.id, user: user._id })
    if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    return NextResponse.json({ message: 'Deleted' })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Response from '@/models/Response'
import Form from '@/models/Form'
import User from '@/models/User'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    if (!user) return NextResponse.json({ responses: [] })

    // Get all forms by this user
    const forms = await Form.find({ user: user._id }).select('_id title')
    const formIds = forms.map(f => f._id)
    const formMap: Record<string, string> = {}
    forms.forEach(f => { formMap[f._id.toString()] = f.title })

    // Get all responses for these forms
    const responses = await Response.find({ form: { $in: formIds } })
      .sort({ createdAt: -1 })
      .limit(100)

    const responsesWithForm = responses.map(r => ({
      ...r.toObject(),
      form: { title: formMap[r.form.toString()] || 'Unknown' }
    }))

    return NextResponse.json({ responses: responsesWithForm })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
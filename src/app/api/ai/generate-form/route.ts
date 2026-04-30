import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { description, businessType, goal } = await req.json()

    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 })
    }

    const prompt = `You are a form builder AI. Create a conversational form based on this request:

Business: ${businessType || 'General'}
Goal: ${goal || 'Lead generation'}
Description: ${description}

Generate a JSON response with exactly this structure:
{
  "title": "Form title here",
  "welcomeMessage": "Hi! 👋 Welcome message here",
  "thankYouMessage": "Thank you message here 🎉",
  "questions": [
    {
      "id": "q1",
      "type": "text",
      "question": "Question text here?",
      "placeholder": "Placeholder text",
      "required": true
    }
  ]
}

Question types allowed: text, email, phone, number, multiple_choice, rating, date, dropdown
For multiple_choice and dropdown, add "options": ["Option 1", "Option 2"]
Generate 4-7 questions that make sense for the use case.
Return ONLY the JSON, no other text.`

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'AI response error' }, { status: 500 })
    }

    const jsonText = content.text.trim()
    const formData = JSON.parse(jsonText)

    return NextResponse.json({ form: formData })
  } catch (err: unknown) {
    console.error('AI error:', err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
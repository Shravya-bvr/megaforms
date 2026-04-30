'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const BUSINESS_TYPES = [
  'Real Estate', 'Healthcare', 'Education', 'E-commerce',
  'Restaurant', 'Travel', 'Finance', 'Technology',
  'Marketing Agency', 'Fitness', 'Legal', 'Other'
]

const GOALS = [
  'Lead Generation', 'Appointment Booking', 'Customer Feedback',
  'Job Application', 'Event Registration', 'Product Order',
  'Support Ticket', 'Survey', 'Quiz', 'Contact Form'
]

const EXAMPLES = [
  "Book appointments for my dental clinic and collect patient information",
  "Generate leads for my real estate business and qualify buyers",
  "Collect job applications for a software engineer position",
  "Get customer feedback after purchase for my online store",
  "Register attendees for my marketing webinar",
  "Qualify leads for my SaaS product pricing",
]

export default function AIBuilderPage() {
  const { status } = useSession()
  const router = useRouter()

  const [description, setDescription] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [goal, setGoal] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatedForm, setGeneratedForm] = useState<{
    title: string
    welcomeMessage: string
    thankYouMessage: string
    questions: {
      id: string
      type: string
      question: string
      placeholder?: string
      required: boolean
      options?: string[]
    }[]
  } | null>(null)
  const [saving, setSaving] = useState(false)

  const generateForm = async () => {
    if (!description.trim()) {
      setError('Please describe what your form should do')
      return
    }
    setLoading(true)
    setError('')
    setGeneratedForm(null)

    try {
      const res = await fetch('/api/ai/generate-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, businessType, goal }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate')
      setGeneratedForm(data.form)
    } catch (err: unknown) {
      setError((err as Error).message)
    }
    setLoading(false)
  }

  const saveForm = async () => {
    if (!generatedForm) return
    setSaving(true)
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generatedForm.title,
          questions: generatedForm.questions,
          theme: {
            welcomeMessage: generatedForm.welcomeMessage,
          },
          thankYouMessage: generatedForm.thankYouMessage,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push(`/dashboard/forms/${data.form._id}`)
      } else {
        setError(data.error || 'Failed to save form')
      }
    } catch (err: unknown) {
      setError((err as Error).message)
    }
    setSaving(false)
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-60 bg-gray-950 flex flex-col z-40">
        <div className="p-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-sm">M</div>
            <span className="text-white font-bold text-lg">MegaForms</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: '📊', label: 'Dashboard', href: '/dashboard' },
            { icon: '✨', label: 'AI Builder', href: '/dashboard/ai-builder', active: true },
            { icon: '📥', label: 'Responses', href: '/dashboard/responses' },
            { icon: '🔗', label: 'Integrations', href: '/dashboard/integrations' },
            { icon: '⚙️', label: 'Settings', href: '/dashboard/settings' },
          ].map((item, i) => (
            <Link key={i} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main */}
      <div className="ml-60 flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">✨</span>
              <h1 className="text-3xl font-black text-gray-950">AI Form Builder</h1>
            </div>
            <p className="text-gray-400">Describe what you need and AI will build your form instantly</p>
          </div>

          {!generatedForm ? (
            <div className="space-y-6">
              {/* Business type */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  What type of business? <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {BUSINESS_TYPES.map(type => (
                    <button key={type} onClick={() => setBusinessType(businessType === type ? '' : type)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        businessType === type
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  What&apos;s the goal? <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {GOALS.map(g => (
                    <button key={g} onClick={() => setGoal(goal === g ? '' : g)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        goal === g
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Describe your form <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g. I need a form to book appointments for my dental clinic. Collect patient name, contact, preferred date, and type of treatment needed."
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all resize-none"
                />
                {/* Examples */}
                <div className="mt-3">
                  <p className="text-xs text-gray-400 mb-2">Try an example:</p>
                  <div className="space-y-1">
                    {EXAMPLES.slice(0, 3).map((ex, i) => (
                      <button key={i} onClick={() => setDescription(ex)}
                        className="block w-full text-left text-xs text-red-500 hover:text-red-600 py-1 border-b border-gray-50 last:border-0 truncate"
                      >
                        → {ex}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  ⚠️ {error}
                </div>
              )}

              <button onClick={generateForm} disabled={loading || !description.trim()}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white py-4 rounded-xl font-bold text-base transition-all hover:shadow-lg flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    AI is building your form...
                  </>
                ) : (
                  <>✨ Generate Form with AI</>
                )}
              </button>
            </div>
          ) : (
            /* Generated form preview */
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <p className="font-bold text-green-800">Form generated successfully!</p>
                  <p className="text-green-600 text-sm">Review and customise before saving</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-black text-gray-900">{generatedForm.title}</h2>
                  <span className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full font-semibold">
                    {generatedForm.questions.length} questions
                  </span>
                </div>

                {/* Welcome message */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Welcome Message</p>
                  <p className="text-sm text-gray-700">{generatedForm.welcomeMessage}</p>
                </div>

                {/* Questions */}
                <div className="space-y-3">
                  {generatedForm.questions.map((q, i) => (
                    <div key={q.id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">{q.question}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{q.type}</span>
                            {q.required && <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">Required</span>}
                          </div>
                          {q.options && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {q.options.map((opt, oi) => (
                                <span key={oi} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{opt}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Thank you */}
                <div className="bg-gray-50 rounded-xl p-4 mt-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Thank You Message</p>
                  <p className="text-sm text-gray-700">{generatedForm.thankYouMessage}</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  ⚠️ {error}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setGeneratedForm(null)}
                  className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
                >
                  ← Try Again
                </button>
                <button onClick={saveForm} disabled={saving}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white py-3 rounded-xl font-bold text-sm transition-all"
                >
                  {saving ? 'Saving...' : 'Use This Form →'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
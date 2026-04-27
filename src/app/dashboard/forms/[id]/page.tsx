'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Question {
  id: string
  type: string
  question: string
  placeholder?: string
  required: boolean
  options?: string[]
}

interface FormData {
  title: string
  questions: Question[]
  shareToken?: string
  isPublished?: boolean
}

const QUESTION_TYPES = [
  { type: 'text', label: 'Short Text', icon: '✏️' },
  { type: 'email', label: 'Email', icon: '📧' },
  { type: 'phone', label: 'Phone', icon: '📱' },
  { type: 'number', label: 'Number', icon: '🔢' },
  { type: 'multiple_choice', label: 'Multiple Choice', icon: '🔘' },
  { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { type: 'dropdown', label: 'Dropdown', icon: '📋' },
  { type: 'rating', label: 'Rating', icon: '⭐' },
  { type: 'date', label: 'Date', icon: '📅' },
  { type: 'statement', label: 'Statement', icon: '💬' },
]

export default function FormBuilderPage() {
  const params = useParams()
  const router = useRouter()
  const { status } = useSession()

  const [form, setForm] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeQ, setActiveQ] = useState<string | null>(null)
  const [tab, setTab] = useState<'build' | 'settings' | 'share'>('build')
  const [shareToken, setShareToken] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  const fetchForm = useCallback(async () => {
    try {
      const res = await fetch(`/api/forms/${params.id}`)
      const data = await res.json()
      if (data.form) {
        setForm(data.form)
        setShareToken(data.form.shareToken || '')
        setIsPublished(data.form.isPublished || false)
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }, [params.id])

  useEffect(() => {
    if (status === 'authenticated') fetchForm()
  }, [status, fetchForm])

  const saveForm = async () => {
    if (!form) return
    setSaving(true)
    try {
      await fetch(`/api/forms/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }

  const togglePublish = async () => {
    try {
      const res = await fetch(`/api/forms/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, isPublished: !isPublished }),
      })
      const data = await res.json()
      setIsPublished(data.form.isPublished)
    } catch (e) {
      console.error(e)
    }
  }

  const addQuestion = (type: string) => {
    if (!form) return
    const newQ: Question = {
      id: Date.now().toString(),
      type,
      question: type === 'statement' ? 'This is a statement' : `Your ${type} question here?`,
      placeholder: 'Type your answer...',
      required: false,
      options: ['multiple_choice', 'checkbox', 'dropdown'].includes(type)
        ? ['Option 1', 'Option 2', 'Option 3']
        : undefined,
    }
    setForm({ ...form, questions: [...form.questions, newQ] })
    setActiveQ(newQ.id)
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    if (!form) return
    setForm({
      ...form,
      questions: form.questions.map(q => q.id === id ? { ...q, ...updates } : q),
    })
  }

  const deleteQuestion = (id: string) => {
    if (!form) return
    setForm({ ...form, questions: form.questions.filter(q => q.id !== id) })
    setActiveQ(null)
  }

  const moveQuestion = (id: string, direction: 'up' | 'down') => {
    if (!form) return
    const idx = form.questions.findIndex(q => q.id === id)
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === form.questions.length - 1) return
    const newQs = [...form.questions]
    const swap = direction === 'up' ? idx - 1 : idx + 1
    const temp = newQs[idx]
    newQs[idx] = newQs[swap]
    newQs[swap] = temp
    setForm({ ...form, questions: newQs })
  }

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/f/${shareToken}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyEmbed = () => {
    const code = `<script src="${window.location.origin}/embed.js" data-form="${shareToken}"></script>`
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  if (!form) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Form not found</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-50">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
          ← Back
        </Link>
        <input
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="font-bold text-gray-900 text-lg outline-none border-b-2 border-transparent focus:border-red-400 px-1 transition-colors bg-transparent flex-1"
        />
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {(['build', 'settings', 'share'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <button onClick={saveForm} disabled={saving}
          className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${saved ? 'bg-green-500 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
        >
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save'}
        </button>
        <button onClick={togglePublish}
          className={`px-5 py-2 rounded-xl font-semibold text-sm border-2 transition-all ${isPublished ? 'border-green-500 text-green-600 bg-green-50' : 'border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600'}`}
        >
          {isPublished ? '🟢 Live' : 'Publish'}
        </button>
      </div>

      {/* BUILD TAB */}
      {tab === 'build' && (
        <div className="flex flex-1 overflow-hidden">
          {/* Left panel */}
          <div className="w-56 bg-white border-r border-gray-100 p-4 overflow-y-auto shrink-0">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Add Question</p>
            <div className="space-y-1">
              {QUESTION_TYPES.map(qt => (
                <button key={qt.type} onClick={() => addQuestion(qt.type)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all text-left"
                >
                  <span className="text-lg">{qt.icon}</span>
                  {qt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Middle */}
          <div className="flex-1 p-6 overflow-y-auto">
            {form.questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-5xl mb-4">📋</p>
                <h3 className="text-xl font-black text-gray-900 mb-2">No questions yet</h3>
                <p className="text-gray-400 text-sm">Click a question type on the left to add your first question</p>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-3">
                {form.questions.map((q, idx) => (
                  <div key={q.id} onClick={() => setActiveQ(q.id)}
                    className={`bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all ${activeQ === q.id ? 'border-red-400 shadow-lg' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-gray-300 font-bold text-sm mt-1">{idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        {activeQ === q.id ? (
                          <input value={q.question}
                            onChange={e => updateQuestion(q.id, { question: e.target.value })}
                            className="w-full font-semibold text-gray-900 outline-none border-b border-gray-200 pb-1 mb-2 bg-transparent"
                            onClick={e => e.stopPropagation()}
                          />
                        ) : (
                          <p className="font-semibold text-gray-900 mb-1">{q.question}</p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            {QUESTION_TYPES.find(t => t.type === q.type)?.icon}{' '}
                            {QUESTION_TYPES.find(t => t.type === q.type)?.label}
                          </span>
                          {q.required && (
                            <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">Required</span>
                          )}
                        </div>
                        {activeQ === q.id && q.options && (
                          <div className="mt-3 space-y-2">
                            {q.options.map((opt, oi) => (
                              <div key={oi} className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0"/>
                                <input value={opt}
                                  onChange={e => {
                                    const newOpts = [...(q.options || [])]
                                    newOpts[oi] = e.target.value
                                    updateQuestion(q.id, { options: newOpts })
                                  }}
                                  className="flex-1 text-sm outline-none border-b border-gray-200 bg-transparent"
                                  onClick={e => e.stopPropagation()}
                                />
                                <button onClick={e => {
                                  e.stopPropagation()
                                  updateQuestion(q.id, { options: q.options?.filter((_, i) => i !== oi) })
                                }} className="text-gray-300 hover:text-red-400 text-sm">✕</button>
                              </div>
                            ))}
                            <button onClick={e => {
                              e.stopPropagation()
                              updateQuestion(q.id, { options: [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`] })
                            }} className="text-xs text-red-500 hover:text-red-600 font-medium">+ Add option</button>
                          </div>
                        )}
                      </div>
                      {activeQ === q.id && (
                        <div className="flex flex-col gap-1 shrink-0">
                          <button onClick={e => { e.stopPropagation(); moveQuestion(q.id, 'up') }} className="p-1 text-gray-400 hover:text-gray-600 text-xs">▲</button>
                          <button onClick={e => { e.stopPropagation(); moveQuestion(q.id, 'down') }} className="p-1 text-gray-400 hover:text-gray-600 text-xs">▼</button>
                          <button onClick={e => { e.stopPropagation(); updateQuestion(q.id, { required: !q.required }) }}
                            className={`p-1 text-xs rounded font-bold ${q.required ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}>*</button>
                          <button onClick={e => { e.stopPropagation(); deleteQuestion(q.id) }} className="p-1 text-gray-400 hover:text-red-500 text-xs">🗑</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right preview */}
          <div className="w-72 bg-white border-l border-gray-100 p-4 overflow-y-auto shrink-0">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Live Preview</p>
            <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
              <div className="bg-gray-900 px-3 py-2 flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"/>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"/>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"/>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex gap-2 items-end">
                  <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold shrink-0">M</div>
                  <div className="bg-white rounded-2xl rounded-bl-none px-3 py-2 text-xs text-gray-700 shadow-sm border border-gray-100">
                    👋 Hi! Welcome to <strong>{form.title}</strong>
                  </div>
                </div>
                {form.questions.slice(0, 3).map((q, i) => (
                  <div key={i} className="flex gap-2 items-end">
                    <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold shrink-0">M</div>
                    <div className="bg-white rounded-2xl rounded-bl-none px-3 py-2 text-xs text-gray-700 shadow-sm border border-gray-100 max-w-xs">{q.question}</div>
                  </div>
                ))}
                {form.questions.length > 3 && (
                  <p className="text-center text-xs text-gray-400">+{form.questions.length - 3} more</p>
                )}
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <input readOnly placeholder="Type your answer..." className="flex-1 px-3 py-2 text-xs outline-none bg-white text-gray-400"/>
                  <button className="bg-red-600 text-white px-3 py-2 text-xs">→</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {tab === 'settings' && (
        <div className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h3 className="font-black text-gray-900 text-lg">Form Settings</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Form Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Thank You Message</label>
                <input placeholder="Thank you! We will get back to you soon."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notification Email</label>
                <input type="email" placeholder="your@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400"
                />
              </div>
              <button onClick={saveForm} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHARE TAB */}
      {tab === 'share' && (
        <div className="flex-1 p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {!isPublished && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex items-center gap-4">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <p className="font-bold text-yellow-800">Form not published yet</p>
                  <p className="text-yellow-600 text-sm">Publish your form first to share it</p>
                </div>
                <button onClick={togglePublish} className="bg-yellow-500 text-white px-4 py-2 rounded-xl text-sm font-bold">Publish now</button>
              </div>
            )}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-black text-gray-900 text-lg mb-1">Share as Link</h3>
              <p className="text-gray-400 text-sm mb-4">Share this URL directly with your audience</p>
              <div className="flex gap-2">
                <input readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}/f/${shareToken}`}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-600"
                />
                <button onClick={copyLink} className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold text-sm">
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-black text-gray-900 text-lg mb-1">Embed on Website</h3>
              <p className="text-gray-400 text-sm mb-4">Paste this code on your website</p>
              <div className="bg-gray-950 rounded-xl p-4 mb-3">
                <code className="text-green-400 text-xs break-all">
                  {`<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/embed.js" data-form="${shareToken}"></script>`}
                </code>
              </div>
              <button onClick={copyEmbed} className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-xl font-bold text-sm">
                {copied ? '✓ Copied!' : 'Copy Code'}
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-black text-gray-900 text-lg mb-1">Preview Form</h3>
              <p className="text-gray-400 text-sm mb-4">See how visitors will experience your form</p>
              <a href={`/f/${shareToken}`} target="_blank"
                className="inline-flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-5 py-3 rounded-xl font-bold text-sm transition-all">
                Open Preview →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface Question {
  id: string
  type: string
  question: string
  placeholder?: string
  required: boolean
  options?: string[]
}

interface Form {
  title: string
  description?: string
  questions: Question[]
  theme: {
    primaryColor: string
    welcomeMessage: string
  }
  thankYouMessage: string
}

export default function PublicFormPage() {
  const params = useParams()
  const token = params.token as string

  const [form, setForm] = useState<Form | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [currentQ, setCurrentQ] = useState(-1) // -1 = welcome screen
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [inputVal, setInputVal] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<{ type: 'bot' | 'user'; text: string }[]>([])

  useEffect(() => {
    fetch(`/api/responses/${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.form) {
          setForm(data.form)
          setMessages([{ type: 'bot', text: data.form.theme?.welcomeMessage || '👋 Hi! Ready to get started?' }])
        } else {
          setNotFound(true)
        }
        setLoading(false)
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [token])

  const startForm = () => {
    if (!form) return
    setCurrentQ(0)
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, { type: 'bot', text: form.questions[0].question }])
    }, 1000)
  }

  const handleAnswer = async () => {
    if (!form || !inputVal.trim()) return
    const question = form.questions[currentQ]

    // Add user answer to messages
    setMessages(prev => [...prev, { type: 'user', text: inputVal }])
    setAnswers(prev => ({ ...prev, [question.id]: inputVal }))
    setInputVal('')

    const nextQ = currentQ + 1

    if (nextQ >= form.questions.length) {
      // All questions answered — submit
      setIsTyping(true)
      setTimeout(async () => {
        setIsTyping(false)
        setSubmitting(true)
        try {
          const allAnswers = { ...answers, [question.id]: inputVal }
          await fetch(`/api/responses/${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              answers: form.questions.map(q => ({
                questionId: q.id,
                question: q.question,
                answer: allAnswers[q.id] || '',
              })),
              pageUrl: window.location.href,
            }),
          })
          setSubmitted(true)
        } catch {
          setSubmitted(true)
        }
        setSubmitting(false)
      }, 800)
    } else {
      // Next question
      setCurrentQ(nextQ)
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages(prev => [...prev, { type: 'bot', text: form.questions[nextQ].question }])
      }, 1000)
    }
  }

  const progress = form ? Math.round((Math.max(currentQ, 0) / form.questions.length) * 100) : 0

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
        <p className="text-gray-400 text-sm">Loading form...</p>
      </div>
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-5xl mb-4">😕</p>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Form not found</h1>
        <p className="text-gray-400 text-sm">This form doesn&apos;t exist or has been unpublished.</p>
      </div>
    </div>
  )

  if (submitted) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-6xl mb-6">🎉</p>
        <h1 className="text-3xl font-black text-gray-900 mb-3">
          {form?.thankYouMessage || 'Thank you for your response!'}
        </h1>
        <p className="text-gray-400 text-sm">We&apos;ll get back to you soon.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-sm">M</div>
          <span className="font-bold text-gray-900">{form?.title}</span>
        </div>
        <span className="text-xs text-gray-400">Powered by MegaForms</span>
      </div>

      {/* Progress bar */}
      {currentQ >= 0 && (
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-red-500 transition-all duration-700" style={{width:`${progress}%`}}/>
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-6 py-8">
        <div className="flex-1 space-y-4 mb-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'items-end'}`}>
              {msg.type === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold shrink-0">M</div>
              )}
              <div className={`px-5 py-3 rounded-2xl text-sm max-w-xs leading-relaxed ${
                msg.type === 'bot'
                  ? 'bg-white border border-gray-100 text-gray-700 rounded-bl-none shadow-sm'
                  : 'bg-red-600 text-white rounded-br-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-end">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold shrink-0">M</div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-5 py-3 shadow-sm flex gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay:'0ms'}}/>
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay:'150ms'}}/>
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay:'300ms'}}/>
              </div>
            </div>
          )}
        </div>

        {/* Welcome screen */}
        {currentQ === -1 && !isTyping && (
          <button
            onClick={startForm}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-sm transition-all hover:shadow-lg"
          >
            Start → 
          </button>
        )}

        {/* Input */}
        {currentQ >= 0 && !isTyping && !submitting && (
          <div className="flex gap-3 border-2 border-gray-200 focus-within:border-red-400 rounded-xl overflow-hidden transition-colors bg-white">
            <input
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAnswer()}
              placeholder={form?.questions[currentQ]?.placeholder || 'Type your answer...'}
              className="flex-1 px-5 py-4 text-sm outline-none bg-white text-gray-700"
              autoFocus
            />
            <button
              onClick={handleAnswer}
              disabled={!inputVal.trim()}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-200 text-white px-6 font-bold text-lg transition-colors"
            >
              →
            </button>
          </div>
        )}

        {submitting && (
          <div className="text-center py-4">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"/>
          </div>
        )}
      </div>
    </div>
  )
}
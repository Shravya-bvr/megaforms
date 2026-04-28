'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Response {
  _id: string
  visitorName?: string
  visitorEmail?: string
  answers: { questionId: string; question: string; answer: string }[]
  isRead: boolean
  createdAt: string
  form: { title: string }
}

export default function ResponsesPage() {
  const { status } = useSession()
  const router = useRouter()
  const [responses, setResponses] = useState<Response[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Response | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') fetchResponses()
  }, [status])

  const fetchResponses = async () => {
    try {
      const res = await fetch('/api/responses')
      const data = await res.json()
      setResponses(data.responses || [])
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"/>
    </div>
  )

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
            { icon: '📋', label: 'My Forms', href: '/dashboard' },
            { icon: '📥', label: 'Responses', href: '/dashboard/responses', active: true },
            { icon: '🔗', label: 'Integrations', href: '/dashboard/integrations' },
            { icon: '⚙️', label: 'Settings', href: '/dashboard/settings' },
          ].map((item, i) => (
            <Link key={i} href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
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
      <div className="ml-60 flex-1 flex">
        {/* Response list */}
        <div className="w-96 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-xl font-black text-gray-900">All Responses</h1>
            <p className="text-gray-400 text-sm mt-1">{responses.length} total responses</p>
          </div>
          {responses.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-4xl mb-3">📭</p>
              <p className="font-bold text-gray-900 mb-1">No responses yet</p>
              <p className="text-gray-400 text-sm">Responses will appear here when visitors fill your forms</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {responses.map(r => (
                <button key={r._id} onClick={() => setSelected(r)}
                  className={`w-full text-left p-5 hover:bg-gray-50 transition-colors ${selected?._id === r._id ? 'bg-red-50 border-r-2 border-red-500' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {r.visitorName || r.visitorEmail || 'Anonymous'}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">{r.form?.title || 'Unknown form'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <p className="text-gray-400 text-xs">
                        {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                      {!r.isRead && <span className="w-2 h-2 rounded-full bg-red-500"/>}
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mt-2 truncate">
                    {r.answers[0]?.answer || 'No answers'}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Response detail */}
        <div className="flex-1 p-8 overflow-y-auto">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-5xl mb-4">👈</p>
              <h3 className="text-xl font-black text-gray-900 mb-2">Select a response</h3>
              <p className="text-gray-400 text-sm">Click on a response to view the details</p>
            </div>
          ) : (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    {selected.visitorName || selected.visitorEmail || 'Anonymous'}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {selected.form?.title} · {new Date(selected.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold">Complete</span>
              </div>

              <div className="space-y-4">
                {selected.answers.map((a, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Q{i + 1}. {a.question}
                    </p>
                    <p className="text-gray-900 font-medium">{a.answer || '—'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
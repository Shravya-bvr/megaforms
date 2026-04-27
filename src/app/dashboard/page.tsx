'use client'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Form {
  _id: string
  title: string
  isPublished: boolean
  totalResponses: number
  totalViews: number
  shareToken: string
  createdAt: string
}

const PLAN_LIMITS: Record<string, number> = {
  free: 3, lite: 10, standard: 25, unlimited: Infinity
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') fetchForms()
  }, [status])

  const fetchForms = async () => {
    try {
      const res = await fetch('/api/forms')
      const data = await res.json()
      setForms(data.forms || [])
    } catch { }
    setLoading(false)
  }

  const createForm = async () => {
    if (!newTitle.trim()) return
    setCreating(true)
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          questions: [
            { id: 'q1', type: 'text', question: "What's your name?", required: true },
            { id: 'q2', type: 'email', question: "What's your email?", required: true },
          ]
        })
      })
      const data = await res.json()
      if (res.ok) {
        setForms(prev => [data.form, ...prev])
router.push(`/dashboard/forms/${data.form._id}`)
        setNewTitle('')
        setShowModal(false)
      }
    } catch { }
    setCreating(false)
  }

  const togglePublish = async (formId: string) => {
    const res = await fetch(`/api/forms/${formId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !forms.find(f => f._id === formId)?.isPublished })
    })
    if (res.ok) fetchForms()
  }

  const deleteForm = async (formId: string) => {
    if (!confirm('Delete this form? This cannot be undone.')) return
    await fetch(`/api/forms/${formId}`, { method: 'DELETE' })
    setForms(prev => prev.filter(f => f._id !== formId))
  }

  const plan = (session?.user as { plan?: string })?.plan || 'free'
  const limit = PLAN_LIMITS[plan]
  const canCreate = forms.length < limit

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
          <p className="text-gray-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
            { icon: '📊', label: 'Dashboard', active: true },
            { icon: '📋', label: 'My Forms' },
            { icon: '📥', label: 'Responses' },
            { icon: '🔗', label: 'Integrations' },
            { icon: '⚙️', label: 'Settings' },
          ].map((item, i) => (
            <button key={i}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Plan badge */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white text-xs font-bold uppercase">{plan} plan</span>
              <span className="text-gray-400 text-xs">{forms.length}/{limit === Infinity ? '∞' : limit} forms</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all"
                style={{width: `${Math.min((forms.length / (limit === Infinity ? 1 : limit)) * 100, 100)}%`}}
              />
            </div>
            {plan === 'free' && (
              <Link href="/pricing" className="block mt-3 text-center bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-lg transition-colors">
                Upgrade Plan →
              </Link>
            )}
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {session?.user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{session?.user?.name}</p>
              <p className="text-gray-500 text-xs truncate">{session?.user?.email}</p>
            </div>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="text-gray-500 hover:text-white text-xs transition-colors">
              Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-60 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-950">My Forms</h1>
            <p className="text-gray-400 text-sm mt-1">
              {forms.length} form{forms.length !== 1 ? 's' : ''} · {plan} plan
            </p>
          </div>
          <button
            onClick={() => canCreate ? setShowModal(true) : router.push('/pricing')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-red-200 flex items-center gap-2"
          >
            <span className="text-lg">+</span> New Form
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Forms', value: forms.length, icon: '📋' },
            { label: 'Published', value: forms.filter(f => f.isPublished).length, icon: '🟢' },
            { label: 'Total Responses', value: forms.reduce((a, f) => a + f.totalResponses, 0), icon: '📥' },
            { label: 'Total Views', value: forms.reduce((a, f) => a + f.totalViews, 0), icon: '👁️' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
              <p className="text-2xl mb-2">{stat.icon}</p>
              <p className="text-3xl font-black text-gray-950">{stat.value}</p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Forms list */}
        {forms.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <p className="text-5xl mb-4">📋</p>
            <h3 className="text-xl font-black text-gray-900 mb-2">No forms yet</h3>
            <p className="text-gray-400 text-sm mb-6">Create your first form and start collecting leads</p>
            <button onClick={() => setShowModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all"
            >
              Create your first form →
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {forms.map(form => (
              <div key={form._id} className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-6 hover:border-red-100 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-xl flex-shrink-0">📋</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{form.title}</h3>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(form.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-6 text-center">
                  <div>
                    <p className="font-black text-gray-900">{form.totalViews}</p>
                    <p className="text-gray-400 text-xs">Views</p>
                  </div>
                  <div>
                    <p className="font-black text-gray-900">{form.totalResponses}</p>
                    <p className="text-gray-400 text-xs">Responses</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    form.isPublished ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {form.isPublished ? '🟢 Live' : '⚪ Draft'}
                  </span>
                  <button onClick={() => togglePublish(form._id)}
                    className="px-4 py-2 border border-gray-200 hover:border-red-300 rounded-xl text-xs font-semibold text-gray-600 hover:text-red-600 transition-all"
                  >
                    {form.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  {form.isPublished && (
                    <button
                      onClick={() => navigator.clipboard.writeText(`${window.location.origin}/f/${form.shareToken}`)}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition-all"
                    >
                      Copy Link
                    </button>
                  )}
                  <button onClick={() => deleteForm(form._id)}
                    className="px-4 py-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl text-xs font-semibold transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-black text-gray-950 mb-2">Create new form</h2>
            <p className="text-gray-400 text-sm mb-6">Give your form a name to get started</p>
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createForm()}
              placeholder="e.g. Contact Us, Book a Demo, Get a Quote"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button onClick={createForm} disabled={creating || !newTitle.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white py-3 rounded-xl font-bold text-sm transition-all"
              >
                {creating ? 'Creating...' : 'Create Form →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
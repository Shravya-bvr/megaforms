'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (session?.user?.name) setName(session.user.name)
  }, [status, session, router])

  const handleSave = async () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const plan = (session?.user as { plan?: string })?.plan || 'free'

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
            { icon: '📥', label: 'Responses', href: '/dashboard/responses' },
            { icon: '🔗', label: 'Integrations', href: '/dashboard/integrations' },
            { icon: '⚙️', label: 'Settings', href: '/dashboard/settings', active: true },
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
      <div className="ml-60 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your account and preferences</p>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Profile */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-black text-gray-900 text-lg mb-5">Profile</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-black text-2xl">
                {session?.user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900">{session?.user?.name}</p>
                <p className="text-gray-400 text-sm">{session?.user?.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  readOnly
                  value={session?.user?.email || ''}
                  className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>
              <button onClick={handleSave}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                  saved ? 'bg-green-500 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {saved ? '✓ Saved!' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Plan */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-black text-gray-900 text-lg mb-5">Current Plan</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
              <div>
                <p className="font-bold text-gray-900 capitalize">{plan} Plan</p>
                <p className="text-gray-400 text-sm">
                  {plan === 'free' ? '3 forms · 100 responses/month' :
                   plan === 'lite' ? '10 forms · 1,000 responses/month' :
                   plan === 'standard' ? '25 forms · Unlimited responses' :
                   'Unlimited everything'}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                plan === 'free' ? 'bg-gray-200 text-gray-600' :
                plan === 'standard' ? 'bg-red-100 text-red-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {plan.toUpperCase()}
              </span>
            </div>
            {plan === 'free' && (
              <Link href="/pricing" className="block w-full text-center bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-sm transition-all">
                Upgrade Plan →
              </Link>
            )}
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-black text-gray-900 text-lg mb-5">Notifications</h3>
            <div className="space-y-4">
              {[
                { label: 'Email notifications for new responses', default: true },
                { label: 'Weekly summary report', default: false },
                { label: 'Product updates and news', default: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <p className="text-sm text-gray-700">{item.label}</p>
                  <button className={`w-11 h-6 rounded-full transition-colors ${item.default ? 'bg-red-600' : 'bg-gray-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${item.default ? 'translate-x-5' : 'translate-x-0'}`}/>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white rounded-2xl border border-red-100 p-6">
            <h3 className="font-black text-red-600 text-lg mb-2">Danger Zone</h3>
            <p className="text-gray-400 text-sm mb-5">These actions are irreversible. Please be careful.</p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-5 py-2.5 border-2 border-gray-200 hover:border-red-300 text-gray-600 hover:text-red-600 rounded-xl font-semibold text-sm transition-all"
              >
                Sign out
              </button>
              <button className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-semibold text-sm transition-all">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
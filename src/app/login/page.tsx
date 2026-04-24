'use client'
import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.error) setError('Invalid email or password')
    else router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gray-950 p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-sm">M</div>
          <span className="text-white font-bold text-xl">MegaForms</span>
        </Link>
        <div>
          <p className="text-white text-4xl font-black leading-tight mb-8">
            Turn website visitors into <span className="text-red-500">paying customers</span>
          </p>
          {[
            { icon: '📈', text: '3× higher conversion than static forms' },
            { icon: '⚡', text: 'AI builds your form in seconds' },
            { icon: '🔔', text: 'Get notified the moment a lead arrives' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{item.icon}</span>
              <p className="text-gray-300 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-600 text-xs">© 2025 Megamind Studio</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-sm">M</div>
              <span className="font-bold text-xl">MegaForms</span>
            </Link>
          </div>

          <h1 className="text-3xl font-black text-gray-950 mb-2">Welcome back</h1>
          <p className="text-gray-400 text-sm mb-8">Log in to your MegaForms account</p>

          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-gray-300 rounded-xl py-3.5 font-semibold text-sm text-gray-700 transition-all hover:shadow-sm mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-100"/>
            <span className="text-gray-400 text-xs">or</span>
            <div className="flex-1 h-px bg-gray-100"/>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-red-600 hover:text-red-700">Forgot password?</Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-red-200"
            >
              {loading ? 'Logging in...' : 'Log in →'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            No account?{' '}
            <Link href="/register" className="text-red-600 font-semibold hover:text-red-700">Create one free →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const integrations = [
  { icon: '📊', name: 'Salesforce', desc: 'Send leads directly to Salesforce CRM', category: 'CRM', connected: false },
  { icon: '🧡', name: 'HubSpot', desc: 'Sync contacts and deals with HubSpot', category: 'CRM', connected: false },
  { icon: '📧', name: 'Mailchimp', desc: 'Add subscribers to your Mailchimp lists', category: 'Email', connected: false },
  { icon: '💬', name: 'Slack', desc: 'Get instant Slack notifications for responses', category: 'Notifications', connected: false },
  { icon: '📋', name: 'Google Sheets', desc: 'Export responses to Google Sheets automatically', category: 'Productivity', connected: false },
  { icon: '🔧', name: 'Zapier', desc: 'Connect to 5000+ apps via Zapier', category: 'Automation', connected: false },
  { icon: '📅', name: 'Calendly', desc: 'Book meetings directly from your form', category: 'Scheduling', connected: false },
  { icon: '🔔', name: 'Webhooks', desc: 'Send data to any URL via webhooks', category: 'Developer', connected: false },
  { icon: '📩', name: 'SendGrid', desc: 'Send automated emails via SendGrid', category: 'Email', connected: false },
  { icon: '💼', name: 'Pipedrive', desc: 'Create deals in Pipedrive automatically', category: 'CRM', connected: false },
  { icon: '🎯', name: 'ActiveCampaign', desc: 'Add contacts to ActiveCampaign automations', category: 'Email', connected: false },
  { icon: '📱', name: 'WhatsApp', desc: 'Send WhatsApp notifications for new responses', category: 'Notifications', connected: false },
]

export default function IntegrationsPage() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

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
            { icon: '🔗', label: 'Integrations', href: '/dashboard/integrations', active: true },
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
      <div className="ml-60 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Integrations</h1>
          <p className="text-gray-400 text-sm mt-1">Connect MegaForms with your favourite tools</p>
        </div>

        {/* Upgrade notice */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl p-5 flex items-center gap-4 mb-8">
          <span className="text-3xl">⚡</span>
          <div className="flex-1">
            <p className="font-bold text-gray-900">Integrations require Standard plan or higher</p>
            <p className="text-gray-500 text-sm mt-0.5">Upgrade to connect your forms with hundreds of tools</p>
          </div>
          <Link href="/pricing" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shrink-0">
            Upgrade →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((int, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-start gap-4 hover:border-gray-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl shrink-0">
                {int.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-bold text-gray-900 text-sm">{int.name}</p>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full shrink-0">{int.category}</span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed mb-3">{int.desc}</p>
                <button className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
                  Connect →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Webhook section */}
        <div className="mt-8 bg-gray-950 rounded-2xl p-6">
          <h3 className="font-black text-white text-lg mb-2">🔧 Custom Webhook</h3>
          <p className="text-gray-400 text-sm mb-4">Send form responses to any URL in real time</p>
          <div className="flex gap-3">
            <input
              placeholder="https://your-webhook-url.com/endpoint"
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-red-400"
            />
            <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
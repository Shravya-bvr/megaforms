'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const plans = [
  {
    name: 'Free',
    monthly: 0,
    yearly: 0,
    color: 'border-gray-200',
    btn: 'border border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-600',
    features: [
      { text: '100 responses/month', check: true },
      { text: '3 forms', check: true },
      { text: '1 workspace', check: true },
      { text: 'Response insights', check: true },
      { text: 'Partial responses', check: false },
      { text: 'Advanced questions', check: false },
      { text: 'Logical jump', check: false },
      { text: 'Integrations', check: false },
      { text: 'Remove branding', check: false },
      { text: 'Custom domain', check: false },
    ],
  },
  {
    name: 'Lite',
    monthly: 19,
    yearly: 14,
    color: 'border-gray-200',
    btn: 'border border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-600',
    features: [
      { text: '1,000 responses/month', check: true },
      { text: '10 forms', check: true },
      { text: '1 workspace', check: true },
      { text: 'Response insights', check: true },
      { text: 'Partial responses', check: true },
      { text: 'Advanced questions', check: true },
      { text: 'Logical jump', check: true },
      { text: 'Integrations', check: false },
      { text: 'Remove branding', check: false },
      { text: 'Custom domain', check: false },
    ],
  },
  {
    name: 'Standard',
    monthly: 39,
    yearly: 29,
    recommended: true,
    color: 'border-red-500',
    btn: 'bg-red-600 hover:bg-red-700 text-white',
    features: [
      { text: 'Unlimited responses', check: true },
      { text: '25 forms', check: true },
      { text: '3 workspaces', check: true },
      { text: 'Response insights', check: true },
      { text: 'Partial responses', check: true },
      { text: 'Advanced questions', check: true },
      { text: 'Logical jump', check: true },
      { text: 'All integrations', check: true },
      { text: 'Remove branding', check: true },
      { text: 'Custom domain', check: true },
    ],
  },
  {
    name: 'Unlimited',
    monthly: 199,
    yearly: 149,
    color: 'border-gray-200',
    btn: 'border border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-600',
    features: [
      { text: 'Unlimited responses', check: true },
      { text: 'Unlimited forms', check: true },
      { text: 'Unlimited workspaces', check: true },
      { text: 'Response insights', check: true },
      { text: 'Partial responses', check: true },
      { text: 'Advanced questions', check: true },
      { text: 'Logical jump', check: true },
      { text: 'All integrations', check: true },
      { text: 'Remove branding', check: true },
      { text: 'Custom domain', check: true },
    ],
  },
]

export default function PricingPage() {
  const [yearly, setYearly] = useState(false)

  return (
    <main className="bg-white">
      <Navbar />

      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-3">Pricing</p>
        <h1 className="text-5xl font-black text-gray-950 mb-4">Simple, transparent pricing</h1>
        <p className="text-gray-400 mb-8">Start free. Upgrade when you need more. Cancel anytime.</p>

        {/* Toggle */}
        <div className="inline-flex items-center gap-3">
          <span className={`text-sm font-semibold ${!yearly ? 'text-gray-900' : 'text-gray-400'}`}>Monthly</span>
          <button
            onClick={() => setYearly(!yearly)}
            className={`relative w-14 h-7 rounded-full transition-colors ${yearly ? 'bg-red-600' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${yearly ? 'left-8' : 'left-1'}`}/>
          </button>
          <span className={`text-sm font-semibold ${yearly ? 'text-gray-900' : 'text-gray-400'}`}>
            Yearly
            <span className="ml-2 bg-green-100 text-green-600 text-xs font-bold px-2 py-0.5 rounded-full">3 months free</span>
          </span>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-5">
          {plans.map((plan, i) => (
            <div key={i} className={`relative bg-white rounded-2xl border-2 ${plan.color} p-7 flex flex-col`}>
              {plan.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  Recommended
                </div>
              )}
              <h3 className="font-black text-gray-900 text-xl mb-4">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-gray-400 text-lg">$</span>
                <span className="text-5xl font-black text-gray-950">
                  {yearly ? plan.yearly : plan.monthly}
                </span>
                <span className="text-gray-400 text-sm">/mo</span>
              </div>
              <p className="text-gray-400 text-xs mb-6">
                {yearly ? 'billed yearly' : 'billed monthly'}
              </p>

              <div className="h-px bg-gray-100 mb-6"/>

              <div className="flex-1 space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-3">
                    {f.check ? (
                      <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                        <div className="w-2.5 h-0.5 bg-gray-300 rounded"/>
                      </div>
                    )}
                    <span className={`text-sm ${f.check ? 'text-gray-700' : 'text-gray-300'}`}>{f.text}</span>
                  </div>
                ))}
              </div>

              <Link href="/register" className={`w-full text-center py-3 rounded-xl font-bold text-sm transition-all ${plan.btn}`}>
                {plan.monthly === 0 ? 'Start for free' : 'Get started'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-4xl mb-4">🛡️</p>
          <h3 className="text-2xl font-black text-gray-950 mb-3">30-day money back guarantee</h3>
          <p className="text-gray-400 text-sm">100% satisfaction or a full refund. No questions asked.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-4xl font-black text-gray-950 mb-12">Pricing questions</h2>
          <div className="border border-gray-100 rounded-2xl divide-y divide-gray-50 bg-white shadow-sm overflow-hidden">
            {[
              { q: 'What counts as a response?', a: 'A response is counted each time a visitor completes a conversation with your form. Partial sessions where the visitor leaves early are not counted on the free plan.' },
              { q: 'Can I upgrade or downgrade anytime?', a: 'Yes. Upgrade anytime and pay only the difference. Downgrade anytime — your data stays safe.' },
              { q: 'What happens if I exceed my limit?', a: 'Your form will stop collecting new responses. You can upgrade instantly to resume.' },
              { q: 'Do you offer refunds?', a: 'Yes — 30-day money-back guarantee on all paid plans. No questions asked.' },
            ].map((item, i) => (
              <details key={i} className="group px-7 py-5 cursor-pointer">
                <summary className="flex justify-between items-center font-bold text-gray-900 text-sm list-none select-none">
                  {item.q}
                  <span className="text-red-500 text-xl ml-4 shrink-0 group-open:rotate-45 transition-transform duration-200 font-light">+</span>
                </summary>
                <p className="mt-3 text-gray-500 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gray-950">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to get started?</h2>
          <p className="text-gray-400 mb-8">Join 50,000+ businesses. Free plan available.</p>
          <Link href="/register" className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-bold text-sm transition-all hover:shadow-2xl hover:shadow-red-900/50">
            Create your free form →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
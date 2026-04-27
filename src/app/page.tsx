'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        let current = 0
        const step = target / 60
        const timer = setInterval(() => {
          current += step
          if (current >= target) { setCount(target); clearInterval(timer) }
          else setCount(Math.floor(current))
        }, 25)
      }
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, mounted])

  if (!mounted) return <span>{target}{suffix}</span>
  return <span ref={ref}>{count}{suffix}</span>
}

function LiveChatDemo() {
  const [step, setStep] = useState(0)
  const [showInput, setShowInput] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [answers, setAnswers] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const questions = [
    "👋 Hi there! What's your name?",
    "Great {name}! What's your email?",
    "Perfect! What's your biggest challenge?",
    "🎉 Thanks {name}! We'll be in touch within 24 hours.",
  ]
  const placeholders = ['e.g. Priya Sharma', 'e.g. priya@company.com', 'e.g. Getting more leads']

  useEffect(() => {
    const t = setTimeout(() => setShowInput(step < questions.length - 1), 800)
    return () => clearTimeout(t)
  }, [step, questions.length])

  const handleSend = () => {
    if (!inputVal.trim()) return
    const newAnswers = [...answers, inputVal]
    setAnswers(newAnswers)
    setInputVal('')
    setShowInput(false)
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setStep(s => s + 1)
    }, 1200)
  }

  const progress = Math.round((step / (questions.length - 1)) * 100)

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-sm">
      <div className="bg-gray-900 px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"/>
          <div className="w-3 h-3 rounded-full bg-yellow-400"/>
          <div className="w-3 h-3 rounded-full bg-green-400"/>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">M</div>
          <span className="text-gray-300 text-xs font-medium">MegaForms Live Demo</span>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
        </div>
      </div>
      <div className="p-5 space-y-3 min-h-48">
        {questions.slice(0, step + 1).map((q, i) => (
          <div key={i} className="space-y-2">
            <div className="flex gap-2 items-end">
              <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold shrink-0">M</div>
              <div className="bg-gray-50 rounded-2xl rounded-bl-none px-4 py-3 text-sm text-gray-700 max-w-xs">
                {q.replace('{name}', answers[0] || 'there')}
              </div>
            </div>
            {answers[i] && (
              <div className="flex justify-end">
                <div className="bg-red-600 text-white rounded-2xl rounded-br-none px-4 py-2.5 text-sm">{answers[i]}</div>
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2 items-end">
            <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold shrink-0">M</div>
            <div className="bg-gray-50 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay:'0ms'}}/>
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay:'150ms'}}/>
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay:'300ms'}}/>
            </div>
          </div>
        )}
      </div>
      {showInput && step < questions.length - 1 && (
        <div className="px-5 pb-4">
          <div className="flex gap-2 border border-gray-200 rounded-xl overflow-hidden focus-within:border-red-400 transition-colors">
            <input value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder={placeholders[step] || ''} className="flex-1 px-4 py-3 text-sm outline-none bg-white text-gray-700" autoFocus/>
            <button onClick={handleSend} className="bg-red-600 hover:bg-red-700 text-white px-4 font-semibold text-sm transition-colors">→</button>
          </div>
        </div>
      )}
      <div className="px-5 pb-5">
        <div className="flex justify-between text-xs text-gray-400 mb-2"><span>Progress</span><span>{progress}%</span></div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-red-500 rounded-full transition-all duration-700" style={{width:`${progress}%`}}/>
        </div>
      </div>
      {step >= questions.length - 1 && (
        <div className="px-5 pb-5 text-center">
          <button onClick={() => { setStep(0); setAnswers([]); setShowInput(false); setIsTyping(false) }} className="text-xs text-gray-400 hover:text-red-500 transition-colors underline">Try again →</button>
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="bg-white overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative bg-white pt-20 pb-32 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-80 translate-x-1/4 -translate-y-1/4"/>
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50"/>
        </div>
        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-full text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/>
                Powered by Megamind Studio
              </div>
              <h1 className="text-6xl lg:text-7xl font-black text-gray-950 leading-[0.95] tracking-tight">
                Get <span className="text-red-600">3x more</span><br/>leads from<br/>your site.
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                Replace boring static forms with friendly chat conversations. Visitors love it. Your conversion rate will too.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/register" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-sm transition-all hover:shadow-2xl hover:shadow-red-200 hover:-translate-y-0.5">
                  Start for free →
                </Link>
                <Link href="/register" className="flex items-center gap-2.5 bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-bold text-sm transition-all hover:shadow-md">
                  <svg width="16" height="16" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                    <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                  </svg>
                  Continue with Google
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['bg-red-400','bg-orange-400','bg-rose-500','bg-red-700'].map((c,i) => (
                    <div key={i} className={`w-9 h-9 rounded-full ${c} border-2 border-white`}/>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">50,000+ businesses</p>
                  <p className="text-xs text-gray-400">already using MegaForms</p>
                </div>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <LiveChatDemo />
              <div className="absolute -bottom-4 -left-6 bg-white border border-gray-100 shadow-xl rounded-2xl px-4 py-3 hidden md:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-lg">📈</div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Avg. conversion lift</p>
                  <p className="text-lg font-black text-green-600">+340%</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-gray-950 text-white rounded-2xl px-4 py-3 hidden md:flex items-center gap-2 shadow-xl">
                <span className="text-base">⚡</span>
                <div>
                  <p className="text-xs text-gray-400">Response time</p>
                  <p className="text-sm font-bold">Instant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="bg-gray-950 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white text-xl font-medium leading-relaxed">
            &ldquo;We switched from Google Forms and saw a <span className="text-red-400 font-bold">40% jump in leads</span> within the first week.&rdquo;
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="w-8 h-8 rounded-full bg-red-600"/>
            <p className="text-gray-400 text-sm">Riya Menon — Head of Growth, Launchpad India</p>
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="py-12 border-b border-gray-100 overflow-hidden">
        <p className="text-center text-gray-400 text-sm mb-8 px-6">Trusted by <strong className="text-gray-600">50,000+</strong> businesses worldwide</p>
        <div className="flex gap-16 animate-marquee w-max px-8">
          {['Airbnb','Yelp','GOV.UK','Salesforce','HubSpot','Mailchimp','Shopify','Notion','Stripe','Figma',
            'Airbnb','Yelp','GOV.UK','Salesforce','HubSpot','Mailchimp','Shopify','Notion','Stripe','Figma'].map((name, i) => (
            <span key={i} className="text-gray-200 font-black text-2xl whitespace-nowrap">{name}</span>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-3">Why it works</p>
          <h2 className="text-5xl font-black text-gray-950 mb-16">Built for <span className="text-red-600">conversion</span></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {icon:'🕐',title:'Always On',desc:'Captures leads 24x7, even when your team is offline.'},
              {icon:'📈',title:'3x Conversions',desc:'Visitors respond to chat. See 3x higher completion rates.'},
              {icon:'✨',title:'Delights Visitors',desc:'A personalised experience — automated and consistent.'},
              {icon:'💰',title:'Cuts Costs',desc:'One form replaces hours of manual follow-up.'},
            ].map((card,i) => (
              <div key={i} className="group bg-white p-7 rounded-2xl border border-gray-100 hover:border-red-200 hover:shadow-xl transition-all duration-300 cursor-default hover:-translate-y-1">
                <div className="text-4xl mb-5">{card.icon}</div>
                <h3 className="font-black text-gray-900 text-lg mb-2 group-hover:text-red-600 transition-colors">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-28 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-3">The numbers</p>
          <h2 className="text-5xl font-black text-white mb-14">Results that <span className="text-red-500">speak</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {target:50,suffix:'%',label:'Less sales spend'},
              {target:50,suffix:'M+',label:'Responses collected'},
              {target:3,suffix:'x',label:'Avg conversion lift'},
              {target:50000,suffix:'+',label:'Businesses using it'},
            ].map((s,i) => (
              <div key={i} className="border border-white/10 hover:border-red-500/50 rounded-2xl p-8 text-center transition-all group hover:bg-white/5">
                <p className="text-5xl font-black text-white mb-2 group-hover:text-red-400 transition-colors">
                  <Counter target={s.target} suffix={s.suffix}/>
                </p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-3">The process</p>
          <h2 className="text-5xl font-black text-gray-950 mb-16">Live in <span className="text-red-600">3 steps</span></h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {num:'01',icon:'🤖',title:'Build with AI',desc:'Describe your goal. AI builds your form instantly.'},
              {num:'02',icon:'📋',title:'One-line install',desc:'Paste a snippet on your site or share a link.'},
              {num:'03',icon:'🔔',title:'Watch leads arrive',desc:'Get notified via email, Slack, or your CRM.'},
            ].map((step,i) => (
              <div key={i} className="group bg-white border border-gray-100 hover:border-red-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
                <p className="text-8xl font-black text-gray-50 group-hover:text-red-50 leading-none mb-4">{step.num}</p>
                <span className="text-3xl mb-4 block">{step.icon}</span>
                <h3 className="font-black text-gray-900 text-xl mb-2 group-hover:text-red-600 transition-colors">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-3">Real stories</p>
          <h2 className="text-5xl font-black text-gray-950 mb-14">Loved by teams <span className="text-red-600">worldwide</span></h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {name:'Aditya Nair',role:'Co-founder, GrowStack',color:'from-red-500 to-orange-500',text:'Demo requests went up 60% in two weeks. The conversational flow feels genuinely human.'},
              {name:'Fatima Al-Rashidi',role:'Head of Marketing, NovaBrand',color:'from-red-600 to-red-800',text:'Our recruitment bot brings in 90% of job applications. Setup took under 30 minutes.'},
              {name:'James Whitmore',role:'Product Lead, Cruxly',color:'from-rose-500 to-red-600',text:'Survey completion jumped from 34% to 71% after switching. Nearly double the data.'},
              {name:'Sneha Kulkarni',role:'Founder, EdifyAI',color:'from-red-400 to-rose-600',text:'Built a student onboarding form in 10 minutes with AI. Students actually enjoy filling it.'},
              {name:'Carlos Rivera',role:'CTO, Yatratech',color:'from-red-700 to-red-500',text:'Conversions tripled. Customer acquisition cost dropped. MegaForms pays for itself.'},
              {name:'Priya Ramesh',role:'Growth Manager, Launchpad',color:'from-rose-400 to-red-500',text:'Monthly subscriptions grew 30% after embedding the widget on our pricing page.'},
            ].map((t,i) => (
              <div key={i} className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-xl transition-all flex flex-col gap-5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_,j) => <svg key={j} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} shrink-0`}/>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-5xl font-black text-gray-950 mb-12">Common questions</h2>
          <div className="border border-gray-100 bg-white rounded-2xl divide-y divide-gray-50 overflow-hidden shadow-sm">
            {[
              {q:'What is MegaForms?',a:'MegaForms replaces static forms with friendly one-question-at-a-time conversations. Visitors answer naturally, giving you cleaner data with higher completion rates.'},
              {q:'Is there a free plan?',a:'Yes — forever free. 3 forms, 100 responses/month. No credit card needed.'},
              {q:'Do I need coding skills?',a:'Zero coding needed. Build with AI in seconds, or drag-and-drop manually.'},
              {q:'Which tools does it connect with?',a:'Salesforce, HubSpot, Mailchimp, Slack, Google Sheets, Zapier, webhooks and 100+ more.'},
              {q:'Will it affect my site speed?',a:'No. MegaForms loads asynchronously. Zero impact on Core Web Vitals.'},
            ].map((item,i) => (
              <details key={i} className="group px-7 py-6 cursor-pointer">
                <summary className="flex justify-between items-center font-bold text-gray-900 text-sm list-none select-none">
                  {item.q}
                  <span className="text-red-500 text-xl ml-4 shrink-0 group-open:rotate-45 transition-transform duration-200 font-light">+</span>
                </summary>
                <p className="mt-4 text-gray-500 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 bg-gray-950">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-6xl mb-6">🚀</p>
          <h2 className="text-5xl font-black text-white mb-4">Start collecting leads <span className="text-red-500">today</span></h2>
          <p className="text-gray-400 mb-10">Join 50,000+ businesses using MegaForms — for free.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/register" className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-bold text-sm transition-all hover:shadow-2xl hover:-translate-y-0.5">
              Create your free form →
            </Link>
            <Link href="/pricing" className="border border-white/20 hover:border-white/40 text-white px-10 py-4 rounded-xl font-bold text-sm transition-all hover:bg-white/5">
              See pricing
            </Link>
          </div>
          <p className="text-gray-600 text-xs mt-8">Free plan · No credit card · Cancel anytime</p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
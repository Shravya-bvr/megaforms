'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const templates = [
  { icon: '🎯', title: 'Lead Generation', category: 'Marketing', desc: 'Capture leads with a friendly conversational form', questions: 4 },
  { icon: '📅', title: 'Appointment Booking', category: 'Business', desc: 'Let visitors book appointments easily', questions: 5 },
  { icon: '⭐', title: 'Customer Feedback', category: 'Support', desc: 'Collect feedback and improve your service', questions: 6 },
  { icon: '📋', title: 'Job Application', category: 'HR', desc: 'Streamline your hiring process', questions: 8 },
  { icon: '🏠', title: 'Real Estate Inquiry', category: 'Real Estate', desc: 'Qualify property buyers and renters', questions: 5 },
  { icon: '🎓', title: 'Course Registration', category: 'Education', desc: 'Register students for courses', questions: 6 },
  { icon: '💼', title: 'Business Inquiry', category: 'Business', desc: 'Qualify business leads automatically', questions: 5 },
  { icon: '🛒', title: 'Product Order', category: 'eCommerce', desc: 'Take orders conversationally', questions: 7 },
  { icon: '🏥', title: 'Patient Intake', category: 'Healthcare', desc: 'Collect patient information before appointments', questions: 9 },
  { icon: '✈️', title: 'Travel Inquiry', category: 'Travel', desc: 'Qualify travel leads and gather requirements', questions: 6 },
  { icon: '🎉', title: 'Event Registration', category: 'Events', desc: 'Register attendees for your events', questions: 5 },
  { icon: '📊', title: 'Market Research', category: 'Marketing', desc: 'Conduct market research surveys', questions: 8 },
  { icon: '🤝', title: 'Partnership Request', category: 'Business', desc: 'Qualify potential business partners', questions: 6 },
  { icon: '💰', title: 'Quote Request', category: 'Business', desc: 'Generate quotes for your services', questions: 5 },
  { icon: '🎨', title: 'Design Brief', category: 'Creative', desc: 'Collect design requirements from clients', questions: 7 },
  { icon: '🏋️', title: 'Fitness Assessment', category: 'Healthcare', desc: 'Assess fitness goals and history', questions: 8 },
  { icon: '🍕', title: 'Restaurant Reservation', category: 'eCommerce', desc: 'Take table reservations easily', questions: 4 },
  { icon: '🎵', title: 'Music Lesson Booking', category: 'Education', desc: 'Book music lessons and assess skill level', questions: 5 },
  { icon: '🚗', title: 'Car Service Booking', category: 'Business', desc: 'Book vehicle service appointments', questions: 5 },
  { icon: '🏡', title: 'Home Renovation Quote', category: 'Real Estate', desc: 'Quote home renovation projects', questions: 7 },
  { icon: '📱', title: 'App Feedback', category: 'Support', desc: 'Gather user feedback on your app', questions: 5 },
  { icon: '🌱', title: 'Donation Form', category: 'Nonprofit', desc: 'Collect donations conversationally', questions: 4 },
  { icon: '👶', title: 'Childcare Enrollment', category: 'Education', desc: 'Enroll children in daycare or school', questions: 8 },
  { icon: '🐾', title: 'Pet Service Booking', category: 'Business', desc: 'Book pet grooming or vet appointments', questions: 5 },
  { icon: '💊', title: 'Medical Consultation', category: 'Healthcare', desc: 'Pre-screen patients before consultations', questions: 7 },
  { icon: '🎮', title: 'Gaming Survey', category: 'Marketing', desc: 'Survey your gaming community', questions: 6 },
  { icon: '📸', title: 'Photography Booking', category: 'Creative', desc: 'Book photography sessions', questions: 6 },
  { icon: '🏫', title: 'School Admission', category: 'Education', desc: 'Process school admission applications', questions: 10 },
  { icon: '💻', title: 'IT Support Request', category: 'Support', desc: 'Log IT support tickets conversationally', questions: 5 },
  { icon: '🌍', title: 'Volunteer Registration', category: 'Nonprofit', desc: 'Register volunteers for your cause', questions: 6 },
]

const categories = ['All', 'Marketing', 'Business', 'HR', 'Education', 'Real Estate', 'Healthcare', 'Events', 'eCommerce', 'Travel', 'Support', 'Creative', 'Nonprofit']

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = templates.filter(t => {
    const matchCat = activeCategory === 'All' || t.category === activeCategory
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="py-20 px-6 text-center bg-gray-50 border-b border-gray-100">
        <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-3">Templates</p>
        <h1 className="text-5xl font-black text-gray-950 mb-4">Start with a template</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
          Choose from 50+ professionally designed templates and customise to match your brand.
        </p>
        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-red-400 text-sm bg-white"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat, i) => (
            <button key={i}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Count */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-2">
        <p className="text-gray-400 text-sm">
          Showing <strong className="text-gray-700">{filtered.length}</strong> templates
          {activeCategory !== 'All' && <span> in <strong className="text-red-600">{activeCategory}</strong></span>}
        </p>
      </div>

      {/* Templates Grid */}
      <section className="py-6 px-6 pb-20">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Blank */}
          {activeCategory === 'All' && !search && (
            <Link href="/register"
              className="border-2 border-dashed border-gray-200 hover:border-red-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 transition-all hover:bg-red-50 group min-h-48"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-red-100 flex items-center justify-center text-2xl">+</div>
              <div>
                <p className="font-bold text-gray-900 group-hover:text-red-600">Start from scratch</p>
                <p className="text-gray-400 text-xs mt-1">Build your own form</p>
              </div>
            </Link>
          )}

          {filtered.length === 0 ? (
            <div className="col-span-4 text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-bold text-gray-900 mb-1">No templates found</p>
              <p className="text-gray-400 text-sm">Try a different search or category</p>
            </div>
          ) : (
            filtered.map((t, i) => (
              <Link href="/register" key={i}
                className="bg-white border border-gray-100 hover:border-red-200 rounded-2xl p-6 flex flex-col gap-4 transition-all hover:shadow-xl hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{t.icon}</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-medium group-hover:bg-red-50 group-hover:text-red-500 transition-colors">{t.category}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">{t.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{t.desc}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{t.questions} questions</span>
                  <span className="text-xs text-red-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Use template →</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-red-600 py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { num: '50+', label: 'Ready-made templates' },
            { num: '10+', label: 'Industries covered' },
            { num: '5 min', label: 'Average setup time' },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-4xl font-black text-white mb-1">{s.num}</p>
              <p className="text-red-200 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gray-950 text-center">
        <h2 className="text-4xl font-black text-white mb-4">Can&apos;t find what you need?</h2>
        <p className="text-gray-400 mb-8">Use AI to generate a custom form in seconds</p>
        <Link href="/register" className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-bold text-sm transition-all hover:shadow-2xl">
          Create with AI →
        </Link>
      </section>

      <Footer />
    </main>
  )
}
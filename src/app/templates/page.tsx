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
  { icon: '📊', title: 'Market Research', category: 'Research', desc: 'Conduct market research surveys', questions: 8 },
  { icon: '🤝', title: 'Partnership Request', category: 'Business', desc: 'Qualify potential business partners', questions: 6 },
  { icon: '💰', title: 'Quote Request', category: 'Sales', desc: 'Generate quotes for your services', questions: 5 },
  { icon: '🎨', title: 'Design Brief', category: 'Creative', desc: 'Collect design requirements from clients', questions: 7 },
  { icon: '🏋️', title: 'Fitness Assessment', category: 'Health', desc: 'Assess fitness goals and history', questions: 8 },
  { icon: '🍕', title: 'Restaurant Reservation', category: 'Food', desc: 'Take table reservations easily', questions: 4 },
  { icon: '🎵', title: 'Music Lesson Booking', category: 'Education', desc: 'Book music lessons and assess skill level', questions: 5 },
  { icon: '🚗', title: 'Car Service Booking', category: 'Automotive', desc: 'Book vehicle service appointments', questions: 5 },
  { icon: '🏡', title: 'Home Renovation Quote', category: 'Construction', desc: 'Quote home renovation projects', questions: 7 },
  { icon: '📱', title: 'App Feedback', category: 'Tech', desc: 'Gather user feedback on your app', questions: 5 },
  { icon: '🌱', title: 'Donation Form', category: 'Nonprofit', desc: 'Collect donations conversationally', questions: 4 },
  { icon: '👶', title: 'Childcare Enrollment', category: 'Education', desc: 'Enroll children in daycare or school', questions: 8 },
  { icon: '🐾', title: 'Pet Service Booking', category: 'Pets', desc: 'Book pet grooming or vet appointments', questions: 5 },
]

const categories = ['All', 'Marketing', 'Business', 'HR', 'Education', 'Real Estate', 'Healthcare', 'Events', 'eCommerce', 'Travel']

export default function TemplatesPage() {
  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="py-20 px-6 text-center bg-gray-50 border-b border-gray-100">
        <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-3">Templates</p>
        <h1 className="text-5xl font-black text-gray-950 mb-4">Start with a template</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Choose from 50+ professionally designed templates and customise to match your brand.
        </p>
      </section>

      {/* Categories */}
      <section className="px-6 py-6 border-b border-gray-100 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex gap-2 flex-wrap">
          {categories.map((cat, i) => (
            <button key={i}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                i === 0
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Blank template */}
          <Link href="/register"
            className="border-2 border-dashed border-gray-200 hover:border-red-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 transition-all hover:bg-red-50 group min-h-48"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-red-100 flex items-center justify-center text-2xl transition-colors">+</div>
            <div>
              <p className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">Start from scratch</p>
              <p className="text-gray-400 text-xs mt-1">Build your own form</p>
            </div>
          </Link>

          {templates.map((t, i) => (
            <Link href="/register" key={i}
              className="bg-white border border-gray-100 hover:border-red-200 rounded-2xl p-6 flex flex-col gap-4 transition-all hover:shadow-lg hover:-translate-y-1 group"
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{t.icon}</span>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-medium">{t.category}</span>
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
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gray-950 text-center">
        <h2 className="text-4xl font-black text-white mb-4">Can&apos;t find what you need?</h2>
        <p className="text-gray-400 mb-8">Use AI to generate a custom form in seconds</p>
        <Link href="/register" className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-bold text-sm transition-all">
          Create with AI →
        </Link>
      </section>

      <Footer />
    </main>
  )
}
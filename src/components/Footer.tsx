import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-sm">M</div>
              <span>MegaForms</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">Beautiful interactive forms and chat widgets. No coding required.</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">Product</h4>
            <div className="flex flex-col gap-3">
              <Link href="/pricing" className="text-gray-400 hover:text-white text-sm transition-colors">Pricing</Link>
              <Link href="/features#ai" className="text-gray-400 hover:text-white text-sm transition-colors">AI Form Builder</Link>
              <Link href="/features#widget" className="text-gray-400 hover:text-white text-sm transition-colors">Chat Widget</Link>
              <Link href="/templates" className="text-gray-400 hover:text-white text-sm transition-colors">Templates</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">Use Cases</h4>
            <div className="flex flex-col gap-3">
              <Link href="/templates#leads" className="text-gray-400 hover:text-white text-sm transition-colors">Lead Generation</Link>
              <Link href="/templates#education" className="text-gray-400 hover:text-white text-sm transition-colors">Education</Link>
              <Link href="/templates#realestate" className="text-gray-400 hover:text-white text-sm transition-colors">Real Estate</Link>
              <Link href="/templates#travel" className="text-gray-400 hover:text-white text-sm transition-colors">Travel</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">Resources</h4>
            <div className="flex flex-col gap-3">
              <Link href="/help" className="text-gray-400 hover:text-white text-sm transition-colors">Help Center</Link>
              <Link href="/blog" className="text-gray-400 hover:text-white text-sm transition-colors">Blog</Link>
              <Link href="/developers" className="text-gray-400 hover:text-white text-sm transition-colors">Developers</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">Company</h4>
            <div className="flex flex-col gap-3">
              <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">About</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2025 Megamind Studio. All rights reserved.</p>
          <p className="text-gray-500 text-sm">Made with ❤️ by Megamind Studio</p>
        </div>
      </div>
    </footer>
  )
}
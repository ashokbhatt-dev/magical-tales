// components/landing/footer.tsx
import { Facebook, Instagram, Mail, Heart } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-3xl">📚</div>
              <span className="text-2xl font-bold text-white">Magical Tales</span>
            </div>
            <p className="text-sm mb-4">
              বাচ্চাদের জন্য AI-powered personalized storybook platform
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="mailto:hello@magicaltales.com" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#features" className="hover:text-purple-400 transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</Link></li>
              <li><Link href="#demo" className="hover:text-purple-400 transition-colors">Demo</Link></li>
              <li><Link href="/signup" className="hover:text-purple-400 transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-purple-400 transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-purple-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-purple-400 transition-colors">FAQ</Link></li>
              <li><Link href="/tutorials" className="hover:text-purple-400 transition-colors">Tutorials</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-purple-400 transition-colors">Refund Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-purple-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>© 2024 Magical Tales. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in Bangladesh 🇧🇩
          </p>
        </div>
      </div>
    </footer>
  )
}
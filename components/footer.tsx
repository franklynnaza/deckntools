import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Company Info */}
          <div>
            <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="DeckN Tools logo" width={164} height={164} priority />
          </Link>
            <p className="opacity-90 text-sm">
              Your trusted source for premium decking materials and professional tools.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/products" className="hover:opacity-80 transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/custom-kits" className="hover:opacity-80 transition">
                  Custom Kits
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:opacity-80 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:opacity-80 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/shipping" className="hover:opacity-80 transition">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:opacity-80 transition">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:opacity-80 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:opacity-80 transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+44 (0) 123 456 7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@deckmaterials.co.uk</span>
              </li>
              {/* <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>
                  123 Trade Street
                  <br />
                  London, UK
                </span>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm opacity-90">
          <p>&copy; 2025 DecknTools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

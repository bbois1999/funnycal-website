import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import CartButton from '../components/CartButton'

export const metadata: Metadata = {
  title: 'FunnyCal LLC',
  description: 'Hilarious personalized calendars, posters, and t-shirts with face swaps',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CartButton />
        {children}
        <footer className="bg-gray-800 text-white py-12 mt-20">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-3">FunnyCal LLC</h3>
              <p className="text-gray-400 mb-2">Creating laughter, one face swap at a time.</p>
              <p className="text-gray-400 mb-1"><span className="font-semibold">Support:</span> <a href="mailto:support@funnycal.com" className="hover:text-orange-400">support@funnycal.com</a> · <a href="tel:16123842625" className="hover:text-orange-400">612-384-2625</a></p>
              <p className="text-gray-400 mb-1"><span className="font-semibold">Address:</span> 3683 Cranbrook Drive, White Bear Lake, MN 55110</p>
              <p className="text-gray-400"><span className="font-semibold">Hours:</span> Daily 10:00am–10:00pm CT</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/contact" className="hover:text-orange-400">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-orange-400">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-orange-400">Terms</Link></li>
                <li><Link href="/refund-policy" className="hover:text-orange-400">Refund Policy</Link></li>
                <li><Link href="/return-policy" className="hover:text-orange-400">Return Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Social</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="https://www.facebook.com/profile.php?id=61572717703408" target="_blank" className="hover:text-orange-400" rel="noopener noreferrer">Facebook</a></li>
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

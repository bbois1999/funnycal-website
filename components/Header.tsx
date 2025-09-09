import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl md:text-3xl font-bold text-gray-800">
            Funny<span className="text-orange-500">Cal</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-orange-500 transition-colors">
              Home
            </Link>
            <Link href="/calendar-templates" className="text-gray-600 hover:text-orange-500 transition-colors">
              Calendars
            </Link>
            <Link href="/shirts" className="text-gray-600 hover:text-orange-500 transition-colors">
              Shirts
            </Link>
            <Link href="/posters" className="text-gray-600 hover:text-orange-500 transition-colors">
              Posters
            </Link>
            <Link href="/all-products" className="text-gray-600 hover:text-orange-500 transition-colors">
              All Categories
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-orange-500 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

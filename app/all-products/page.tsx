import Image from 'next/image'
import Link from 'next/link'

const calendars = [
  { key: 'swimsuit', title: 'Swimsuit Calendar', desc: 'Beach-ready laughs for every month.', image: '/template-images/swimsuit/1S.png' },
  { key: 'superhero', title: 'Superhero Calendar', desc: 'Iconic hero poses with your face.', image: '/template-images/superhero/1superman.png' },
  { key: 'memes', title: 'Meme Calendar', desc: 'Internet-famous moments all year.', image: '/template-images/meme/1fourseasonsorlando.png' },
]

const upcoming = [
  { key: 'tshirt', title: 'Funny T-Shirt', desc: 'Wear your face-swapped glory.', image: '/example-pics/tshirt-example.png' },
  { key: 'poster', title: 'Poster Print', desc: 'Big laughs for your wall.', image: '/example-pics/poster-example.png' },
]

const randomPicks = [
  ...calendars,
]

export default function AllProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-700 bg-white hover:bg-gray-50 px-3 py-2 rounded-lg shadow">
            <span>←</span> <span>Back to Home</span>
          </Link>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">All Products</h1>
          <p className="text-gray-600">Calendars now, shirts and posters coming soon.</p>
        </div>

        {/* Calendars Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Calendars</h2>
            <Link href="/calendar-templates" className="text-orange-600 hover:text-orange-700 font-semibold">Browse all calendars →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {calendars.map((p) => (
              <div key={p.key} className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image src={p.image} alt={p.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800">{p.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{p.desc}</p>
                  <Link href={`/product/calendar/${p.key}`} className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-lg font-semibold">Customize</Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Other Products (coming soon) */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">More Products</h2>
          <div className="space-y-4">
            {upcoming.map((p) => (
              <div key={p.key} className="flex items-center gap-4 bg-white rounded-xl shadow p-4">
                <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100">
                  <Image src={p.image} alt={p.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-semibold text-gray-800">{p.title}</div>
                  <div className="text-gray-600 text-sm">{p.desc}</div>
                </div>
                <button className="bg-gray-200 text-gray-700 rounded px-3 py-2 text-sm" disabled>
                  Coming soon
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Random Picks horizontal */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Random Picks</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {randomPicks.map((p) => (
              <div key={p.key} className="min-w-[220px] max-w-[220px] bg-white rounded-xl shadow overflow-hidden">
                <div className="relative h-36 w-full">
                  <Image src={p.image} alt={p.title} fill className="object-cover" />
                </div>
                <div className="p-3">
                  <div className="font-semibold text-gray-800 text-sm mb-1">{p.title}</div>
                  <div className="text-xs text-gray-600 mb-2">{p.desc}</div>
                  <Link href={`/product/calendar/${p.key}`} className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 rounded">View</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

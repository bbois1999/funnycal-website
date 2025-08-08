import Image from 'next/image'
import Link from 'next/link'

const calendars = [
  { key: 'swimsuit', title: 'Swimsuit Calendar', desc: 'Beach-ready laughs for every month.', image: '/template-images/swimsuit/1S.png' },
  { key: 'superhero', title: 'Superhero Calendar', desc: 'Iconic hero poses with your face.', image: '/template-images/superhero/1superman.png' },
  { key: 'memes', title: 'Meme Calendar', desc: 'Internet-famous moments all year.', image: '/template-images/meme/1fourseasonsorlando.png' },
]

// Tiny grid uses a broad sampling of template images
const customGridImages: string[] = [
  // Swimsuit
  '/template-images/swimsuit/1S.png','/template-images/swimsuit/2S.png','/template-images/swimsuit/3S.png','/template-images/swimsuit/4S.png','/template-images/swimsuit/5S.png','/template-images/swimsuit/6S.png','/template-images/swimsuit/7S.png','/template-images/swimsuit/8S.png','/template-images/swimsuit/9S.png','/template-images/swimsuit/10S.png','/template-images/swimsuit/11S.png','/template-images/swimsuit/12S.png',
  // Superhero
  '/template-images/superhero/1superman.png','/template-images/superhero/2ironman.png','/template-images/superhero/3captainamerica.png','/template-images/superhero/4thor.png','/template-images/superhero/5doctorstrange.png','/template-images/superhero/6aquaman.png','/template-images/superhero/7hulk.png','/template-images/superhero/8spiderman.png','/template-images/superhero/9wolverine.png','/template-images/superhero/10greenlantern.png','/template-images/superhero/11blackpanther.png','/template-images/superhero/12batman.png',
  // Firefighter/Hunk
  '/template-images/firefighter/1F.png','/template-images/firefighter/2F.png','/template-images/firefighter/3F.png','/template-images/firefighter/4F.png','/template-images/firefighter/5F.png','/template-images/firefighter/6F.png','/template-images/firefighter/7F.png','/template-images/firefighter/8F.png','/template-images/firefighter/9F.png','/template-images/firefighter/10F.png','/template-images/firefighter/11F.png','/template-images/firefighter/12F.png',
  // Holiday (with swaps per your earlier fixes)
  '/template-images/holiday/1January.png','/template-images/holiday/2February.png','/template-images/holiday/6June.png','/template-images/holiday/4April.png','/template-images/holiday/5May.png','/template-images/holiday/7July.png','/template-images/holiday/8August.png','/template-images/holiday/9September.png','/template-images/holiday/10October.png','/template-images/holiday/11November.png','/template-images/holiday/12December.png',
  // Baby (with swaps per earlier fixes)
  '/template-images/baby/1JanuaryBaby.png','/template-images/baby/6JuneBaby.png','/template-images/baby/3MarchBaby.png','/template-images/baby/4AprilBaby.png','/template-images/baby/5MayBaby.png','/template-images/baby/7JulyBaby.png','/template-images/baby/8AugustBaby.png','/template-images/baby/9SeptemberBaby.png','/template-images/baby/10OctoberBaby.png','/template-images/baby/11NovemberBaby.png','/template-images/baby/12DecemberBaby.png',
  // Memes/Junkies samples
  '/template-images/meme/1fourseasonsorlando.png','/template-images/junkies/1Sharks.png'
]

const tshirts = [
  {
    key: 'einstein-shirt',
    title: 'Einstein T‑Shirt',
    desc: 'Einstein on a tee. Face-swap coming soon.',
    image: '/shirt-poster-pic-examples/realPreviewImageNoTongue.png', // shirt mockup
    thumbs: ['/shirt-poster-pic-examples/einsteinNormal.jpg', '/shirt-poster-pic-examples/exampleGary.png'],
  },
]

const posters = [
  {
    key: 'einstein-poster',
    title: 'Einstein Poster',
    desc: 'Classic Einstein print. Face-swap coming soon.',
    image: '/shirt-poster-pic-examples/einsteinNormal.jpg', // poster/main image
    thumbs: ['/shirt-poster-pic-examples/exampleGary.png'],
  },
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

        {/* Tiny Custom Calendar Promo (like homepage but much smaller) */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-center mb-3">
              <h3 className="text-lg font-bold text-gray-800">Custom Calendar</h3>
              <p className="text-xs text-gray-600">Use any of our template pictures to build your own</p>
            </div>
            <div className="mx-auto max-w-5xl">
              <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 gap-[2px]">
                {customGridImages.slice(0, 80).map((src, idx) => (
                  <div key={idx} className="relative w-full aspect-square overflow-hidden rounded-[2px] bg-gray-100">
                    <Image src={src} alt="Template" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center mt-4">
              <Link href="/calendar-templates" className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-2 rounded font-semibold">Browse Templates →</Link>
            </div>
          </div>
        </section>

        {/* T‑Shirts Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">T‑Shirts</h2>
            <Link href="/shirts" className="text-orange-600 hover:text-orange-700 font-semibold">More shirts →</Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {tshirts.map((p) => (
              <div key={p.key} className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative h-64 w-full bg-gray-50">
                  <Image src={p.image} alt={p.title} fill className="object-contain" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800">{p.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{p.desc}</p>
                  {p.thumbs && p.thumbs.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {p.thumbs.map((tSrc) => (
                        <div key={tSrc} className="relative h-14 w-14 rounded overflow-hidden bg-gray-100">
                          <Image src={tSrc} alt="Preview" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                  <button className="bg-gray-200 text-gray-700 rounded px-3 py-2 text-sm" disabled>
                    Coming soon
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Posters Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Posters</h2>
            <Link href="/posters" className="text-orange-600 hover:text-orange-700 font-semibold">More posters →</Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {posters.map((p) => (
              <div key={p.key} className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative h-64 w-full bg-gray-50">
                  <Image src={p.image} alt={p.title} fill className="object-contain" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800">{p.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{p.desc}</p>
                  {p.thumbs && p.thumbs.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {p.thumbs.map((tSrc) => (
                        <div key={tSrc} className="relative h-14 w-14 rounded overflow-hidden bg-gray-100">
                          <Image src={tSrc} alt="Preview" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                  <button className="bg-gray-200 text-gray-700 rounded px-3 py-2 text-sm" disabled>
                    Coming soon
                  </button>
                </div>
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

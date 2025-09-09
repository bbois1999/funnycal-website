import Image from 'next/image'
import Link from 'next/link'
import Header from '../../components/Header'

const posters = [
  {
    key: 'einstein',
    title: 'Einstein Poster',
    desc: 'Put your face on the genius himself! Classic Einstein poster with your brilliant mind.',
    image: '/shirt-poster-pic-examples/einsteinNormal.jpg',
    price: '$14.99',
    thumbs: ['/shirt-poster-pic-examples/exampleGary.png'],
  },
]

export default function PostersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-red-50">
      <Header />
      
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-700 bg-white hover:bg-gray-50 px-3 py-2 rounded-lg shadow transition-all duration-200 transform hover:scale-105">
              <span>←</span> <span>Back to Home</span>
            </Link>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Funny Posters</h1>
            <p className="text-gray-600">Transform your walls with hilarious face-swapped poster art!</p>
          </div>

          {/* Featured Posters */}
          <section className="mb-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posters.map((poster) => (
                <div key={poster.key} className="bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:scale-105">
                  <div className="relative h-80 w-full bg-gray-50">
                    <Image src={poster.image} alt={poster.title} fill className="object-contain" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{poster.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{poster.desc}</p>
                    <div className="text-2xl font-bold text-orange-600 mb-4">{poster.price}</div>
                    
                    {poster.thumbs && poster.thumbs.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {poster.thumbs.map((tSrc, idx) => (
                          <div key={idx} className="relative h-16 w-16 rounded overflow-hidden bg-gray-100">
                            <Image src={tSrc} alt="Preview" fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <Link 
                      href={`/product/poster/${poster.key}`} 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-6 rounded-lg font-bold text-center transition-all duration-200 transform hover:scale-105 block"
                    >
                      🎭 Customize Your Poster ✨
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Custom Posters Section */}
          <section className="mb-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Want a Custom Poster?</h2>
                <p className="text-gray-600">
                  Have a specific design in mind? We can create custom face-swap posters with your own images!
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto text-center">
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🖼️</div>
                    <h3 className="font-semibold mb-1">Upload Your Design</h3>
                    <p className="text-sm text-gray-600">Send us your poster idea</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎭</div>
                    <h3 className="font-semibold mb-1">Face Swap Magic</h3>
                    <p className="text-sm text-gray-600">We'll add face swap functionality</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏠</div>
                    <h3 className="font-semibold mb-1">Print & Ship</h3>
                    <p className="text-sm text-gray-600">High-quality poster delivered to you</p>
                  </div>
                </div>
                
                <Link 
                  href="/contact" 
                  className="inline-block bg-purple-500 hover:bg-purple-600 text-white py-3 px-8 rounded-lg font-bold transition-all duration-200 transform hover:scale-105"
                >
                  Contact Us for Custom Posters
                </Link>
              </div>
            </div>
          </section>

          {/* Poster Specs */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Poster Specifications</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-5xl mb-4">📏</div>
                  <h3 className="font-bold mb-2">11" x 17"</h3>
                  <p className="text-sm text-gray-600">Perfect size for framing</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">✨</div>
                  <h3 className="font-bold mb-2">Glossy Finish</h3>
                  <p className="text-sm text-gray-600">Vibrant, professional quality</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">📜</div>
                  <h3 className="font-bold mb-2">Premium Paper</h3>
                  <p className="text-sm text-gray-600">Thick, durable cardstock</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">🖼️</div>
                  <h3 className="font-bold mb-2">Ready to Frame</h3>
                  <p className="text-sm text-gray-600">Fits standard frames</p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">How Face Swap Posters Work</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-5xl mb-4">📷</div>
                  <h3 className="font-bold mb-2">1. Upload Photo</h3>
                  <p className="text-sm text-gray-600">Upload a clear photo of your face</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">🎭</div>
                  <h3 className="font-bold mb-2">2. AI Magic</h3>
                  <p className="text-sm text-gray-600">Our AI swaps your face onto the poster</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">🖼️</div>
                  <h3 className="font-bold mb-2">3. Preview & Order</h3>
                  <p className="text-sm text-gray-600">See your custom poster and place order</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">🚚</div>
                  <h3 className="font-bold mb-2">4. Fast Delivery</h3>
                  <p className="text-sm text-gray-600">Your amazing poster ships quickly</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

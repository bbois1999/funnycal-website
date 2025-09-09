import Image from 'next/image'
import Link from 'next/link'
import Header from '../../components/Header'

const shirts = [
  {
    key: 'einstein',
    title: 'Einstein T-Shirt',
    desc: 'Put your face on the genius himself! Classic Einstein with your brilliant mind.',
    image: '/shirt-poster-pic-examples/realPreviewImageNoTongue.png',
    price: '$19.99',
    thumbs: ['/shirt-poster-pic-examples/einsteinNormal.jpg', '/shirt-poster-pic-examples/exampleGary.png'],
  },
]

export default function ShirtsPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Funny T-Shirts</h1>
            <p className="text-gray-600">Put your face on hilarious t-shirt designs and wear your comedy!</p>
          </div>

          {/* Featured Shirts */}
          <section className="mb-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shirts.map((shirt) => (
                <div key={shirt.key} className="bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:scale-105">
                  <div className="relative h-64 w-full bg-gray-50">
                    <Image src={shirt.image} alt={shirt.title} fill className="object-contain" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{shirt.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{shirt.desc}</p>
                    <div className="text-2xl font-bold text-orange-600 mb-4">{shirt.price}</div>
                    
                    {shirt.thumbs && shirt.thumbs.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {shirt.thumbs.map((tSrc, idx) => (
                          <div key={idx} className="relative h-16 w-16 rounded overflow-hidden bg-gray-100">
                            <Image src={tSrc} alt="Preview" fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <Link 
                      href={`/product/shirt/${shirt.key}`} 
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-6 rounded-lg font-bold text-center transition-all duration-200 transform hover:scale-105 block"
                    >
                      🎭 Customize Your Shirt ✨
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Custom Shirts Section */}
          <section className="mb-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Want a Custom Shirt?</h2>
                <p className="text-gray-600">
                  Have a specific design in mind? We can create custom face-swap shirts with your own images!
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto text-center">
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📤</div>
                    <h3 className="font-semibold mb-1">Upload Your Template</h3>
                    <p className="text-sm text-gray-600">Send us your shirt design idea</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎭</div>
                    <h3 className="font-semibold mb-1">Face Swap Magic</h3>
                    <p className="text-sm text-gray-600">We'll add face swap functionality</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">👕</div>
                    <h3 className="font-semibold mb-1">Print & Ship</h3>
                    <p className="text-sm text-gray-600">High-quality shirt delivered to you</p>
                  </div>
                </div>
                
                <Link 
                  href="/contact" 
                  className="inline-block bg-purple-500 hover:bg-purple-600 text-white py-3 px-8 rounded-lg font-bold transition-all duration-200 transform hover:scale-105"
                >
                  Contact Us for Custom Shirts
                </Link>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">How Face Swap Shirts Work</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-5xl mb-4">📷</div>
                  <h3 className="font-bold mb-2">1. Upload Photo</h3>
                  <p className="text-sm text-gray-600">Upload a clear photo of your face</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">🎭</div>
                  <h3 className="font-bold mb-2">2. AI Magic</h3>
                  <p className="text-sm text-gray-600">Our AI swaps your face onto the design</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">👕</div>
                  <h3 className="font-bold mb-2">3. Preview & Order</h3>
                  <p className="text-sm text-gray-600">See your custom shirt and place order</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">🚚</div>
                  <h3 className="font-bold mb-2">4. Fast Delivery</h3>
                  <p className="text-sm text-gray-600">Your hilarious shirt ships quickly</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

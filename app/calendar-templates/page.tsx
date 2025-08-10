import Image from "next/image";
import Link from "next/link";

const calendarTemplates = [
  {
    id: "swimsuit",
    name: "Swimsuit Calendar",
    description: "Beach body ready! Put your face on stunning swimsuit models",
    price: "$24.99",
    templateImage: "/template-images/swimsuit/1S.png",
    exampleImages: [
      "/template-examples/swimsuit/swapped_1S.png",
      "/template-examples/swimsuit/swapped_6S.png",
      "/template-examples/swimsuit/swapped_9S.png",
      "/template-examples/swimsuit/swapped_10S.png"
    ],
    features: ["12 months", "High-quality print", "Spiral bound", "8.5x11 inches"]
  },
  {
    id: "superhero",
    name: "Superhero Calendar",
    description: "Become the hero you were meant to be with iconic superhero poses",
    price: "$29.99",
    templateImage: "/template-images/superhero/1superman.png",
    exampleImages: [
      "/template-examples/superhero/swapped_1superman.png",
      "/template-examples/superhero/swapped_2ironman.png",
      "/template-examples/superhero/swapped_3captainamerica.png",
      "/template-examples/superhero/swapped_12batman.png",
      "/template-examples/superhero/swapped_5doctorstrange.png"
    ],
    features: ["12 months", "Action-packed scenes", "Comic book style", "8.5x11 inches"]
  },
  {
    id: "memes",
    name: "Meme Calendar",
    description: "Internet famous! Your face on the world's funniest memes",
    price: "$22.99",
    templateImage: "/template-images/meme/1fourseasonsorlando.png",
    exampleImages: [
      "/template-examples/memes/swapped_1fourseasonsorlando.png",
      "/template-examples/memes/swapped_4hideYoKids.png",
      "/template-examples/memes/swapped_5youKnowIHadtodoittoem.png",
      "/template-examples/memes/swapped_7caniborrow.png",
      "/template-examples/memes/swapped_9holdingfart.png"
    ],
    features: ["12 months", "Viral meme templates", "Internet comedy gold", "8.5x11 inches"]
  },
  {
    id: "junkies",
    name: "Adrenaline Junkies Calendar",
    description: "Extreme sports and death-defying stunts - safely from your calendar",
    price: "$26.99",
    templateImage: "/template-images/junkies/1Sharks.png",
    exampleImages: [
      "/template-examples/junkies/swapped_1Sharks.png",
      "/template-examples/junkies/swapped_5Parachute.png",
      "/template-examples/junkies/swapped_6RockClimbing.png",
      "/template-examples/junkies/swapped_12CliffJumping.png"
    ],
    features: ["12 months", "Extreme sports", "Adventure scenes", "8.5x11 inches"]
  },
  {
    id: "hunk",
    name: "Firefighter Hunk Calendar",
    description: "Smoldering hot! Become the firefighter hunk of your dreams",
    price: "$27.99",
    templateImage: "/template-images/firefighter/1F.png",
    exampleImages: [
      "/template-examples/hunk/swapped_6F.png",
      "/template-examples/hunk/swapped_8F.png",
      "/template-examples/hunk/swapped_10F.png",
      "/template-examples/hunk/swapped_11F.png",
      "/template-examples/hunk/swapped_12F.png"
    ],
    features: ["12 months", "Heroic firefighter poses", "Steamy calendar", "8.5x11 inches"]
  },
  {
    id: "holiday",
    name: "Holiday Calendar",
    description: "Celebrate every season with festive holiday-themed face swaps",
    price: "$25.99",
    templateImage: "/template-images/holiday/1January.png",
    exampleImages: [
      "/template-examples/holiday/swapped_1January.png",
      "/template-examples/holiday/swapped_4April.png",
      "/template-examples/holiday/swapped_5May.png"
    ],
    features: ["12 months", "Seasonal celebrations", "Holiday themes", "8.5x11 inches"]
  },
  {
    id: "babies",
    name: "Baby Calendar",
    description: "Adorably hilarious! Your face on cute baby bodies throughout the year",
    price: "$23.99",
    templateImage: "/template-images/baby/1JanuaryBaby.png",
    exampleImages: [
      "/template-examples/babies/swapped_6JuneBaby.png",
      "/template-examples/babies/swapped_7JulyBaby.png",
      "/template-examples/babies/swapped_11NovemberBaby.png"
    ],
    features: ["12 months", "Adorable baby scenes", "Cute and funny", "8.5x11 inches"]
  }
];

export default function CalendarTemplates() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-bold text-gray-800">
              Funny<span className="text-orange-500">Cal</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-orange-500 transition-colors">
                Home
              </Link>
              <Link href="/calendar-templates" className="text-orange-500 font-semibold">
                Calendar Templates
              </Link>
              <Link href="/shirts" className="text-gray-600 hover:text-orange-500 transition-colors">
                Shirts
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-orange-500 transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Calendar Templates
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose from our collection of hilarious calendar templates. Each one is perfect 
            for showcasing your face-swapped masterpieces throughout the year!
          </p>
          <div className="bg-orange-100 border border-orange-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              How It Works:
            </h3>
            <p className="text-orange-700">
              Select a template below, upload your photo, and see your face swap come to life instantly! 
              Create your personalized calendar in just a few clicks.
            </p>
            <div className="mt-4">
              <Link href="/custom-calendar" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-semibold">
                Or build a Custom Calendar →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {calendarTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-64">
                  <Image
                    src={template.templateImage}
                    alt={template.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full font-bold">
                    {template.price}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {template.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {template.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-orange-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                                     <div className="flex gap-2">
                      <Link
                       href={`/product/calendar/${template.id}`}
                       className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors duration-300 text-center"
                     >
                       View Details
                     </Link>
                     <Link
                       href={`/face-swap/calendar/${template.id}`}
                       className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors duration-300 text-center"
                     >
                       Try Face Swap
                     </Link>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Ready to Create Your Hilarious Calendar?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Upload your photo and watch the face-swapping magic happen instantly!
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl mb-3">📸</div>
              <h3 className="font-bold text-gray-800 mb-2">Upload Your Photo</h3>
              <p className="text-gray-600">Quick and easy upload</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎭</div>
              <h3 className="font-bold text-gray-800 mb-2">Instant Face Swap</h3>
              <p className="text-gray-600">See results immediately</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="font-bold text-gray-800 mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Delivered in 7-10 days</p>
            </div>
          </div>
          
          <Link
            href="/calendar-templates"
            className="inline-block bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-12 py-4 rounded-full text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Choose Your Template
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">
            FunnyCal LLC
          </h3>
          <p className="text-gray-400 mb-6">
            Creating laughter, one face swap at a time
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/" className="hover:text-orange-400 transition-colors">
              Home
            </Link>
            <Link href="/calendar-templates" className="hover:text-orange-400 transition-colors">
              Calendar Templates
            </Link>
            <Link href="/shirts" className="hover:text-orange-400 transition-colors">
              Shirts
            </Link>
            <Link href="/contact" className="hover:text-orange-400 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 
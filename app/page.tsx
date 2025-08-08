"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const heroImages = [
  "/hero-pics/grampaLaughing.png",
  "/hero-pics/grammaLaughing.png", 
  "/hero-pics/calendarPic.png",
  "/hero-pics/swapped_5May.png",
  "/hero-pics/swapped_4April.png"
];

const swappedExamples = [
  "/example-pics/swapped/swapped_1fourseasonsorlando.png",
  "/example-pics/swapped/swapped_11NovemberBaby.png",
  "/example-pics/swapped/swapped_7JulyBaby.png",
  "/example-pics/swapped/swapped_4hideYoKids.png",
  "/example-pics/swapped/swapped_5youKnowIHadtodoittoem.png",
  "/example-pics/swapped/swapped_6F.png",
  "/example-pics/swapped/swapped_12F.png"
];

const templates = [
  { key: "swimsuit", title: "Swimsuit Calendar", description: "Beach body ready all year. Hilarious swimsuit scenes.", image: "/template-images/swimsuit/1S.png", href: "/product/calendar/swimsuit" },
  { key: "superhero", title: "Superhero Calendar", description: "Iconic hero poses. Become the legend in every month.", image: "/template-images/superhero/1superman.png", href: "/product/calendar/superhero" },
  { key: "memes", title: "Meme Calendar", description: "Internet-famous moments with your face.", image: "/template-images/meme/1fourseasonsorlando.png", href: "/product/calendar/memes" },
  { key: "junkies", title: "Adrenaline Junkies", description: "Extreme sports without the danger (or cardio).", image: "/template-images/junkies/1Sharks.png", href: "/product/calendar/junkies" },
  { key: "hunk", title: "Firefighter Hunk", description: "Hot shots and hero vibes. Smolder guaranteed.", image: "/template-images/firefighter/1F.png", href: "/product/calendar/hunk" },
  { key: "holiday", title: "Holiday Calendar", description: "Festive fun for every season and celebration.", image: "/template-images/holiday/1January.png", href: "/product/calendar/holiday" },
  { key: "babies", title: "Baby Calendar", description: "Ridiculously adorable. Big laughs, tiny bodies.", image: "/template-images/baby/1JanuaryBaby.png", href: "/product/calendar/babies" },
  { key: "custom", title: "Custom Calendar", description: "Want something special? We’ll build a calendar around your idea.", image: "/hero-pics/calendarPic.png", href: "/calendar-templates" },
  { key: "tshirts", title: "Funny T‑Shirts", description: "Wear your face-swapped glory. Coming soon!", image: "/example-pics/tshirt-example.png", href: "/shirts" },
];

// Example face-swap image per template (fallback to template image if missing)
const templateExamples: Record<string, string> = {
  swimsuit: "/template-examples/swimsuit/swapped_1S.png",
  superhero: "/template-examples/superhero/swapped_1superman.png",
  memes: "/template-examples/memes/swapped_1fourseasonsorlando.png",
  junkies: "/template-examples/junkies/swapped_1Sharks.png",
  hunk: "/template-examples/hunk/swapped_6F.png",
  holiday: "/template-examples/holiday/swapped_1January.png",
  babies: "/template-examples/babies/swapped_6JuneBaby.png",
};

// 25-sample images for the custom calendar promo grid (5x5)
const customGridImages: string[] = [
  // Swimsuit (5)
  "/template-images/swimsuit/1S.png",
  "/template-images/swimsuit/2S.png",
  "/template-images/swimsuit/3S.png",
  "/template-images/swimsuit/4S.png",
  "/template-images/swimsuit/5S.png",
  // Superhero (5)
  "/template-images/superhero/1superman.png",
  "/template-images/superhero/2ironman.png",
  "/template-images/superhero/3captainamerica.png",
  "/template-images/superhero/4thor.png",
  "/template-images/superhero/5doctorstrange.png",
  // Firefighter (5)
  "/template-images/firefighter/1F.png",
  "/template-images/firefighter/2F.png",
  "/template-images/firefighter/3F.png",
  "/template-images/firefighter/4F.png",
  "/template-images/firefighter/5F.png",
  // Holiday (5)
  "/template-images/holiday/1January.png",
  "/template-images/holiday/2February.png",
  "/template-images/holiday/6June.png", // swapped from 3March.png
  "/template-images/holiday/4April.png",
  "/template-images/holiday/5May.png",
  // Baby (5)
  "/template-images/baby/1JanuaryBaby.png",
  "/template-images/baby/6JuneBaby.png", // swapped from 2FebruaryBaby.png
  "/template-images/baby/3MarchBaby.png",
  "/template-images/baby/4AprilBaby.png",
  "/template-images/baby/5MayBaby.png",
];

export default function Home() {
  const [currentHeroImageIdx, setCurrentHeroImageIdx] = useState(0);
  const [currentSwappedImage, setCurrentSwappedImage] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setCurrentHeroImageIdx((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    const swappedInterval = setInterval(() => {
      setCurrentSwappedImage((prev) => (prev + 1) % swappedExamples.length);
    }, 3000);

    const t = setTimeout(() => setLoaded(true), 50);

    return () => {
      clearInterval(heroInterval);
      clearInterval(swappedInterval);
      clearTimeout(t);
    };
  }, []);

  const prevSlide = () => setCarouselIndex((i) => (i - 1 + templates.length) % templates.length);
  const nextSlide = () => setCarouselIndex((i) => (i + 1) % templates.length);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-orange-50 to-red-50 transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Section */}
      <section className="relative h-[75vh] md:h-screen flex items-center justify-center overflow-hidden">
        {/* Background Frames with blurred side fills */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentHeroImageIdx ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image src={image} alt="Backdrop" fill className="object-cover blur-2xl scale-110" priority={index === 0} />
              <div className="absolute inset-0 flex items-stretch justify-center">
                <div className="relative h-full w-full">
                  <Image src={image} alt="Happy customer" fill sizes="100vw" className="object-contain" priority={index === 0} />
                </div>
              </div>
              <div className="absolute inset-0 bg-black/35" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-5xl md:text-8xl font-bold drop-shadow-lg">
              🎭 Funny<span className="text-orange-400">Cal</span>
            </h1>
          </div>
          <p className="text-lg md:text-2xl mb-6 md:mb-8 drop-shadow-md">Create Hilarious Personalized Calendars & Shirts</p>
          <p className="text-base md:text-xl mb-8 md:mb-12 max-w-2xl mx-auto drop-shadow-md">Face swap your family and friends onto funny pictures for the perfect gag gifts that'll have everyone laughing!</p>
          <Link href="#how-it-works" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">See How It Works ↓</Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">We take your face and magically swap it onto hilarious scenes to create personalized calendars and shirts that make perfect gag gifts!</p>
          </div>

          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-12 md:gap-6 items-center">
            <div className="text-center">
              <div className="relative w-64 h-64 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                <Image src="/example-pics/colins-grampa-example.jpg" alt="Original face example" fill className="object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">1. Send Us Your Photo</h3>
              <p className="text-gray-600">Upload a clear photo of the person's face you want to use</p>
            </div>

            <div className="hidden md:flex justify-center"><div className="text-6xl text-orange-500 animate-bounce">→</div></div>

            <div className="text-center">
              <div className="relative w-64 h-64 mx-auto mb-6 rounded-lg overflow-hidden shadow-lg">
                {swappedExamples.map((image, index) => (
                  <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSwappedImage ? "opacity-100" : "opacity-0"}`}>
                    <Image src={image} alt="Face swapped example" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">2. We Work Our Magic</h3>
              <p className="text-gray-600">Your face gets swapped onto funny scenes and printed on calendars or shirts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop All CTA */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Shop all products</h3>
            <p className="text-gray-600">Calendars now. Shirts and posters coming soon.</p>
          </div>
          <Link href="/all-products" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold">Browse All Items →</Link>
        </div>
      </section>

      {/* Templates Single-Item Carousel */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Popular Calendar Templates</h2>
            <Link href="/calendar-templates" className="text-orange-600 hover:text-orange-700 font-semibold">See all →</Link>
          </div>

          <div className="relative">
            <button onClick={prevSlide} className="hidden md:inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow absolute left-0 top-1/2 -translate-y-1/2 z-10">‹</button>
            <div className="overflow-hidden rounded-2xl shadow">
              {(() => {
                const t = templates[carouselIndex];
                return (
                  <div key={t.key} className="min-w-full">
                    <div className="bg-white">
                      {t.key !== 'custom' ? (
                        <div className="relative w-full md:h-[75vh] bg-gray-100 grid grid-cols-1 md:grid-cols-2 aspect-[4/3] sm:aspect-[16/9] md:aspect-auto">
                          {/* Template half */}
                          <div className="relative">
                            <Image src={t.image} alt={`${t.title} backdrop`} fill className="object-cover blur-2xl scale-110" />
                            <div className="absolute inset-0 flex items-stretch justify-center">
                              <div className="relative h-full w-full">
                                <Image src={t.image} alt={`${t.title} template`} fill sizes="50vw" className="object-contain" />
                              </div>
                            </div>
                            <div className="absolute inset-0 bg-black/15" />
                            <div className="absolute top-2 left-2 bg-white/90 text-gray-800 text-xs font-semibold px-2 py-1 rounded">Template</div>
                          </div>
                          {/* Example half */}
                          <div className="relative">
                            <Image src={templateExamples[t.key] || t.image} alt={`${t.title} example backdrop`} fill className="object-cover blur-2xl scale-110" />
                            <div className="absolute inset-0 flex items-stretch justify-center">
                              <div className="relative h-full w-full">
                                <Image src={templateExamples[t.key] || t.image} alt={`${t.title} example`} fill sizes="50vw" className="object-contain" />
                              </div>
                            </div>
                            <div className="absolute inset-0 bg-black/15" />
                            <div className="absolute top-2 left-2 bg-white/90 text-gray-800 text-xs font-semibold px-2 py-1 rounded">Example</div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full md:h-[75vh] bg-gray-100 grid grid-cols-1 md:grid-cols-2 gap-0">
                          {/* Templates mosaic */}
                          <div className="relative p-2 md:p-3">
                            <div className="absolute top-2 left-2 z-10 bg-white/90 text-gray-800 text-xs font-semibold px-2 py-1 rounded">Pick from any template</div>
                            <div className="grid grid-cols-5 md:grid-cols-6 gap-1 md:gap-2 h-full overflow-hidden">
                              {customGridImages.slice(0, 20).map((src, i) => (
                                <div key={i} className="relative w-full aspect-square overflow-hidden rounded bg-white/70">
                                  <Image src={src} alt="Template" fill className="object-cover" />
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Upload your own preview */}
                          <div className="relative flex items-center justify-center p-4">
                            <div className="absolute top-2 left-2 z-10 bg-white/90 text-gray-800 text-xs font-semibold px-2 py-1 rounded">Upload your photos</div>
                            <div className="relative w-2/3 sm:w-3/4 md:w-5/6 max-w-md aspect-[3/4] md:aspect-[4/5] rounded-xl overflow-hidden shadow-lg bg-white">
                              <Image src="/example-pics/colins-grampa-example.jpg" alt="Your photo" fill className="object-cover" />
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="p-6 text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h3>
                        <p className="text-gray-600 mb-4">{t.description}</p>
                        <Link href={t.href} className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold">{t.key === 'tshirts' ? 'Shop Shirts' : 'Customize'}</Link>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
            <button onClick={nextSlide} className="hidden md:inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow absolute right-0 top-1/2 -translate-y-1/2 z-10">›</button>

            {/* Mobile controls */}
            <div className="mt-4 flex md:hidden items-center justify-center gap-4">
              <button onClick={prevSlide} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow">‹</button>
              <button onClick={nextSlide} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow">›</button>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Calendar Promo */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl shadow p-8">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Try our new Custom Calendar!</h3>
            <p className="text-gray-700 max-w-3xl mx-auto mb-6">Pick from any of our template images or upload images of your own to make your own funny calendar!</p>
          </div>
          {/* 5x5 grid of sample templates */}
          <div className="mx-auto max-w-[700px] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3 mb-6">
            {customGridImages.slice(0, 25).map((src, idx) => (
              <div key={idx} className="relative aspect-square overflow-hidden rounded-lg bg-white/70">
                <Image src={src} alt="Template sample" fill className="object-cover" />
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/calendar-templates" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold">Start Customizing →</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Why Choose FunnyCal?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Perfect Gag Gifts</h3>
              <p className="text-gray-600">Guaranteed to get laughs and create memorable moments for any occasion</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">High-Quality Prints</h3>
              <p className="text-gray-600">Professional printing on premium materials that last year after year</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Fast Delivery</h3>
              <p className="text-gray-600">Quick turnaround times so you can surprise someone special soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">FunnyCal LLC</h3>
          <p className="text-gray-400 mb-6">Creating laughter, one face swap at a time</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/calendar-templates" className="hover:text-orange-400 transition-colors">Calendar Templates</Link>
            <Link href="/shirts" className="hover:text-orange-400 transition-colors">Shirts</Link>
            <Link href="/contact" className="hover:text-orange-400 transition-colors">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}


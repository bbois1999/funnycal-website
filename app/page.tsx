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

export default function Home() {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [currentSwappedImage, setCurrentSwappedImage] = useState(0);

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    const swappedInterval = setInterval(() => {
      setCurrentSwappedImage((prev) => (prev + 1) % swappedExamples.length);
    }, 3000);

    return () => {
      clearInterval(heroInterval);
      clearInterval(swappedInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Gallery */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentHeroImage ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image}
                alt="Happy customer"
                fill
                className="object-cover object-center"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 drop-shadow-lg">
            Funny<span className="text-orange-400">Cal</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-md">
            Create Hilarious Personalized Calendars & Shirts
          </p>
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto drop-shadow-md">
            Face swap your family and friends onto funny pictures for the perfect gag gifts that'll have everyone laughing!
          </p>
          <Link
            href="#how-it-works"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            See How It Works ↓
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We take your face and magically swap it onto hilarious scenes to create 
              personalized calendars and shirts that make perfect gag gifts!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 items-center">
            {/* Original Face */}
            <div className="text-center">
              <div className="relative w-64 h-64 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                <Image
                  src="/example-pics/colins-grampa-example.jpg"
                  alt="Original face example"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                1. Send Us Your Photo
              </h3>
              <p className="text-gray-600">
                Upload a clear photo of the person's face you want to use
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex justify-center">
              <div className="text-6xl text-orange-500 animate-bounce">
                →
              </div>
            </div>

            {/* Face Swapped Results */}
            <div className="text-center">
              <div className="relative w-64 h-64 mx-auto mb-6 rounded-lg overflow-hidden shadow-lg">
                {swappedExamples.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentSwappedImage ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src={image}
                      alt="Face swapped example"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                2. We Work Our Magic
              </h3>
              <p className="text-gray-600">
                Your face gets swapped onto funny scenes and printed on calendars or shirts
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              The Result? Pure Comedy Gold! 🎭
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether it's birthdays, holidays, or just because - our personalized 
              calendars and shirts create unforgettable moments and endless laughter.
            </p>
            
            <Link
              href="/calendar-templates"
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-12 py-4 rounded-full text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Browse Calendar Templates
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Why Choose FunnyCal?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Perfect Gag Gifts
              </h3>
              <p className="text-gray-600">
                Guaranteed to get laughs and create memorable moments for any occasion
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                High-Quality Prints
              </h3>
              <p className="text-gray-600">
                Professional printing on premium materials that last year after year
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Fast Delivery
              </h3>
              <p className="text-gray-600">
                Quick turnaround times so you can surprise someone special soon
              </p>
            </div>
          </div>
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

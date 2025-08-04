"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";

// Types
interface Template {
  name: string;
  description: string;
  price: string;
  templateImages: string[];
  exampleImages: string[];
  features: string[];
}

interface ProductType {
  title: string;
  description: string;
  basePrice: number;
  templates: Record<string, Template>;
}

// Product data - this could eventually come from a database or API
const productData: Record<string, ProductType> = {
  calendar: {
    title: "Calendar",
    description: "12-month personalized calendars with your face swapped onto hilarious scenes",
    basePrice: 24.99,
    templates: {
      swimsuit: {
        name: "Swimsuit Calendar",
        description: "Beach body ready! Put your face on stunning swimsuit models throughout the year.",
        price: "$24.99",
        templateImages: [
          "/template-images/swimsuit/1S.png",
          "/template-images/swimsuit/2S.png",
          "/template-images/swimsuit/3S.png",
          "/template-images/swimsuit/4S.png",
          "/template-images/swimsuit/5S.png",
          "/template-images/swimsuit/6S.png",
          "/template-images/swimsuit/7S.png",
          "/template-images/swimsuit/8S.png",
          "/template-images/swimsuit/9S.png",
          "/template-images/swimsuit/10S.png",
          "/template-images/swimsuit/11S.png",
          "/template-images/swimsuit/12S.png"
        ],
        exampleImages: [
          "/template-examples/swimsuit/swapped_1S.png",
          "/template-examples/swimsuit/swapped_6S.png",
          "/template-examples/swimsuit/swapped_9S.png",
          "/template-examples/swimsuit/swapped_10S.png"
        ],
        features: ["12 months", "High-quality print", "Spiral bound", "8.5x11 inches", "Premium glossy finish"]
      },
      superhero: {
        name: "Superhero Calendar",
        description: "Become the hero you were meant to be with iconic superhero poses throughout the year.",
        price: "$29.99",
        templateImages: [
          "/template-images/superhero/1superman.png",
          "/template-images/superhero/2ironman.png",
          "/template-images/superhero/3captainamerica.png",
          "/template-images/superhero/4thor.png",
          "/template-images/superhero/5doctorstrange.png",
          "/template-images/superhero/6aquaman.png",
          "/template-images/superhero/7hulk.png",
          "/template-images/superhero/8spiderman.png",
          "/template-images/superhero/9wolverine.png",
          "/template-images/superhero/10greenlantern.png",
          "/template-images/superhero/11blackpanther.png",
          "/template-images/superhero/12batman.png"
        ],
        exampleImages: [
          "/template-examples/superhero/swapped_1superman.png",
          "/template-examples/superhero/swapped_2ironman.png",
          "/template-examples/superhero/swapped_3captainamerica.png",
          "/template-examples/superhero/swapped_12batman.png",
          "/template-examples/superhero/swapped_5doctorstrange.png"
        ],
        features: ["12 months", "Action-packed scenes", "Comic book style", "8.5x11 inches", "Superhero themes"]
      },
      memes: {
        name: "Meme Calendar",
        description: "Internet famous! Your face on the world's funniest memes throughout the year.",
        price: "$22.99",
        templateImages: [
          "/template-images/meme/1fourseasonsorlando.png",
          "/template-images/meme/2sendittomerachel.png",
          "/template-images/meme/3sideyechloe.png",
          "/template-images/meme/4hideYoKids.png",
          "/template-images/meme/5youKnowIHadtodoittoem.png",
          "/template-images/meme/6gavin.png",
          "/template-images/meme/7caniborrow.png",
          "/template-images/meme/8photogenicGuy.png",
          "/template-images/meme/9holdingfart.png",
          "/template-images/meme/10ermagerd.png",
          "/template-images/meme/11deeznuts.png",
          "/template-images/meme/12screamingliberal.png"
        ],
        exampleImages: [
          "/template-examples/memes/swapped_1fourseasonsorlando.png",
          "/template-examples/memes/swapped_4hideYoKids.png",
          "/template-examples/memes/swapped_5youKnowIHadtodoittoem.png",
          "/template-examples/memes/swapped_7caniborrow.png",
          "/template-examples/memes/swapped_9holdingfart.png"
        ],
        features: ["12 months", "Viral meme templates", "Internet comedy gold", "8.5x11 inches", "Trending memes"]
      },
      junkies: {
        name: "Adrenaline Junkies Calendar",
        description: "Extreme sports and death-defying stunts - safely from your calendar.",
        price: "$26.99",
        templateImages: [
          "/template-images/junkies/1Sharks.png",
          "/template-images/junkies/2Skydive.png",
          "/template-images/junkies/3Skiier.png",
          "/template-images/junkies/4Bulls.png",
          "/template-images/junkies/5Parachute.png",
          "/template-images/junkies/6RockClimbing.png",
          "/template-images/junkies/7Skateboard.png",
          "/template-images/junkies/8Building.png",
          "/template-images/junkies/9Spelunking.png",
          "/template-images/junkies/10rollercoaster.png",
          "/template-images/junkies/11airsoft.png",
          "/template-images/junkies/12CliffJumping.png"
        ],
        exampleImages: [
          "/template-examples/junkies/swapped_1Sharks.png",
          "/template-examples/junkies/swapped_5Parachute.png",
          "/template-examples/junkies/swapped_6RockClimbing.png",
          "/template-examples/junkies/swapped_12CliffJumping.png"
        ],
        features: ["12 months", "Extreme sports", "Adventure scenes", "8.5x11 inches", "Adrenaline rush guaranteed"]
      },
      hunk: {
        name: "Firefighter Hunk Calendar",
        description: "Smoldering hot! Become the firefighter hunk of your dreams.",
        price: "$27.99",
        templateImages: [
          "/template-images/firefighter/1F.png",
          "/template-images/firefighter/2F.png",
          "/template-images/firefighter/3F.png",
          "/template-images/firefighter/4F.png",
          "/template-images/firefighter/5F.png",
          "/template-images/firefighter/6F.png",
          "/template-images/firefighter/7F.png",
          "/template-images/firefighter/8F.png",
          "/template-images/firefighter/9F.png",
          "/template-images/firefighter/10F.png",
          "/template-images/firefighter/11F.png",
          "/template-images/firefighter/12F.png"
        ],
        exampleImages: [
          "/template-examples/hunk/swapped_6F.png",
          "/template-examples/hunk/swapped_8F.png",
          "/template-examples/hunk/swapped_10F.png",
          "/template-examples/hunk/swapped_11F.png",
          "/template-examples/hunk/swapped_12F.png"
        ],
        features: ["12 months", "Heroic firefighter poses", "Steamy calendar", "8.5x11 inches", "Hot and heroic"]
      },
      holiday: {
        name: "Holiday Calendar",
        description: "Celebrate every season with festive holiday-themed face swaps.",
        price: "$25.99",
        templateImages: [
          "/template-images/holiday/1January.png",
          "/template-images/holiday/2February.png",
          "/template-images/holiday/3March.jpg",
          "/template-images/holiday/4April.png",
          "/template-images/holiday/5May.png",
          "/template-images/holiday/6June.png",
          "/template-images/holiday/7July.png",
          "/template-images/holiday/8August.png",
          "/template-images/holiday/9September.png",
          "/template-images/holiday/10October.png",
          "/template-images/holiday/11November.png",
          "/template-images/holiday/12December.png"
        ],
        exampleImages: [
          "/template-examples/holiday/swapped_1January.png",
          "/template-examples/holiday/swapped_4April.png",
          "/template-examples/holiday/swapped_5May.png"
        ],
        features: ["12 months", "Seasonal celebrations", "Holiday themes", "8.5x11 inches", "Year-round festivities"]
      },
      babies: {
        name: "Baby Calendar",
        description: "Adorably hilarious! Your face on cute baby bodies throughout the year.",
        price: "$23.99",
        templateImages: [
          "/template-images/baby/1JanuaryBaby.png",
          "/template-images/baby/2FebBaby.png",
          "/template-images/baby/3MarchBaby.png",
          "/template-images/baby/4AprilBaby.png",
          "/template-images/baby/5MayBaby.png",
          "/template-images/baby/6JuneBaby.png",
          "/template-images/baby/7JulyBaby.png",
          "/template-images/baby/8AugustBaby.png",
          "/template-images/baby/9SeptemberBaby.png",
          "/template-images/baby/10OctoberBaby.png",
          "/template-images/baby/11NovemberBaby.png",
          "/template-images/baby/12DecemberBaby.png"
        ],
        exampleImages: [
          "/template-examples/babies/swapped_6JuneBaby.png",
          "/template-examples/babies/swapped_7JulyBaby.png",
          "/template-examples/babies/swapped_11NovemberBaby.png"
        ],
        features: ["12 months", "Adorable baby scenes", "Cute and funny", "8.5x11 inches", "Guaranteed aww factor"]
      }
    }
  },
  // Future product types can be added here
  shirt: {
    title: "T-Shirt",
    description: "Hilarious face-swapped t-shirts for maximum comedy impact",
    basePrice: 19.99,
    templates: {
      // T-shirt templates would go here when available
    }
  }
};

export default function ProductPage({ 
  params 
}: { 
  params: { type: string; template: string } 
}) {
  const [currentTemplateImage, setCurrentTemplateImage] = useState(0);
  const [currentExampleImage, setCurrentExampleImage] = useState(0);
  const [hasInteractedWithTemplate, setHasInteractedWithTemplate] = useState(false);
  const [hasInteractedWithExample, setHasInteractedWithExample] = useState(false);

  const productType = productData[params.type];
  const template = productType?.templates[params.template];

  // If product type or template doesn't exist, show 404
  if (!productType || !template) {
    notFound();
  }

  // TypeScript now knows these exist after the notFound check
  const validProductType = productType as ProductType;
  const validTemplate = template as Template;

  // Navigation functions
  const nextTemplateImage = () => {
    setCurrentTemplateImage((prev) => (prev + 1) % validTemplate.templateImages.length);
    setHasInteractedWithTemplate(true);
  };

  const prevTemplateImage = () => {
    setCurrentTemplateImage((prev) => 
      prev === 0 ? validTemplate.templateImages.length - 1 : prev - 1
    );
    setHasInteractedWithTemplate(true);
  };

  const goToTemplateImage = (index: number) => {
    setCurrentTemplateImage(index);
    setHasInteractedWithTemplate(true);
  };

  const nextExampleImage = () => {
    setCurrentExampleImage((prev) => (prev + 1) % validTemplate.exampleImages.length);
    setHasInteractedWithExample(true);
  };

  const prevExampleImage = () => {
    setCurrentExampleImage((prev) => 
      prev === 0 ? validTemplate.exampleImages.length - 1 : prev - 1
    );
    setHasInteractedWithExample(true);
  };

  const goToExampleImage = (index: number) => {
    setCurrentExampleImage(index);
    setHasInteractedWithExample(true);
  };

  // Optional: Auto-advance after user inactivity
  useEffect(() => {
    const templateInterval = setInterval(() => {
      setCurrentTemplateImage((prev) => (prev + 1) % validTemplate.templateImages.length);
    }, 8000); // Slower auto-advance to give users time to click

    const exampleInterval = setInterval(() => {
      setCurrentExampleImage((prev) => (prev + 1) % validTemplate.exampleImages.length);
    }, 8000);

    return () => {
      clearInterval(templateInterval);
      clearInterval(exampleInterval);
    };
  }, [validTemplate]);

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
              <Link href="/calendar-templates" className="text-gray-600 hover:text-orange-500 transition-colors">
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

      {/* Breadcrumb */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
                     <nav className="text-sm">
             <Link href="/" className="text-gray-500 hover:text-orange-500">Home</Link>
             <span className="mx-2 text-gray-400">/</span>
             <Link href={`/${params.type}-templates`} className="text-gray-500 hover:text-orange-500">
               {validProductType.title} Templates
             </Link>
             <span className="mx-2 text-gray-400">/</span>
             <span className="text-gray-800">{validTemplate.name}</span>
           </nav>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Template Gallery */}
            <div className="space-y-6">
                             <div>
                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Template Preview</h2>
                 <div className="relative h-96 bg-white rounded-lg shadow-lg overflow-hidden group">
                   {/* Image Gallery */}
                   {validTemplate.templateImages.map((image, index) => (
                     <div
                       key={index}
                       className={`absolute inset-0 transition-opacity duration-500 cursor-pointer ${
                         index === currentTemplateImage ? "opacity-100" : "opacity-0"
                       }`}
                       onClick={nextTemplateImage}
                     >
                       {/* Blurred background */}
                       <Image
                         src={image}
                         alt=""
                         fill
                         className="object-cover blur-lg scale-110"
                       />
                       {/* Main image - full visibility */}
                       <Image
                         src={image}
                         alt={`${validTemplate.name} template ${index + 1}`}
                         fill
                         className="object-contain z-10 relative"
                       />
                     </div>
                   ))}
                   
                   {/* Navigation Buttons */}
                   <button
                     onClick={(e) => { e.stopPropagation(); prevTemplateImage(); }}
                     className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
                   >
                     ←
                   </button>
                   <button
                     onClick={(e) => { e.stopPropagation(); nextTemplateImage(); }}
                     className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
                   >
                     →
                   </button>
                   
                   {/* Image Counter */}
                   <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm z-20">
                     {(currentTemplateImage + 1)} of {validTemplate.templateImages.length}
                   </div>
                   
                   {/* Click to advance instruction */}
                   {!hasInteractedWithTemplate && (
                     <div className="absolute top-4 right-4 bg-orange-500/90 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                       Click to browse
                     </div>
                   )}
                 </div>
                 
                 {/* Dot Navigation */}
                 <div className="flex justify-center mt-4 space-x-2">
                   {validTemplate.templateImages.map((_, index) => (
                     <button
                       key={index}
                       onClick={() => goToTemplateImage(index)}
                       className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                         index === currentTemplateImage 
                           ? "bg-orange-500" 
                           : "bg-gray-300 hover:bg-gray-400"
                       }`}
                     />
                   ))}
                 </div>
               </div>

                             {/* Example Results */}
               <div>
                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Face Swap Examples</h2>
                 <div className="relative h-96 bg-white rounded-lg shadow-lg overflow-hidden group">
                   {/* Image Gallery */}
                   {validTemplate.exampleImages.map((image, index) => (
                     <div
                       key={index}
                       className={`absolute inset-0 transition-opacity duration-500 cursor-pointer ${
                         index === currentExampleImage ? "opacity-100" : "opacity-0"
                       }`}
                       onClick={nextExampleImage}
                     >
                       {/* Blurred background */}
                       <Image
                         src={image}
                         alt=""
                         fill
                         className="object-cover blur-lg scale-110"
                       />
                       {/* Main image - full visibility */}
                       <Image
                         src={image}
                         alt={`${validTemplate.name} example ${index + 1}`}
                         fill
                         className="object-contain z-10 relative"
                       />
                     </div>
                   ))}
                   
                   {/* Navigation Buttons */}
                   <button
                     onClick={(e) => { e.stopPropagation(); prevExampleImage(); }}
                     className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
                   >
                     ←
                   </button>
                   <button
                     onClick={(e) => { e.stopPropagation(); nextExampleImage(); }}
                     className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
                   >
                     →
                   </button>
                   
                   {/* Image Counter */}
                   <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm z-20">
                     {(currentExampleImage + 1)} of {validTemplate.exampleImages.length}
                   </div>
                   
                   {/* Click to advance instruction */}
                   {!hasInteractedWithExample && (
                     <div className="absolute top-4 right-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                       Click to browse
                     </div>
                   )}
                 </div>
                 
                 {/* Dot Navigation */}
                 <div className="flex justify-center mt-4 space-x-2">
                   {validTemplate.exampleImages.map((_, index) => (
                     <button
                       key={index}
                       onClick={() => goToExampleImage(index)}
                       className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                         index === currentExampleImage 
                           ? "bg-green-500" 
                           : "bg-gray-300 hover:bg-gray-400"
                       }`}
                     />
                   ))}
                 </div>
               </div>
            </div>

            {/* Product Info */}
                         <div className="space-y-6">
               <div>
                 <h1 className="text-4xl font-bold text-gray-800 mb-4">{validTemplate.name}</h1>
                 <p className="text-xl text-gray-600 mb-6">{validTemplate.description}</p>
                 <div className="text-3xl font-bold text-orange-500 mb-6">{validTemplate.price}</div>
               </div>

               {/* Features */}
               <div className="bg-white rounded-lg p-6 shadow-lg">
                 <h3 className="text-xl font-bold text-gray-800 mb-4">What's Included:</h3>
                 <ul className="space-y-2">
                   {validTemplate.features.map((feature, index) => (
                     <li key={index} className="flex items-center">
                       <span className="text-orange-500 mr-3 text-lg">✓</span>
                       <span className="text-gray-700">{feature}</span>
                     </li>
                   ))}
                 </ul>
               </div>

                             {/* Order Process */}
               <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                 <h3 className="text-xl font-bold text-orange-800 mb-4">How It Works:</h3>
                 <ol className="space-y-2 text-orange-700">
                   <li className="flex items-start">
                     <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                     <span>Click "Try Face Swap Now" to start the process</span>
                   </li>
                   <li className="flex items-start">
                     <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                     <span>Upload a clear, high-quality photo of your face</span>
                   </li>
                   <li className="flex items-start">
                     <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                     <span>See your face swap instantly, then order your personalized {validProductType.title.toLowerCase()}!</span>
                   </li>
                 </ol>
               </div>

                             {/* CTA Buttons */}
               <div className="space-y-4">
                 <Link
                   href={`/face-swap/${params.type}/${params.template}`}
                   className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-lg text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl text-center block"
                 >
                   Try Face Swap Now - {validTemplate.price}
                 </Link>
                 <Link
                   href={`/${params.type}-templates`}
                   className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors duration-300 text-center block"
                 >
                   ← Back to {validProductType.title} Templates
                 </Link>
               </div>
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
            <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <Link href="/calendar-templates" className="hover:text-orange-400 transition-colors">Calendar Templates</Link>
            <Link href="/shirts" className="hover:text-orange-400 transition-colors">Shirts</Link>
            <Link href="/contact" className="hover:text-orange-400 transition-colors">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 
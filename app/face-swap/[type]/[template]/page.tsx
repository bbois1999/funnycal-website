"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { notFound } from "next/navigation";

// Same product data structure (could be extracted to a shared file later)
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
        templateImages: ["/template-images/swimsuit/1S.png"],
        exampleImages: ["/template-examples/swimsuit/swapped_1S.png"],
        features: ["12 months", "High-quality print", "Spiral bound", "8.5x11 inches", "Premium glossy finish"]
      },
      superhero: {
        name: "Superhero Calendar",
        description: "Become the hero you were meant to be with iconic superhero poses throughout the year.",
        price: "$29.99", 
        templateImages: ["/template-images/superhero/1superman.png"],
        exampleImages: ["/template-examples/superhero/swapped_1superman.png"],
        features: ["12 months", "Action-packed scenes", "Comic book style", "8.5x11 inches", "Superhero themes"]
      },
      memes: {
        name: "Meme Calendar",
        description: "Internet famous! Your face on the world's funniest memes throughout the year.",
        price: "$22.99",
        templateImages: ["/template-images/meme/1fourseasonsorlando.png"],
        exampleImages: ["/template-examples/memes/swapped_1fourseasonsorlando.png"],
        features: ["12 months", "Viral meme templates", "Internet comedy gold", "8.5x11 inches", "Trending memes"]
      },
      junkies: {
        name: "Adrenaline Junkies Calendar",
        description: "Extreme sports and death-defying stunts - safely from your calendar.",
        price: "$26.99",
        templateImages: ["/template-images/junkies/1Sharks.png"],
        exampleImages: ["/template-examples/junkies/swapped_1Sharks.png"],
        features: ["12 months", "Extreme sports", "Adventure scenes", "8.5x11 inches", "Adrenaline rush guaranteed"]
      },
      hunk: {
        name: "Firefighter Hunk Calendar",
        description: "Smoldering hot! Become the firefighter hunk of your dreams.",
        price: "$27.99",
        templateImages: ["/template-images/firefighter/1F.png"],
        exampleImages: ["/template-examples/hunk/swapped_6F.png"],
        features: ["12 months", "Heroic firefighter poses", "Steamy calendar", "8.5x11 inches", "Hot and heroic"]
      },
      holiday: {
        name: "Holiday Calendar",
        description: "Celebrate every season with festive holiday-themed face swaps.",
        price: "$25.99",
        templateImages: ["/template-images/holiday/1January.png"],
        exampleImages: ["/template-examples/holiday/swapped_1January.png"],
        features: ["12 months", "Seasonal celebrations", "Holiday themes", "8.5x11 inches", "Year-round festivities"]
      },
      babies: {
        name: "Baby Calendar",
        description: "Adorably hilarious! Your face on cute baby bodies throughout the year.",
        price: "$23.99",
        templateImages: ["/template-images/baby/1JanuaryBaby.png"],
        exampleImages: ["/template-examples/babies/swapped_6JuneBaby.png"],
        features: ["12 months", "Adorable baby scenes", "Cute and funny", "8.5x11 inches", "Guaranteed aww factor"]
      }
    }
  }
};

export default function FaceSwapPage({ 
  params 
}: { 
  params: { type: string; template: string } 
}) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSwapButton, setShowSwapButton] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapResults, setSwapResults] = useState<string[]>([]);
  const [swapError, setSwapError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const productType = productData[params.type];
  const template = productType?.templates[params.template];

  if (!productType || !template) {
    notFound();
  }

  const validProductType = productType as ProductType;
  const validTemplate = template as Template;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true);
      setSwapResults([]);
      setSwapError(null);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setTimeout(() => {
          setUploadedImage(e.target?.result as string);
          setUploadedFile(file);
          setIsUploading(false);
          setTimeout(() => {
            setShowSwapButton(true);
          }, 500);
        }, 1000); // Simulate processing time
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSwapNow = async () => {
    if (!uploadedFile) {
      setSwapError("No file uploaded");
      return;
    }

    setIsSwapping(true);
    setSwapError(null);
    setSwapResults([]);

    try {
      const formData = new FormData();
      formData.append('photo', uploadedFile);
      formData.append('template', params.template);

      const response = await fetch('/api/face-swap', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setSwapResults(result.output_files || []);
      } else {
        setSwapError(result.error || 'Face swap failed');
      }
    } catch (error) {
      console.error('Face swap error:', error);
      setSwapError('Failed to process face swap. Please try again.');
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-red-50">
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
            <Link href={`/product/${params.type}/${params.template}`} className="text-gray-500 hover:text-orange-500">
              {validTemplate.name}
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-800">Face Swap</span>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              🎭 Face Swap Magic
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Create your personalized <span className="font-bold text-orange-600">{validTemplate.name}</span>
            </p>
            <p className="text-lg text-gray-500">
              Upload your photo and see the magic happen instantly!
            </p>
          </div>

                     {/* Upload Section - Top */}
           <div className="max-w-2xl mx-auto mb-16">
             <div className="text-center">
               <h2 className="text-3xl font-bold text-gray-800 mb-6">Upload Your Photo</h2>
               
               {/* Upload Area */}
               <div className="relative">
                 <input
                   ref={fileInputRef}
                   type="file"
                   accept="image/*"
                   onChange={handleFileUpload}
                   className="hidden"
                 />
                 
                 {!uploadedImage ? (
                   <div 
                     onClick={handleUploadClick}
                     className="border-2 border-dashed border-orange-300 rounded-lg p-12 cursor-pointer hover:border-orange-500 transition-colors duration-300 bg-white shadow-lg"
                   >
                     <div className="text-center">
                       <div className="text-8xl mb-6">📸</div>
                       <h3 className="text-2xl font-bold text-gray-800 mb-4">
                         Choose Your Photo
                       </h3>
                       <p className="text-gray-600 mb-6 text-lg">
                         Upload a clear photo of your face for the best results
                       </p>
                       <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10 py-4 rounded-full font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                         📷 Upload Photo
                       </button>
                     </div>
                   </div>
                 ) : (
                   <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md mx-auto">
                     <div className="relative h-80">
                       <Image
                         src={uploadedImage}
                         alt="Your uploaded photo"
                         fill
                         className="object-cover"
                       />
                       <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full font-bold">
                         ✓ Uploaded
                       </div>
                     </div>
                   </div>
                 )}

                 {/* Loading Animation */}
                 {isUploading && (
                   <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-lg">
                     <div className="text-center">
                       <div className="animate-spin text-6xl mb-4">⭐</div>
                       <p className="text-xl font-semibold text-gray-800">Processing your photo...</p>
                     </div>
                   </div>
                 )}
               </div>

                             {/* Swap Button */}
              {showSwapButton && !isSwapping && swapResults.length === 0 && (
                <div className="mt-8 animate-bounce">
                  <button
                    onClick={handleSwapNow}
                    disabled={isSwapping}
                    className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white py-6 rounded-full text-3xl font-bold transition-all duration-500 transform hover:scale-105 shadow-2xl animate-pulse disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🎭 SWAP NOW! ✨
                  </button>
                </div>
              )}

              {/* Processing State */}
              {isSwapping && (
                <div className="mt-8 text-center">
                  <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="animate-spin text-6xl mb-4">🎭</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Creating Your Magic...
                    </h3>
                    <p className="text-gray-600">
                      This may take a few moments while we swap your face onto all templates
                    </p>
                    <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {swapError && (
                <div className="mt-8">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-4">❌</div>
                    <h3 className="text-xl font-bold text-red-800 mb-2">
                      Oops! Something went wrong
                    </h3>
                    <p className="text-red-600 mb-4">{swapError}</p>
                    <button
                      onClick={() => {
                        setSwapError(null);
                        setShowSwapButton(true);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
             </div>
           </div>

           {/* Results Display */}
           {swapResults.length > 0 && (
             <div className="mb-16">
               {/* Exciting Success Animation */}
               <div className="text-center mb-12 animate-pulse">
                 <div className="text-8xl mb-6 animate-bounce">🎉</div>
                 <div className="text-6xl mb-4 animate-spin">✨</div>
                 <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-6 animate-pulse">
                   FACE SWAP COMPLETE!
                 </h2>
                 <div className="text-3xl mb-4">🎭 ⭐ 🔥 ⭐ 🎭</div>
                 <p className="text-2xl text-gray-700 font-semibold mb-4">
                   Your face has been magically swapped onto all {swapResults.length} templates!
                 </p>
                 <div className="text-xl text-gray-600 mb-8">
                   Check out your hilarious {validTemplate.name} transformations below!
                 </div>
                 <div className="flex justify-center space-x-4 text-4xl animate-bounce">
                   <span className="animate-pulse">🚀</span>
                   <span className="animate-pulse delay-100">💫</span>
                   <span className="animate-pulse delay-200">🎊</span>
                   <span className="animate-pulse delay-300">🌟</span>
                   <span className="animate-pulse delay-500">🎈</span>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {swapResults.map((imagePath, index) => (
                   <div key={index} className="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                     <div className="relative h-64">
                       <Image
                         src={imagePath}
                         alt={`Face swap result ${index + 1}`}
                         fill
                         className="object-cover"
                       />
                       <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                         #{index + 1}
                       </div>
                     </div>
                     <div className="p-4 text-center">
                       <p className="text-gray-600 text-sm">
                         Face Swap Result {index + 1}
                       </p>
                     </div>
                   </div>
                 ))}
               </div>

               {/* Action Buttons */}
               <div className="text-center mt-8 space-y-4">
                 <button
                   onClick={() => {
                     setSwapResults([]);
                     setShowSwapButton(true);
                   }}
                   className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors mr-4"
                 >
                   🔄 Try Another Photo
                 </button>
                 <Link
                   href={`/product/${params.type}/${params.template}`}
                   className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                 >
                   🛒 Order This Calendar
                 </Link>
               </div>
             </div>
           )}

           {/* Template & Example Side by Side - Bottom */}
           <div className="grid lg:grid-cols-2 gap-12">
             {/* Template Preview */}
             <div className="text-center">
               <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Template</h2>
               <div className="relative h-96 bg-white rounded-lg shadow-xl overflow-hidden">
                 {/* Blurred background */}
                 <Image
                   src={validTemplate.templateImages[0]}
                   alt=""
                   fill
                   className="object-cover blur-lg scale-110"
                 />
                 {/* Main image */}
                 <Image
                   src={validTemplate.templateImages[0]}
                   alt={validTemplate.name}
                   fill
                   className="object-contain z-10 relative"
                 />
                 <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full font-bold">
                   {validTemplate.price}
                 </div>
               </div>
             </div>

             {/* Example Result */}
             <div className="text-center">
               <h2 className="text-2xl font-bold text-gray-800 mb-4">Preview: What You'll Get</h2>
               <div className="relative h-96 bg-white rounded-lg shadow-xl overflow-hidden">
                 {/* Blurred background */}
                 <Image
                   src={validTemplate.exampleImages[0]}
                   alt=""
                   fill
                   className="object-cover blur-lg scale-110"
                 />
                 {/* Main image */}
                 <Image
                   src={validTemplate.exampleImages[0]}
                   alt="Face swap example"
                   fill
                   className="object-contain z-10 relative"
                 />
                 <div className="absolute bottom-4 left-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-bold">
                   Example Result
                 </div>
               </div>
             </div>
           </div>

          {/* Back Button */}
          <div className="text-center mt-12">
            <Link
              href={`/product/${params.type}/${params.template}`}
              className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              ← Back to Product Details
            </Link>
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
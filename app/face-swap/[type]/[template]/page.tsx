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
  const [swapProgress, setSwapProgress] = useState(0);
  const [swapResults, setSwapResults] = useState<string[]>([]);
  const [swapError, setSwapError] = useState<string | null>(null);
  const [swapFailures, setSwapFailures] = useState<Array<{ file: string; reason: string; message: string }>>([]);
  const [outputFolderId, setOutputFolderId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hideUploadedImage, setHideUploadedImage] = useState(false);
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

  const addToCart = () => {
    if (!outputFolderId) return;
    
    const cartItem = {
      id: Date.now().toString(),
      type: params.type,
      template: params.template,
      templateName: validTemplate.name,
      price: validTemplate.price,
      outputFolderId: outputFolderId,
      imageCount: swapResults.length,
      swapImages: swapResults.slice(0, 6), // Store first 6 face swap images for preview
      templateImage: validTemplate.templateImages[0]
    };

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('funnycal-cart') || '[]');
    existingCart.push(cartItem);
    localStorage.setItem('funnycal-cart', JSON.stringify(existingCart));
    
    // Item will be reflected in cart count - no alert needed
  };

  const buyNow = () => {
    if (!outputFolderId) return;
    
    addToCart();
    window.location.href = '/cart';
  };

  const handleSwapNow = async () => {
    if (!uploadedFile) {
      setSwapError("No file uploaded");
      return;
    }

    setIsSwapping(true);
    setSwapError(null);
    setSwapResults([]);
    setSwapFailures([]);
    setSwapProgress(0);

    // Simulate progress animation
    const progressInterval = setInterval(() => {
      setSwapProgress(prev => {
        if (prev >= 95) return prev; // Stop at 95% until actual completion
        return prev + Math.random() * 15; // Random incremental progress
      });
    }, 500);

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
        setSwapProgress(100); // Complete the progress
        setTimeout(() => {
          // First, fade out the uploaded image
          setHideUploadedImage(true);
          setTimeout(() => {
            // Then set results and show success message with fade in
            setSwapResults(result.output_files || []);
            setSwapFailures(result.failures || []);
            if (result.output_folder_id) {
              setOutputFolderId(result.output_folder_id);
            }
            setShowSuccess(true);
            // Smooth scroll to top to show success message
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
          }, 300); // Wait for image fade out
        }, 300); // Small delay to show 100% completion
      } else {
        setSwapFailures(result.failures || []);
        // Only show generic error if no specific failures are provided
        if (!result.failures || result.failures.length === 0) {
          setSwapError(result.error || 'Face swap failed');
        }
      }
    } catch (error) {
      console.error('Face swap error:', error);
      setSwapError('Failed to process face swap. Please try again.');
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsSwapping(false);
        setSwapProgress(0);
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-red-50">
      {/* Header */}
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
      <section className="py-6 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
              🎭 Face Swap Magic
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-2">
              Create your personalized <span className="font-bold text-orange-600">{validTemplate.name}</span>
            </p>
            <p className="text-base md:text-lg text-gray-500">
              Upload your photo and see the magic happen instantly!
            </p>
          </div>

                     {/* Upload Section - Top */}
           <div className="max-w-2xl mx-auto mb-8 md:mb-16">
             
             {/* Success Message - Positioned at Very Top */}
             {swapResults.length > 0 && (
               <div className={`mb-8 text-center transition-all duration-500 ${showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                 <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 md:p-6 shadow-lg">
                   <div className="text-4xl md:text-6xl mb-4 animate-bounce">🎉</div>
                   <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
                     FACE SWAP COMPLETE!
                   </h2>
                   <div className="text-xl md:text-2xl mb-3">🎭 ⭐ 🔥 ⭐ 🎭</div>
                   <p className="text-base md:text-lg text-gray-700 font-semibold mb-2">
                     Your face has been magically swapped onto all {swapResults.length} templates!
                   </p>
                   <p className="text-sm md:text-base text-gray-600">
                     Check out your hilarious {validTemplate.name} transformations below! ⬇️
                   </p>
                   <div className="flex justify-center space-x-2 text-xl md:text-2xl animate-bounce mt-4">
                     <span className="animate-pulse">🚀</span>
                     <span className="animate-pulse delay-100">💫</span>
                     <span className="animate-pulse delay-200">🎊</span>
                     <span className="animate-pulse delay-300">🌟</span>
                     <span className="animate-pulse delay-500">🎈</span>
                   </div>
                 </div>
               </div>
             )}

             <div className={`text-center transition-all duration-500 ${swapResults.length > 0 ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
               <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">Upload Your Photo</h2>
               
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
                       <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10 py-4 rounded-full font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg active:scale-95">
                         📷 Upload Photo
                       </button>
                     </div>
                   </div>
                 ) : (
                   <div className={`bg-white rounded-lg shadow-xl overflow-hidden max-w-md mx-auto transition-opacity duration-300 ${hideUploadedImage ? 'opacity-0' : 'opacity-100'}`}>
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
                    className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white py-6 rounded-full text-3xl font-bold transition-all duration-500 transform hover:scale-105 active:scale-95 shadow-2xl animate-pulse disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <p className="text-gray-600 mb-4">
                      This may take a few moments while we swap your face onto all templates
                    </p>
                    
                    {/* Enhanced Progress Bar */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-bold text-purple-600">{Math.round(swapProgress)}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 h-full rounded-full transition-all duration-500 ease-out relative"
                          style={{ width: `${swapProgress}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {swapProgress < 30 ? "Analyzing your face..." : 
                         swapProgress < 60 ? "Processing templates..." : 
                         swapProgress < 90 ? "Swapping faces..." : "Almost done!"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display - Only show generic error if no specific failures */}
              {swapError && swapFailures.length === 0 && (
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
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Face Detection Failures Display */}
              {swapFailures.length > 0 && (
                <div className="mt-8">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">⚠️</div>
                      <h3 className="text-xl font-bold text-amber-800 mb-2">
                        Some Images Need Attention
                      </h3>
                      <p className="text-amber-700">
                        These templates couldn't be processed due to face detection issues:
                      </p>
                    </div>
                    
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {swapFailures.map((failure, index) => (
                        <div key={index} className="bg-white border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
                          <div className="text-xl">
                            {failure.reason === 'no_face_detected' ? '👤' : '❌'}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">
                              {failure.file === 'source' ? 'Your Photo' : `Template: ${failure.file}`}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {failure.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 text-center">
                      <p className="text-sm text-amber-700 mb-3">
                        💡 <strong>Tips:</strong> Use clear, forward-facing photos with good lighting for best results
                      </p>
                      <button
                        onClick={() => {
                          setSwapFailures([]);
                          setSwapError(null);
                          setShowSwapButton(true);
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
                      >
                        Try Different Photo
                      </button>
                    </div>
                  </div>
                </div>
              )}
             </div>
           </div>

           {/* Results Display */}
           {swapResults.length > 0 && (
             <div className="mb-16">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                 {swapResults.map((imagePath, index) => (
                   <div key={index} className="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                     <div className="relative w-full aspect-[3/4]">
                       <Image
                         src={imagePath}
                         alt={`Face swap result ${index + 1}`}
                         fill
                         className="object-contain"
                       />
                       <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs md:text-sm font-bold">
                         #{index + 1}
                       </div>
                     </div>
                     <div className="p-3 md:p-4 text-center">
                       <p className="text-gray-600 text-xs md:text-sm">
                         Face Swap Result {index + 1}
                       </p>
                     </div>
                   </div>
                 ))}
               </div>

               {/* Action Buttons */}
               <div className="text-center mt-8 space-y-4">
                 <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                   <button
                     onClick={buyNow}
                     className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                   >
                     🛒 Buy Now - {validTemplate.price}
                   </button>
                   <button
                     onClick={addToCart}
                     className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                   >
                     ➕ Add to Cart & Keep Browsing
                   </button>
                 </div>
                 <button
                   onClick={() => {
                     setSwapResults([]);
                     setSwapFailures([]);
                     setSwapError(null);
                     setOutputFolderId(null);
                     setShowSuccess(false);
                     setHideUploadedImage(false);
                     setShowSwapButton(true);
                   }}
                   className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
                 >
                   🔄 Try Another Photo
                 </button>
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
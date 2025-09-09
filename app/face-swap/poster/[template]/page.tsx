"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../../../components/Header';
import { productData } from '../../../../lib/products';

interface FaceSwapPageProps {
  params: { template: string };
}

export default function PosterFaceSwapPage({ params }: FaceSwapPageProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapProgress, setSwapProgress] = useState(0);
  const [swapResult, setSwapResult] = useState<string | null>(null);
  const [watermarkedResult, setWatermarkedResult] = useState<string | null>(null);
  const [swapError, setSwapError] = useState<string | null>(null);
  const [swapFailures, setSwapFailures] = useState<Array<{ file: string; reason: string; message: string }>>([]);
  const [outputFolderId, setOutputFolderId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hideUploadedImage, setHideUploadedImage] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get template data
  const template = productData.poster.templates[params.template];
  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Template Not Found</h1>
          <Link href="/posters" className="text-orange-600 hover:text-orange-700">← Back to Posters</Link>
        </div>
      </div>
    );
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setUploadedImageUrl(url);
    setIsUploading(false);
    
    // Clear previous results
    setSwapResult(null);
    setWatermarkedResult(null);
    setSwapError(null);
    setSwapFailures([]);
    setShowSuccess(false);
    setHideUploadedImage(false);
  };

  const handleSwapNow = async () => {
    if (!uploadedFile) {
      setSwapError("No file uploaded");
      return;
    }

    setIsSwapping(true);
    setSwapProgress(0);
    setSwapError(null);
    setSwapFailures([]);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setSwapProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 500);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('template', template.templateImages[0]);

      const response = await fetch('/api/poster-face-swap', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setSwapProgress(100);
        setTimeout(() => {
          setHideUploadedImage(true);
          setTimeout(() => {
            setSwapResult(result.output_file);
            setWatermarkedResult(result.watermarked_file);
            if (result.output_folder_id) {
              setOutputFolderId(result.output_folder_id);
            }
            setShowSuccess(true);
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
          }, 300);
        }, 300);
      } else {
        setSwapFailures(result.failures || []);
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

  const addToCart = () => {
    if (!outputFolderId) return;

    const cartItem = {
      id: `poster-${params.template}-${Date.now()}`,
      type: 'poster',
      template: params.template,
      templateName: template.name,
      price: parseFloat(template.price.replace('$', '')),
      outputFolderId,
      customization: 'Face Swap',
      quantity: 1,
    };

    const existingCart = JSON.parse(localStorage.getItem('funnycal-cart') || '[]');
    existingCart.push(cartItem);
    localStorage.setItem('funnycal-cart', JSON.stringify(existingCart));
    
    // Update cart button
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-red-50">
      <Header />

      {/* Breadcrumb */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="text-sm">
            <Link href="/" className="text-gray-500 hover:text-orange-500">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/posters" className="text-gray-500 hover:text-orange-500">Posters</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-800">{template.name}</span>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Success Message - Positioned at Very Top */}
          {swapResult && (
            <div className={`mb-8 text-center transition-all duration-500 ${showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 md:p-6 shadow-lg">
                <div className="text-4xl md:text-6xl mb-4 animate-bounce">🎉</div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
                  POSTER DESIGN COMPLETE!
                </h2>
                <div className="text-xl md:text-2xl mb-3">🖼️ ⭐ 🔥 ⭐ 🖼️</div>
                <p className="text-base md:text-lg text-gray-700 font-semibold mb-2">
                  Your face has been perfectly placed on your {template.name}!
                </p>
                <p className="text-sm md:text-base text-gray-600">
                  Check out your amazing design below! ⬇️
                </p>
              </div>
            </div>
          )}

          {/* Upload Section */}
          <div className={`max-w-2xl mx-auto mb-8 md:mb-16 transition-all duration-500 ${swapResult ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">Upload Your Photo</h2>
              
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 md:p-12 bg-white hover:bg-gray-50 transition-colors">
                  {uploadedImageUrl ? (
                    <div className={`relative transition-opacity duration-300 ${hideUploadedImage ? 'opacity-0' : 'opacity-100'}`}>
                      <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto rounded-lg overflow-hidden">
                        <Image src={uploadedImageUrl} alt="Uploaded" fill className="object-cover" />
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full font-bold">
                          ✓ Uploaded
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-6xl mb-4">📷</div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">Upload Your Photo</h3>
                      <p className="text-gray-500 mb-4">Choose a clear photo of your face for the best results</p>
                      <div className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 inline-block">
                        Choose File
                      </div>
                    </div>
                  )}
                </div>

                {isUploading && (
                  <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin text-4xl mb-2">📷</div>
                      <p className="text-gray-600">Uploading...</p>
                    </div>
                  </div>
                )}
              </div>

              {uploadedFile && !isSwapping && !swapResult && (
                <div className="mt-8">
                  <button
                    onClick={handleSwapNow}
                    className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white py-6 rounded-full text-3xl font-bold transition-all duration-500 transform hover:scale-105 active:scale-95 shadow-2xl animate-pulse"
                  >
                    🖼️ SWAP FACE NOW! ✨
                  </button>
                </div>
              )}

              {isSwapping && (
                <div className="mt-8 text-center">
                  <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="animate-spin text-6xl mb-4">🖼️</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Creating Your Poster...</h3>
                    <p className="text-gray-600 mb-4">This may take a few moments while we perfect your design</p>
                    
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${swapProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500">Progress: {Math.round(swapProgress)}%</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Template Preview */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">You're customizing:</h3>
            <div className="bg-white rounded-xl shadow-lg p-6 inline-block">
              <div className="relative w-48 h-64 md:w-64 md:h-80 mx-auto">
                <Image src={template.templateImages[0]} alt={template.name} fill className="object-contain" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mt-4">{template.name}</h4>
              <p className="text-gray-600">{template.price}</p>
            </div>
          </div>

          {/* Error Display */}
          {swapError && swapFailures.length === 0 && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold mb-2">⚠️ Oops! Something went wrong</h3>
              <p className="text-red-700">{swapError}</p>
            </div>
          )}

          {/* Specific Failures Display */}
          {swapFailures.length > 0 && (
            <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-yellow-800 font-semibold mb-2">⚠️ No face detected</h3>
              <p className="text-yellow-700 mb-2">{swapFailures[0].message}</p>
              <p className="text-yellow-600 text-sm">Please try uploading a clearer photo with a visible face.</p>
            </div>
          )}

          {/* Results Display */}
          {swapResult && watermarkedResult && (
            <div className="mb-16">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative w-full aspect-[11/17] max-w-sm mx-auto">
                  <Image src={watermarkedResult} alt="Your custom poster" fill className="object-contain" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Your Custom {template.name}</h3>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={addToCart}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105"
                    >
                      🛒 Add to Cart - {template.price}
                    </button>
                    <Link
                      href="/cart"
                      className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 text-center"
                    >
                      💳 Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

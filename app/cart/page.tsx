"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface CartItem {
  id: string;
  type: string;
  template: string;
  templateName: string;
  price: string;
  outputFolderId: string;
  imageCount: number;
  swapImages?: string[];
  templateImage?: string;
}

// Function to get the correct image filename for each template
const getImageFileName = (template: string, index: number): string => {
  const templateMappings: Record<string, string[]> = {
    superhero: ['1superman', '2ironman', '3captainamerica', '4thor', '5doctorstrange', '6aquaman', '7hulk', '8spiderman', '9wolverine', '10greenlantern', '11blackpanther', '12batman'],
    swimsuit: ['1S', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', '11S', '12S'],
    hunk: ['1F', '2F', '3F', '4F', '5F', '6F', '7F', '8F', '9F', '10F', '11F', '12F'],
    firefighter: ['1F', '2F', '3F', '4F', '5F', '6F', '7F', '8F', '9F', '10F', '11F', '12F'],
    holiday: ['1January', '2February', '3March', '4April', '5May', '6June', '7July', '8August', '9September', '10October', '11November', '12December'],
    babies: ['1JanuaryBaby', '2FebruaryBaby', '3MarchBaby', '4AprilBaby', '5MayBaby', '6JuneBaby', '7JulyBaby', '8AugustBaby', '9SeptemberBaby', '10OctoberBaby', '11NovemberBaby', '12DecemberBaby'],
    baby: ['1JanuaryBaby', '2FebruaryBaby', '3MarchBaby', '4AprilBaby', '5MayBaby', '6JuneBaby', '7JulyBaby', '8AugustBaby', '9SeptemberBaby', '10OctoberBaby', '11NovemberBaby', '12DecemberBaby'],
    junkies: ['1Sharks', '2Bungee', '3Skydiving', '4RockClimbing', '5Surfing', '6MountainBike', '7Paragliding', '8WhiteWater', '9MotoCross', '10BasJump', '11FreeDiving', '12IceClimbing'],
    memes: ['1fourseasonsorlando', '2meme2', '3meme3', '4meme4', '5meme5', '6meme6', '7meme7', '8meme8', '9meme9', '10meme10', '11meme11', '12meme12']
  };
  
  const mapping = templateMappings[template] || templateMappings.swimsuit;
  return mapping[index] || mapping[0];
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewItem, setPreviewItem] = useState<CartItem | null>(null);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('funnycal-cart') || '[]');
    setCartItems(savedCart);
    setIsLoading(false);
  }, []);

  const removeFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('funnycal-cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('funnycal-cart', '[]');
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + price;
    }, 0).toFixed(2);
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) return;
    
    // Store cart in localStorage for checkout
    localStorage.setItem('funnycal-checkout', JSON.stringify(cartItems));
    window.location.href = '/checkout';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🛒</div>
          <p className="text-xl">Loading your cart...</p>
        </div>
      </div>
    );
  }

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
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            🛒 Your Shopping Cart
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">🛒</div>
              <h2 className="text-3xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
              <p className="text-xl text-gray-600 mb-8">
                Add some hilarious face-swapped calendars to get started!
              </p>
              <Link
                href="/calendar-templates"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                Browse Templates
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-8">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4">
                        {/* Template Image */}
                        <div className="flex items-start space-x-4 flex-1 mb-4 lg:mb-0">
                          <div className="flex-shrink-0">
                            <Image
                              src={item.templateImage || `/template-images/swimsuit/1S.png`}
                              alt={item.templateName}
                              width={120}
                              height={120}
                              className="rounded-lg object-cover shadow-md"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center mb-3">
                              <div className="text-2xl mr-3">📅</div>
                              <h3 className="text-2xl font-bold text-gray-800">
                                {item.templateName}
                              </h3>
                            </div>
                            <div className="flex items-center text-gray-600 mb-2">
                              <span className="text-lg mr-2">📸</span>
                              <span className="text-lg">
                                {item.imageCount} personalized face swaps included
                              </span>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                                Calendar Template
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">Price</div>
                            <div className="text-3xl font-bold text-green-600">
                              {item.price}
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-md"
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      </div>

                      {/* Face Swap Preview Images */}
                      {item.swapImages && item.swapImages.length > 0 && (
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-semibold text-gray-600 mb-3">Your Face Swap Preview:</h4>
                          <div className="flex items-center gap-1">
                            {item.swapImages.slice(0, 5).map((imageUrl, index) => (
                              <div key={index}>
                                <Image
                                  src={imageUrl}
                                  alt={`Face swap ${index + 1}`}
                                  width={80}
                                  height={80}
                                  className="rounded-md object-cover shadow-sm hover:shadow-md transition-shadow"
                                />
                              </div>
                            ))}
                            {item.imageCount > 5 && (
                              <div className="relative">
                                {/* Show 6th image if available, partially covered by button */}
                                {item.swapImages[5] && (
                                  <Image
                                    src={item.swapImages[5]}
                                    alt="Face swap 6"
                                    width={80}
                                    height={80}
                                    className="rounded-md object-cover shadow-sm opacity-60"
                                  />
                                )}
                                <button
                                  onClick={() => setPreviewItem(item)}
                                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 hover:bg-opacity-75 rounded-md text-white text-xs font-medium transition-all duration-200 hover:scale-105"
                                >
                                  <div className="text-center">
                                    <div className="text-lg mb-1">👁️</div>
                                    <div>+{item.imageCount - 5}</div>
                                    <div className="text-xs">more</div>
                                  </div>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg border border-green-100 p-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">
                    🛒 Order Summary
                  </h3>
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <div className="text-sm text-gray-600 mb-2">Total Amount</div>
                    <div className="text-4xl font-bold text-green-600">
                      ${calculateTotal()}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={proceedToCheckout}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-4 rounded-xl font-bold text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    🚀 Proceed to Checkout
                  </button>
                  <button
                    onClick={clearCart}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                  >
                    🗑️ Clear Cart
                  </button>
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="text-center mt-8">
                <Link
                  href="/calendar-templates"
                  className="text-orange-500 hover:text-orange-600 font-semibold text-lg transition-colors"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {previewItem.templateName} - Full Gallery Preview
              </h2>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* Show all face swap images */}
                {Array.from({ length: previewItem.imageCount }, (_, index) => (
                  <div key={index} className="group">
                    <Image
                      src={`/api/serve-image?folder=${previewItem.outputFolderId}/watermarked&file=swapped_${getImageFileName(previewItem.template, index)}.png`}
                      alt={`Face swap ${index + 1}`}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover shadow-md group-hover:shadow-xl transition-all duration-200 w-full h-auto"
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <button
                  onClick={() => setPreviewItem(null)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
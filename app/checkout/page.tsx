"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });

  useEffect(() => {
    // Load checkout items from localStorage
    const checkoutItems = JSON.parse(localStorage.getItem('funnycal-checkout') || '[]');
    setCartItems(checkoutItems);
    setIsLoading(false);
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + price;
    }, 0).toFixed(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderData = {
      items: cartItems,
      customer: customerInfo,
      total: calculateTotal(),
      orderDate: new Date().toISOString(),
      orderId: 'FC' + Date.now()
    };

    // Save order (in a real app, this would go to your backend)
    console.log('Order submitted:', orderData);
    
    // Clear cart and checkout data
    localStorage.removeItem('funnycal-cart');
    localStorage.removeItem('funnycal-checkout');
    
    // Show success message
    alert(`Order submitted successfully! Order ID: ${orderData.orderId}\n\nYour personalized calendars will be printed using the face swaps from your output folders and shipped to the provided address.`);
    
    // Redirect to home
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">💳</div>
          <p className="text-xl">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-gray-700 mb-4">No items to checkout</h2>
          <Link
            href="/cart"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            Back to Cart
          </Link>
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
            <div className="text-lg font-semibold text-gray-600">
              💳 Checkout
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            Complete Your Order
          </h1>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-3 border-b">
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.templateName}</h3>
                      <p className="text-sm text-gray-600">
                        📸 {item.imageCount} personalized face swaps
                      </p>
                    </div>
                    <div className="text-lg font-semibold text-green-600">
                      {item.price}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">${calculateTotal()}</span>
                </div>
              </div>
            </div>

            {/* Customer Information Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Information</h2>
              
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={customerInfo.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zip"
                      required
                      value={customerInfo.zip}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-bold text-xl transition-colors shadow-lg"
                  >
                    🚀 Place Order - ${calculateTotal()}
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center">
                <Link
                  href="/cart"
                  className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                >
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
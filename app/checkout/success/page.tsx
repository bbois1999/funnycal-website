"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  useEffect(() => {
    // Clear cart/local storage after successful payment
    localStorage.removeItem('funnycal-cart');
    localStorage.removeItem('funnycal-checkout');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-xl text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Payment Successful</h1>
        <p className="text-gray-600 mb-6">
          Thank you! We received your order. We'll produce your calendar using your face swap images and notify you via email when it's on the way.
        </p>
        <Link href="/" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

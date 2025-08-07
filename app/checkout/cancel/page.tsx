import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-xl text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Payment Canceled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was canceled. You can return to your cart to review your items or try again.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/cart" className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Back to Cart
          </Link>
          <Link href="/checkout" className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}

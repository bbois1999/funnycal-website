import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
      <div className="text-center px-4 max-w-2xl">
        <div className="text-8xl mb-6">🤔</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Oops! Template Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          We couldn't find that specific template. It might have been moved or doesn't exist yet.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link
            href="/calendar-templates"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
          >
            Browse Calendar Templates
          </Link>
          <Link
            href="/"
            className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
} 
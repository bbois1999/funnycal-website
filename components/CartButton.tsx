"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartButton() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const load = () => {
      try {
        const items = JSON.parse(localStorage.getItem('funnycal-cart') || '[]');
        setCount(Array.isArray(items) ? items.length : 0);
      } catch {
        setCount(0);
      }
    };

    load();

    // Update count if cart changes in other tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'funnycal-cart') load();
    };
    window.addEventListener('storage', onStorage);

    // Lightweight polling to catch in-tab updates
    const interval = setInterval(load, 1500);

    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      <Link
        href="/cart"
        className="relative flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-full shadow-lg transition-transform hover:scale-105"
        aria-label="Open cart"
      >
        <span className="text-lg">🛒</span>
        <span className="font-semibold">Cart</span>
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow">
            {count}
          </span>
        )}
      </Link>
    </div>
  );
}

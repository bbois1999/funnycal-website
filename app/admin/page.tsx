"use client";

import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // naive client check for cookie
    const match = document.cookie.match(/fc_admin=1/);
    if (match) {
      setAuthed(true);
      fetchOrders();
    }
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Login failed');
        return;
      }
      document.cookie = 'fc_admin=1; path=/; max-age=86400;';
      setAuthed(true);
      fetchOrders();
    } catch (e: any) {
      setError('Login failed');
    }
  }

  async function fetchOrders() {
    const res = await fetch('/api/admin/orders');
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders || []);
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
        <form onSubmit={login} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Login</h1>
          <p className="text-sm text-gray-600 mb-4">Enter the admin password to access orders.</p>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2 mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2 font-semibold">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-red-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders Dashboard</h1>
        <div className="bg-white rounded-xl shadow p-6">
          {orders.length === 0 ? (
            <p className="text-gray-600">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.orderId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Order: {o.orderId}</div>
                      <div className="text-sm text-gray-500">Placed: {new Date(o.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="text-sm text-gray-600">Status: {o.status}</div>
                  </div>
                  <div className="mt-3 text-sm text-gray-700">
                    <div><span className="font-semibold">Customer:</span> {o.customer?.name || 'N/A'} ({o.customer?.email || 'N/A'})</div>
                    {o.customer?.address && (
                      <div>
                        <span className="font-semibold">Address:</span> {o.customer.address.line1}, {o.customer.address.city}, {o.customer.address.state} {o.customer.address.postal_code}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <div className="font-semibold mb-2">Items</div>
                    <ul className="list-disc pl-5 text-sm">
                      {o.items?.map((it: any, idx: number) => (
                        <li key={idx}>Template: {it.templateName} — Folder: {it.outputFolderId}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-3 text-sm">
                    <a className="text-blue-600 underline" href={`/api/admin/order-files?order=${o.orderId}`} target="_blank" rel="noreferrer">Download order files (zip)</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

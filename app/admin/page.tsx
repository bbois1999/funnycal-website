"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Order = {
  orderId: string;
  status: 'placed' | 'new' | 'processing' | 'shipping' | 'complete';
  createdAt: string;
  updatedAt?: string;
  customer?: { name?: string; email?: string; address?: any };
  items?: { templateName: string; outputFolderId?: string }[];
};

const STATUS_LABELS: Record<Order['status'], string> = {
  placed: 'new',
  new: 'new',
  processing: 'processing',
  shipping: 'shipping',
  complete: 'complete',
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ today: number; week: number; month: number }>({ today: 0, week: 0, month: 0 });

  useEffect(() => {
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

  function computeStats(list: Order[]) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let today = 0, week = 0, month = 0;
    for (const o of list) {
      const t = new Date(o.createdAt).getTime();
      if (!isNaN(t)) {
        if (t >= startOfToday.getTime()) today += 1;
        if (t >= sevenDaysAgo.getTime()) week += 1;
        if (t >= startOfMonth.getTime()) month += 1;
      }
    }
    return { today, week, month };
  }

  async function fetchOrders() {
    const res = await fetch('/api/admin/orders');
    if (res.ok) {
      const data = await res.json();
      const list: Order[] = (data.orders || []).map((o: any) => ({
        ...o,
        status: STATUS_LABELS[(o.status as any) || 'new'] as Order['status'],
      }));
      setOrders(list);
      setStats(computeStats(list));
    }
  }

  function groupByStatus(list: Order[]) {
    const groups: Record<Order['status'], Order[]> = { new: [], processing: [], shipping: [], complete: [], placed: [] as any } as any;
    for (const o of list) {
      const st = STATUS_LABELS[o.status] as Order['status'];
      groups[st].push({ ...o, status: st });
    }
    return groups;
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

  const groups = groupByStatus(orders);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-red-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Orders Dashboard</h1>
          <button onClick={fetchOrders} className="bg-white/80 hover:bg-white text-gray-800 px-4 py-2 rounded-lg shadow">Refresh</button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-500">Today</div>
            <div className="text-3xl font-bold">{stats.today}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-500">Last 7 Days</div>
            <div className="text-3xl font-bold">{stats.week}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-500">This Month</div>
            <div className="text-3xl font-bold">{stats.month}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(['new', 'processing', 'shipping', 'complete'] as const).map((st) => (
            <div key={st} className="bg-white rounded-xl shadow p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold capitalize">{st}</h2>
                <span className="text-sm text-gray-500">{groups[st].length} orders</span>
              </div>
              <div className="space-y-3">
                {groups[st].map((o) => (
                  <div key={o.orderId} className="border rounded-lg p-3">
                    <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
                    <div className="font-semibold">{o.customer?.name || 'No name'} — {o.customer?.email || 'No email'}</div>
                    <div className="mt-2 flex gap-2">
                      <Link href={`/admin/orders/${o.orderId}`} className="bg-blue-500 hover:bg-blue-600 text-white text-sm rounded px-3 py-1">View</Link>
                      <a className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded px-3 py-1" href={`/api/admin/order-files?order=${o.orderId}`} target="_blank" rel="noreferrer">Download</a>
                    </div>
                  </div>
                ))}
                {groups[st].length === 0 && (
                  <div className="text-sm text-gray-500">No orders</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

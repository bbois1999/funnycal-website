"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function OrderDetailPage() {
  const params = useParams() as { id?: string };
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      const res = await fetch(`/api/admin/order/get?id=${orderId}`);
      const d = await res.json();
      if (res.ok) setOrder(d.order);
      else setError(d.error || 'Failed to load');
      setLoading(false);
    })();
  }, [orderId]);

  async function updateStatus(status: 'new' | 'processing' | 'shipping' | 'complete') {
    if (!order) return;
    setSaving(true);
    const res = await fetch('/api/admin/order/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: order.orderId, status }),
    });
    const d = await res.json();
    setSaving(false);
    if (res.ok) setOrder(d.order);
    else alert(d.error || 'Failed to update');
  }

  async function archive(deleteFiles: boolean) {
    if (!order) return;
    const ok = confirm(`Archive order ${order.orderId}?${deleteFiles ? ' This will delete the copied order files.' : ''}`);
    if (!ok) return;
    const res = await fetch('/api/admin/order/archive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: order.orderId, deleteFiles }),
    });
    if (res.ok) {
      alert('Archived');
      router.push('/admin');
    } else {
      const d = await res.json();
      alert(d.error || 'Archive failed');
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!order) return <div className="p-6">Not found</div>;

  const shortId = (order.orderId || '').slice(-8);
  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    shipping: 'bg-purple-100 text-purple-800',
    complete: 'bg-green-100 text-green-800',
    placed: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-red-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <div className="mb-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-700 bg-white hover:bg-gray-50 px-3 py-2 rounded-lg shadow">
            <span>←</span> <span>Back to dashboard</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-800">Order #{shortId}</h1>
                <span className={`px-2 py-1 text-xs rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>{order.status}</span>
              </div>
              <div className="text-xs text-gray-500 break-all">Full ID: {order.orderId}</div>
            </div>
            <a
              className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded px-3 py-2"
              href={`/api/admin/order-files?order=${order.orderId}`}
              target="_blank"
              rel="noreferrer"
            >
              ⬇️ Download files (zip)
            </a>
          </div>

          {/* Body grids */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-semibold mb-2">Customer</h2>
              <div className="text-sm text-gray-700 space-y-1">
                <div><span className="font-semibold">Name:</span> {order.customer?.name || 'N/A'}</div>
                <div><span className="font-semibold">Email:</span> {order.customer?.email || 'N/A'}</div>
                {order.customer?.address && (
                  <div className="pt-2">
                    <div className="font-semibold">Address</div>
                    <div>{order.customer.address.line1} {order.customer.address.line2}</div>
                    <div>{order.customer.address.city}, {order.customer.address.state} {order.customer.address.postal_code}</div>
                  </div>
                )}
                <div className="text-xs text-gray-500 pt-2">Placed: {new Date(order.createdAt).toLocaleString()}</div>
                {order.updatedAt && (
                  <div className="text-xs text-gray-500">Updated: {new Date(order.updatedAt).toLocaleString()}</div>
                )}
              </div>
            </div>
            <div>
              <h2 className="font-semibold mb-2">Status</h2>
              <div className="flex flex-wrap gap-2">
                {(['new', 'processing', 'shipping', 'complete'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    disabled={saving || order.status === s}
                    className={`px-3 py-2 rounded text-sm border ${order.status === s ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-800 hover:bg-gray-50 border-gray-200'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-2">Updating status emails the customer automatically (if email captured).</div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold mb-2">Items</h2>
            <ul className="list-disc pl-5 text-sm">
              {(order.items || []).map((it: any, idx: number) => (
                <li key={idx}>
                  {String(idx + 1).padStart(2, '0')}. {it.templateName} — Folder: {it.outputFolderId || 'N/A'}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button onClick={() => archive(false)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">Archive</button>
            <button onClick={() => archive(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Archive & Delete Files</button>
          </div>
        </div>
      </div>
    </div>
  );
}

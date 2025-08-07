export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Return Policy</h1>
        <p className="text-gray-700 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6 text-gray-800">
          <section>
            <h2 className="text-2xl font-semibold mb-2">Eligibility</h2>
            <p>
              Because all FunnyCal LLC products are custom‑made using your uploaded images, returns are not accepted except in cases of manufacturing defects or shipping damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Damaged or Incorrect Items</h2>
            <p>
              If your item arrives damaged or incorrect, contact <span className="font-semibold">support@funnycal.com</span> within 14 days of delivery with photos and your order ID. We will replace or refund as appropriate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Order Changes & Cancellations</h2>
            <p>
              We start production soon after purchase. If you need to change or cancel your order, email us immediately. If production has not started, we’ll do our best to accommodate your request.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

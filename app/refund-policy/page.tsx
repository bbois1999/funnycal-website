export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund & Dispute Policy</h1>
        <p className="text-gray-700 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6 text-gray-800">
          <section>
            <h2 className="text-2xl font-semibold mb-2">Overview</h2>
            <p>
              FunnyCal LLC sells customized, printed tangible goods (calendars, posters, t‑shirts). Because items are custom‑made based on user‑provided images, they are generally not eligible for returns. However, we want you to be happy with your purchase and will work with you in the event of manufacturing defects or printing errors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Refunds</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Refunds are considered for manufacturing defects (e.g., damaged item, incorrect print, or wrong product received).</li>
              <li>Requests must be made within 14 days of delivery with photos showing the issue.</li>
              <li>If approved, we may offer a replacement or refund to the original payment method.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Exchanges</h2>
            <p>
              We do not offer exchanges for customized items unless there was a manufacturing error. If you uploaded the wrong photo or selected the wrong template, please contact support as soon as possible; we will try to accommodate changes prior to production.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Disputes & Chargebacks</h2>
            <p>
              If you believe there is an issue with your order, contact us first at <span className="font-semibold">support@funnycal.com</span>. We will investigate and resolve issues promptly. If a chargeback or dispute is filed, we will provide documentation of the order, production, and delivery to your bank or card issuer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">How to Request Support</h2>
            <p>
              Email <span className="font-semibold">support@funnycal.com</span> with your order ID, photos of the issue, and a brief description. We typically respond within 1–2 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

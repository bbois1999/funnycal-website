export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-700 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6 text-gray-800">
          <section>
            <h2 className="text-2xl font-semibold mb-2">Overview</h2>
            <p>
              We collect the minimum information necessary to process your order, including your uploaded images, contact information, and shipping details. We do not sell your data. Uploaded images are used only to generate your purchased products.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Data Retention</h2>
            <p>
              Face‑swapped images are stored in our output folders to fulfill and reprint orders if needed. You may request deletion after your order is fulfilled by contacting support.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Contact</h2>
            <p>
              For privacy questions, contact <span className="font-semibold">support@funnycal.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

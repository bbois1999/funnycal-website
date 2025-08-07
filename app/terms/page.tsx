export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
        <p className="text-gray-700 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6 text-gray-800">
          <section>
            <h2 className="text-2xl font-semibold mb-2">General</h2>
            <p>
              By purchasing from FunnyCal LLC, you agree that the uploaded images are yours to use and do not infringe on any rights. You grant FunnyCal LLC a limited license to use your uploaded images solely to produce your ordered products.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Promotions</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Promotion codes must be used at checkout and cannot be applied after purchase.</li>
              <li>Promotions cannot be combined unless explicitly stated.</li>
              <li>FunnyCal LLC may modify or cancel promotions at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Legal & Export Restrictions</h2>
            <p>
              We do not ship to regions restricted by applicable laws. Customers are responsible for ensuring products comply with local import rules. Content that violates our content policy (e.g., illegal, hateful, or infringing material) is not accepted.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

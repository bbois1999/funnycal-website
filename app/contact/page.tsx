export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact FunnyCal LLC</h1>
        <p className="text-gray-700 mb-8">
          We’re here to help with orders, face swaps, or general questions. Reach out using any of the methods below.
        </p>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Customer Support</h2>
            <ul className="text-gray-700 space-y-1">
              <li>
                <span className="font-semibold">Email:</span> support@funnycal.com
              </li>
              <li>
                <span className="font-semibold">Phone:</span> 612-384-2625
              </li>
              <li>
                <span className="font-semibold">Business Name:</span> FunnyCal LLC
              </li>
              <li>
                <span className="font-semibold">Address:</span> 3683 Cranbrook Drive, White Bear Lake, MN 55110
              </li>
              <li>
                <span className="font-semibold">Hours:</span> Every day, 10:00am–10:00pm Central Time (Minnesota)
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Social Profile</h2>
            <p className="text-gray-600 mb-2">Provide this full profile URL to Stripe if requested:</p>
            <ul className="text-blue-600 underline space-y-1">
              <li><a href="https://www.facebook.com/profile.php?id=61572717703408" target="_blank" rel="noopener noreferrer">Facebook: FunnyCal LLC</a></li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Business Description</h2>
            <p className="text-gray-700">
              FunnyCal LLC designs and sells tangible goods such as calendars, posters, and t‑shirts customized with humorous, face‑swapped imagery. Customers upload a photo, choose a template, and we produce printed products using the resulting images.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Calendar, Users, Clock, CheckCircle } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">BookingManager</h1>
          <button className="bg-black text-white px-4 py-2 rounded-xl hover:opacity-90 transition">
            Get Started
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="bg-white rounded-2xl shadow p-6 md:col-span-1">
          <nav className="space-y-4">
            <div className="font-semibold text-lg">Dashboard</div>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-900 font-medium">Overview</li>
              <li className="text-gray-500">Bookings</li>
              <li className="text-gray-500">Customers</li>
              <li className="text-gray-500">Services</li>
              <li className="text-gray-500">Settings</li>
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <main className="md:col-span-3 space-y-6">
          {/* Welcome Card */}
          <section className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Welcome to BookingManager 👋</h2>
            <p className="text-gray-600">
              Manage your bookings, track customers, and optimize your schedule in one place.
            </p>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<Calendar size={20} />}
              label="Total Bookings"
              value="128"
            />
            <StatCard
              icon={<Users size={20} />}
              label="Customers"
              value="54"
            />
            <StatCard
              icon={<Clock size={20} />}
              label="Pending"
              value="9"
            />
            <StatCard
              icon={<CheckCircle size={20} />}
              label="Completed"
              value="87"
            />
          </section>

          {/* Recent Bookings Table */}
          <section className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2">Customer</th>
                    <th className="py-2">Service</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <Row name="John Doe" service="Haircut" date="12 Mar 2026" status="Confirmed" />
                  <Row name="Sarah Lee" service="Consultation" date="13 Mar 2026" status="Pending" />
                  <Row name="Alex Kim" service="Repair Service" date="14 Mar 2026" status="Completed" />
                </tbody>
              </table>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-black text-white rounded-2xl shadow p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold">Ready to manage bookings smarter?</h3>
              <p className="text-gray-300 mt-1">
                Set up your services and start accepting bookings in minutes.
              </p>
            </div>
            <button className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:opacity-90 transition">
              Get Started Now
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
      <div className="p-3 rounded-xl bg-gray-100">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

function Row({ name, service, date, status }) {
  return (
    <tr>
      <td className="py-3">{name}</td>
      <td className="py-3">{service}</td>
      <td className="py-3">{date}</td>
      <td className="py-3">
        <span className="px-3 py-1 rounded-full text-xs bg-gray-100">
          {status}
        </span>
      </td>
    </tr>
  );
}

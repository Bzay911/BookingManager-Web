import { Calendar, Users, Bell, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-indigo-50 text-gray-900">
      {/* Navbar */}
      <header className="bg-white/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-indigo-600">
            BookingManager
          </h1>
          <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold shadow hover:bg-indigo-700 transition"
          onClick={() => navigate("/auth")}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-28 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
          Manage bookings, queues, and customers in one place.
        </h2>
        <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto">
          BookingManager helps local businesses handle appointments, real-time queues, and customer notifications effortlessly.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-indigo-600 text-white px-7 py-3 rounded-2xl font-semibold shadow hover:bg-indigo-700 transition"
             onClick={() => navigate("/auth")}
          >
            Get Started
          </button>
          <button className="border border-gray-200 px-7 py-3 rounded-2xl font-semibold bg-white hover:bg-gray-50 transition">
            View Demo
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h3 className="text-3xl font-extrabold text-gray-900">
              Everything you need to run your bookings
            </h3>
            <p className="text-gray-600 mt-4">
              From real-time queue tracking to automated notifications, BookingManager simplifies your daily operations.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Calendar size={24} />}
              title="Smart Scheduling"
              desc="Manage appointments and availability with an intuitive calendar."
              color="bg-indigo-600"
            />
            <FeatureCard
              icon={<Users size={24} />}
              title="Customer Management"
              desc="Keep track of your customers and their booking history."
              color="bg-pink-600"
            />
            <FeatureCard
              icon={<Bell size={24} />}
              title="Real-time Notifications"
              desc="Notify clients before their turn and reduce waiting time."
              color="bg-amber-500"
            />
            <FeatureCard
              icon={<BarChart3 size={24} />}
              title="Analytics & Insights"
              desc="Understand booking trends and grow your business faster."
              color="bg-emerald-600"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="rounded-3xl p-12 bg-indigo-600 text-white shadow-xl">
            <h3 className="text-3xl md:text-4xl font-extrabold">
              Start managing your bookings smarter today
            </h3>
            <p className="text-white/90 mt-4 text-lg max-w-2xl mx-auto">
              Join businesses using BookingManager to streamline appointments and queues.
            </p>
            <button className="mt-8 bg-white text-indigo-600 px-8 py-4 rounded-2xl text-lg font-semibold shadow hover:bg-gray-100 transition">
              Get Started for Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 text-center text-sm text-gray-500 bg-white">
        © {new Date().getFullYear()} BookingManager. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition flex flex-col items-center text-center">
      <div className={`p-4 rounded-2xl text-white mb-4 ${color} shadow`}>{icon}</div>
      <h4 className="font-semibold text-lg">{title}</h4>
      <p className="text-gray-600 mt-2 text-sm">{desc}</p>
    </div>
  );
}

import { Calendar, Users, Bell, BarChart3, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";

const marqueeItems = [
  "Smart Scheduling",
  "Instant Notifications",
  "Customer Management",
  "Business Analytics",
  "Real-Time Queues",
  "Zero No-Shows",
  "Automated Reminders",
  "Mobile Friendly",
  "Calendar Sync",
  "Easy Setup",
];

function MarqueeTrack() {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div className="flex gap-0 animate-marquee whitespace-nowrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center shrink-0">
          <span className="text-xl font-medium text-gray-500 px-3">{item}</span>
          <span className="text-gray-300 text-xs">•</span>
        </span>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      {/* Marquee keyframe injection */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
          will-change: transform;
        }
        .marquee-wrapper:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>

      {/* Navbar */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Booking<span className="text-[#0be48d]">Manager</span></h1>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-black text-white rounded-full transition-colors duration-200 hover:bg-[#0be48d] hover:text-black"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
          Run your bookings
          <br />
          <span className="text-[#0be48d]">without the chaos</span>
        </h2>

        <p className="text-gray-600 mt-6 text-lg max-w-xl mx-auto">
          BookingManager helps local businesses manage appointments, real-time
          queues, and customer notifications in one simple platform.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={() => navigate("/auth")}
            className="bg-black text-white rounded-full px-7 py-6 text-sm font-semibold transition-colors duration-200 hover:bg-[#0be48d] hover:text-black"
          >
            Get Started Free
          </Button>

          <Button
            variant="outline"
            className="rounded-full px-7 py-6 text-sm border-gray-300 flex items-center gap-2"
          >
            <Play size={16} />
            Watch Demo
          </Button>
        </div>

        {/* ── MARQUEE ── */}
        <div
          className="mt-12  py-2"
          style={{ width: "min(940px, 90vw)", overflow: "hidden" }}
        >
          <div
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
            }}
          >
            <div className="flex marquee-wrapper">
              <MarqueeTrack />
            </div>
          </div>
        </div>
        {/* ── END MARQUEE ── */}
      </section>

      {/* FEATURES */}
      <section className="py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h3 className="text-3xl font-bold">
              Everything you need to run your business
            </h3>
            <p className="text-gray-600 mt-4">
              From real-time queues to automated notifications.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Calendar size={24} />}
              title="Smart Scheduling"
              desc="Manage appointments and availability with an intuitive calendar."
            />
            <FeatureCard
              icon={<Users size={24} />}
              title="Customer Management"
              desc="Track customer history and bookings effortlessly."
            />
            <FeatureCard
              icon={<Bell size={24} />}
              title="Notifications"
              desc="Notify customers before their turn automatically."
            />
            <FeatureCard
              icon={<BarChart3 size={24} />}
              title="Analytics"
              desc="Understand trends and grow your business faster."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Card className="bg-black text-white p-12 rounded-3xl shadow-xl">
            <h3 className="text-3xl font-bold">
              Start managing bookings smarter today
            </h3>
            <p className="mt-4 text-white/70">
              Join businesses using BookingManager to simplify appointments and
              queues.
            </p>
            <Button
              onClick={() => navigate("/auth")}
              className="mt-8 bg-white text-black px-8 py-4 text-lg font-semibold"
            >
              Get Started
            </Button>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} BookingManager
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <Card className="p-6 text-center border border-gray-100 hover:shadow-lg transition">
      <div className="flex justify-center mb-4 text-[#0be48d]">{icon}</div>
      <h4 className="font-semibold text-lg">{title}</h4>
      <p className="text-gray-600 mt-2 text-sm">{desc}</p>
    </Card>
  );
}
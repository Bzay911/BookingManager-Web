import { 
  Calendar, Users, Bell, BarChart3, Play, 
  Star, Clock, Smartphone, CheckCircle, ArrowRight 
} from "lucide-react";
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
          <span className="text-xl font-medium text-gray-400 px-3">{item}</span>
          <span className="text-gray-200 text-xs">•</span>
        </span>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden font-sans">
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
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0be48d] rounded-lg flex items-center justify-center">
              <Calendar className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">BookingManager</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
              navigate("/browse")}}
            className="text-sm font-medium text-gray-600 hover:text-black hidden sm:block">Browse Businesses</button>
            <Button
              onClick={() => navigate("/auth")}
              className="bg-black text-white rounded-full transition-colors duration-200 hover:bg-[#0be48d] hover:text-black"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-20 pb-12 flex flex-col justify-center items-center max-w-7xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium mb-6 border border-green-100">
          <span className="w-2 h-2 rounded-full bg-[#0be48d] animate-pulse"></span>
          Now accepting early access
        </div>
        
        <h2 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight max-w-4xl mx-auto">
          Run your bookings
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0be48d] to-emerald-400">
            without the chaos
          </span>
        </h2>

        <p className="text-gray-500 mt-6 text-xl max-w-2xl mx-auto leading-relaxed">
          The all-in-one platform for local businesses to manage appointments, control real-time queues, and automatically notify customers before their turn.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
          <Button
            onClick={() => navigate("/auth")}
            className="bg-black text-white rounded-full px-7 py-6 text-base transition-colors duration-200 hover:bg-[#0be48d] hover:text-black shadow-lg hover:shadow-xl w-full sm:w-auto"
          >
            Register your business
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            className="rounded-full px-8 py-6 text-base font-medium border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Play size={18} className="fill-current" />
            See how it works
          </Button>
        </div>

            {/* ── MARQUEE ── */}
        <div className="mt-20 py-6 border-y border-gray-50" style={{ width: "100%", overflow: "hidden" }}>
          <div style={{
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
              maskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
            }}
          >
            <div className="flex marquee-wrapper">
              <MarqueeTrack />
            </div>
          </div>
        </div>

        {/* Abstract UI Mockup */}
        <div className="mt-16 w-full max-w-5xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0be48d]/20 to-transparent blur-3xl -z-10 rounded-full transform -translate-y-1/2"></div>
          <div className="rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm p-2 shadow-2xl">
            <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100 aspect-[16/9] sm:aspect-[21/9] flex items-center justify-center relative">
              {/* Fake Calendar UI elements */}
              <div className="absolute left-4 top-4 bottom-4 w-64 bg-white rounded-lg border border-gray-100 shadow-sm hidden md:flex flex-col p-4">
                <div className="h-4 w-24 bg-gray-200 rounded mb-6"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-2 w-full bg-gray-200 rounded"></div>
                        <div className="h-2 w-2/3 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <Calendar className="w-16 h-16 mb-4 opacity-50 text-[#0be48d]" />
                <p className="font-medium text-lg">Interactive Calendar Dashboard</p>
                <p className="text-sm">Manage all your daily bookings at a glance</p>
              </div>
            </div>
          </div>
        </div>

    
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
              Get your time back in 3 simple steps
            </h3>
            <p className="text-gray-500 mt-4 text-lg">
              Set up takes minutes. The time you save lasts forever.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-gray-200 via-[#0be48d] to-gray-200 z-0"></div>

            <StepCard 
              number="1"
              icon={<Clock size={28} />}
              title="Set Your Schedule"
              desc="Define your working hours, service durations, and staff availability with our easy drag-and-drop calendar."
            />
            <StepCard 
              number="2"
              icon={<Smartphone size={28} />}
              title="Clients Book Easily"
              desc="Share your custom booking link on your website or social media. Clients book 24/7 from any device."
            />
            <StepCard 
              number="3"
              icon={<CheckCircle size={28} />}
              title="Manage the Queue"
              desc="Watch bookings roll in. Our system automatically sends SMS reminders to eliminate no-shows."
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
              Everything you need to scale
            </h3>
            <p className="text-gray-500 mt-4 text-lg">
              Powerful tools hidden behind a beautifully simple interface.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Calendar size={24} />}
              title="Smart Scheduling"
              desc="Manage appointments, block out personal time, and sync with your Google Calendar."
            />
            <FeatureCard
              icon={<Users size={24} />}
              title="Customer Profiles"
              desc="Keep track of client preferences, booking history, and contact details."
            />
            <FeatureCard
              icon={<Bell size={24} />}
              title="SMS Notifications"
              desc="Automatically text clients when it's almost their turn or to remind them of appointments."
            />
            <FeatureCard
              icon={<BarChart3 size={24} />}
              title="Business Insights"
              desc="Track revenue, identify your busiest hours, and understand growth trends."
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Trusted by local businesses</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="BookingManager completely changed how we handle our weekend rushes. The automated queue system means our shop is no longer chaotic."
              name="Sarah T."
              role="Bakery Owner"
            />
            <TestimonialCard 
              quote="My clients love the SMS reminders. My no-show rate has dropped to practically zero since we started using this."
              name="James L."
              role="Barbershop Owner"
            />
            <TestimonialCard 
              quote="The easiest software I've ever set up. Took me 15 minutes and we were ready to take online bookings."
              name="Elena M."
              role="Consultant"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0be48d] opacity-10 blur-[100px] rounded-full"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Card className="bg-black text-white p-12 md:p-20 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
            {/* Subtle card background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
            
            <div className="relative z-10">
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Ready to organize your business?
              </h3>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                Join the hundreds of businesses using BookingManager to streamline their day-to-day operations.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  onClick={() => navigate("/auth")}
                  className="bg-[#0be48d] text-black hover:bg-white px-8 py-6 text-lg font-bold rounded-full transition-all duration-300"
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-700 text-black hover:bg-gray-900 hover:text-white px-8 py-6 text-lg font-medium rounded-full"
                >
                  Talk to Sales
                </Button>
              </div>
              <p className="mt-6 text-sm text-gray-500">No credit card required • 14-day free trial</p>
            </div>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 bg-gray-50 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#0be48d] rounded-md flex items-center justify-center">
                  <Calendar className="text-white w-4 h-4" />
                </div>
                <span className="font-bold text-lg">BookingManager</span>
              </div>
              <p className="text-gray-500 text-sm max-w-sm">
                Making appointment scheduling and queue management effortless for local businesses everywhere.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-black">Features</a></li>
                <li><a href="#" className="hover:text-black">Pricing</a></li>
                <li><a href="#" className="hover:text-black">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-black">About</a></li>
                <li><a href="#" className="hover:text-black">Contact</a></li>
                <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-gray-400 pt-8 border-t border-gray-200">
            © {new Date().getFullYear()} BookingManager. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Subcomponents

function FeatureCard({ icon, title, desc }) {
  return (
    <Card className="p-8 text-left border border-gray-100 hover:border-[#0be48d]/50 hover:shadow-xl transition-all duration-300 group rounded-2xl bg-white">
      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6 text-[#0be48d] group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h4 className="font-bold text-xl mb-3">{title}</h4>
      <p className="text-gray-500 text-base leading-relaxed">{desc}</p>
    </Card>
  );
}

function StepCard({ number, icon, title, desc }) {
  return (
    <div className="relative flex flex-col items-center text-center z-10">
      <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-center mb-6 relative">
        <div className="text-[#0be48d]">{icon}</div>
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
          {number}
        </div>
      </div>
      <h4 className="font-bold text-xl mb-3">{title}</h4>
      <p className="text-gray-500 text-base max-w-xs">{desc}</p>
    </div>
  );
}

function TestimonialCard({ quote, name, role }) {
  return (
    <Card className="p-8 border border-gray-100 shadow-sm hover:shadow-md transition duration-300 bg-gray-50/50 rounded-2xl flex flex-col justify-between">
      <div>
        <div className="flex gap-1 text-[#0be48d] mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className="fill-current" />
          ))}
        </div>
        <p className="text-gray-700 italic text-lg leading-relaxed mb-6">"{quote}"</p>
      </div>
      <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
        <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
          {name.charAt(0)}
        </div>
        <div className="text-left">
          <p className="font-bold text-sm">{name}</p>
          <p className="text-gray-500 text-xs">{role}</p>
        </div>
      </div>
    </Card>
  );
}
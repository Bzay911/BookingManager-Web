import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { useAuth } from "../../contexts/Authcontext";
import {
  Users,
  CalendarClock,
  TrendingUp,
  Clock,
  Bell,
  Settings,
  LayoutDashboard,
  ClipboardList,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Timer,
  UserCheck,
} from "lucide-react";

const stats = [
  {
    label: "Active Queue",
    value: "12",
    sub: "3 waiting · 2 in service",
    icon: Users,
    accent: "#6366f1",
    bg: "#eef2ff",
  },
  {
    label: "Today's Bookings",
    value: "34",
    sub: "+8 from yesterday",
    icon: CalendarClock,
    accent: "#0ea5e9",
    bg: "#e0f2fe",
  },
  {
    label: "Avg. Wait Time",
    value: "14m",
    sub: "Down 3 min vs last week",
    icon: Timer,
    accent: "#10b981",
    bg: "#d1fae5",
  },
  {
    label: "Completed Today",
    value: "21",
    sub: "62% of daily target",
    icon: CheckCircle2,
    accent: "#f59e0b",
    bg: "#fef3c7",
  },
];

const recentActivity = [
  { name: "Sarah Johnson", action: "Checked in", time: "2 min ago", status: "in-service" },
  { name: "Mike Torres", action: "Joined queue", time: "5 min ago", status: "waiting" },
  { name: "Priya Mehta", action: "Booking confirmed", time: "11 min ago", status: "confirmed" },
  { name: "James Lee", action: "Completed service", time: "18 min ago", status: "done" },
];

const statusStyles: Record<string, { label: string; color: string; bg: string }> = {
  "in-service": { label: "In Service", color: "#6366f1", bg: "#eef2ff" },
  waiting: { label: "Waiting", color: "#f59e0b", bg: "#fef3c7" },
  confirmed: { label: "Confirmed", color: "#0ea5e9", bg: "#e0f2fe" },
  done: { label: "Done", color: "#10b981", bg: "#d1fae5" },
};

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Queue", active: false },
  { icon: CalendarClock, label: "Bookings", active: false },
  { icon: ClipboardList, label: "Reports", active: false },
  { icon: Settings, label: "Settings", active: false },
];

export default function Dashboard() {
  const { user, logout } = useAuth();

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "BM";

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
      className="flex h-screen bg-slate-50 overflow-hidden"
    >
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col py-6 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 mb-8">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#6366f1" }}
          >
            <CalendarClock size={16} color="white" />
          </div>
          <span className="font-bold text-slate-800 text-base tracking-tight">BookingManager</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon size={17} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        {/* User profile at bottom */}
        <div className="border-t border-slate-100 pt-4 mt-4">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.profileImage ?? undefined} />
              <AvatarFallback
                style={{ background: "#6366f1", color: "white", fontSize: "12px", fontWeight: 600 }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {user?.displayName ?? "Business Owner"}
              </p>
              <p className="text-xs text-slate-400 truncate">{user?.email ?? ""}</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600" onClick={logout}>
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-slate-50 border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-0.5">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <h1 className="text-xl font-bold text-slate-800">
              {greeting()},{" "}
              <span style={{ color: "#6366f1" }}>{user?.displayName?.split(" ")[0] ?? "there"}</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 shadow-sm">
              <Bell size={16} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: "#6366f1" }}
              />
            </button>
            <Badge
              style={{ background: "#eef2ff", color: "#6366f1", border: "none", fontWeight: 600 }}
              className="text-xs px-3 py-1 rounded-full"
            >
              {user?.role === "BUSINESS" ? "Business" : "Customer"}
            </Badge>
          </div>
        </header>

        <div className="px-8 py-6 space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map(({ label, value, sub, icon: Icon, accent, bg }) => (
              <Card key={label} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: bg }}
                    >
                      <Icon size={18} style={{ color: accent }} />
                    </div>
                    <TrendingUp size={14} className="text-slate-300 mt-1" />
                  </div>
                  <p className="text-2xl font-bold text-slate-800 mb-0.5">{value}</p>
                  <p className="text-xs font-semibold text-slate-500">{label}</p>
                  <p className="text-xs text-slate-400 mt-1">{sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Recent Activity */}
            <Card className="col-span-2 border-0 shadow-sm">
              <CardHeader className="pb-2 px-6 pt-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-slate-700">Recent Activity</CardTitle>
                  <button className="text-xs font-semibold" style={{ color: "#6366f1" }}>
                    View all
                  </button>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-5">
                <div className="space-y-3">
                  {recentActivity.map((item, i) => {
                    const s = statusStyles[item.status];
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-4 py-2.5 border-b border-slate-50 last:border-0"
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: "#f1f5f9", color: "#64748b" }}
                        >
                          {item.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-700">{item.name}</p>
                          <p className="text-xs text-slate-400">{item.action}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: s.bg, color: s.color }}
                          >
                            {s.label}
                          </span>
                          <span className="text-xs text-slate-400">{item.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick actions */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 px-6 pt-5">
                <CardTitle className="text-sm font-bold text-slate-700">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-5 space-y-2">
                {[
                  { icon: UserCheck, label: "Check In Customer", color: "#6366f1", bg: "#eef2ff" },
                  { icon: CalendarClock, label: "New Booking", color: "#0ea5e9", bg: "#e0f2fe" },
                  { icon: Clock, label: "Manage Queue", color: "#f59e0b", bg: "#fef3c7" },
                  { icon: ClipboardList, label: "View Reports", color: "#10b981", bg: "#d1fae5" },
                ].map(({ icon: Icon, label, color, bg }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:shadow-sm transition-all border border-slate-100 bg-white hover:border-slate-200"
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: bg }}
                    >
                      <Icon size={14} style={{ color }} />
                    </div>
                    {label}
                    <ChevronRight size={13} className="ml-auto text-slate-300" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
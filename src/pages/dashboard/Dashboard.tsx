import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Users,
  CalendarClock,
  TrendingUp,
  Clock,
  ClipboardList,
  ChevronRight,
  CheckCircle2,
  Timer,
  UserCheck,
} from "lucide-react";

// Data arrays specific only to the dashboard view
const stats = [
  {
    label: "Active Queue",
    value: "12",
    sub: "3 waiting · 2 in service",
    icon: Users,
    textClass: "text-black",
    bgClass: "bg-gray-100",
  },
  {
    label: "Today's Bookings",
    value: "34",
    sub: "+8 from yesterday",
    icon: CalendarClock,
    textClass: "text-[#0be48d]",
    bgClass: "bg-[#0be48d]/10",
  },
  {
    label: "Avg. Wait Time",
    value: "14m",
    sub: "Down 3 min vs last week",
    icon: Timer,
    textClass: "text-black",
    bgClass: "bg-gray-100",
  },
  {
    label: "Completed Today",
    value: "21",
    sub: "62% of daily target",
    icon: CheckCircle2,
    textClass: "text-[#0be48d]",
    bgClass: "bg-[#0be48d]/10",
  },
];

const recentActivity = [
  { name: "Sarah Johnson", action: "Checked in", time: "2 min ago", status: "in-service" },
  { name: "Mike Torres", action: "Joined queue", time: "5 min ago", status: "waiting" },
  { name: "Priya Mehta", action: "Booking confirmed", time: "11 min ago", status: "confirmed" },
  { name: "James Lee", action: "Completed service", time: "18 min ago", status: "done" },
];

const statusStyles: Record<string, { label: string; textClass: string; bgClass: string }> = {
  "in-service": { label: "In Service", textClass: "text-[#0be48d]", bgClass: "bg-[#0be48d]/10" },
  waiting: { label: "Waiting", textClass: "text-gray-600", bgClass: "bg-gray-100" },
  confirmed: { label: "Confirmed", textClass: "text-black", bgClass: "bg-gray-200" },
  done: { label: "Done", textClass: "text-gray-400", bgClass: "bg-gray-50 border border-gray-100" },
};

export default function Dashboard() {
  // Notice there are no sidebars, headers, or full-screen wrappers here.
  // Just the content. The Layout component handles the rest!
  return (
    <div className="space-y-8">
      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map(({ label, value, sub, icon: Icon, textClass, bgClass }) => (
          <Card key={label} className="border border-gray-100 shadow-sm rounded-3xl bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bgClass}`}>
                  <Icon size={22} className={textClass} />
                </div>
                <TrendingUp size={16} className="text-gray-300 mt-1" />
              </div>
              <p className="text-3xl font-extrabold text-black mb-1 tracking-tight">{value}</p>
              <p className="text-sm font-bold text-gray-500">{label}</p>
              <p className="text-xs text-gray-400 mt-2 font-medium">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="col-span-2 border border-gray-100 shadow-sm rounded-3xl bg-white">
          <CardHeader className="pb-4 px-8 pt-7 border-b border-gray-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-black">Recent Activity</CardTitle>
              <button className="text-sm font-bold text-[#0be48d] hover:text-emerald-500 transition-colors">
                View all
              </button>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-6 pt-4">
            <div className="space-y-4">
              {recentActivity.map((item, i) => {
                const s = statusStyles[item.status];
                return (
                  <div key={i} className="flex items-center gap-4 py-2 group">
                    <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0 group-hover:scale-105 transition-transform">
                      {item.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-black">{item.name}</p>
                      <p className="text-xs text-gray-500 font-medium">{item.action}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.bgClass} ${s.textClass}`}>
                        {s.label}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">{item.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card className="border border-gray-100 shadow-sm rounded-3xl bg-white">
          <CardHeader className="pb-4 px-8 pt-7 border-b border-gray-50">
            <CardTitle className="text-lg font-bold text-black">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-6 space-y-3">
            {[
              { icon: UserCheck, label: "Check In Customer", text: "text-black", bg: "bg-gray-100" },
              { icon: CalendarClock, label: "New Booking", text: "text-[#0be48d]", bg: "bg-[#0be48d]/10" },
              { icon: Clock, label: "Manage Queue", text: "text-black", bg: "bg-gray-100" },
              { icon: ClipboardList, label: "View Reports", text: "text-black", bg: "bg-gray-100" },
            ].map(({ icon: Icon, label, text, bg }) => (
              <button
                key={label}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-black hover:shadow-md transition-all border border-gray-100 bg-white hover:border-[#0be48d]/30 group"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${bg} group-hover:scale-105 transition-transform`}>
                  <Icon size={16} className={text} />
                </div>
                {label}
                <ChevronRight size={16} className="ml-auto text-gray-300 group-hover:text-[#0be48d] transition-colors" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Users,
  CalendarClock,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    label: "Active Queue",
    value: "12",
    trend: "+3 today",
    sub: "3 waiting · 2 in service",
    icon: Users,
  },
  {
    label: "Today's Bookings",
    value: "34",
    trend: "+8 from yesterday",
    sub: "Next at 2:30 PM",
    icon: CalendarClock,
  },
];

const recentActivity = [
  { name: "Sarah Johnson", action: "Checked in", time: "2 min ago", status: "in-service" },
  { name: "Mike Torres", action: "Joined queue", time: "5 min ago", status: "waiting" },
  { name: "Priya Mehta", action: "Booking confirmed", time: "11 min ago", status: "confirmed" },
  { name: "James Lee", action: "Completed service", time: "18 min ago", status: "done" },
];

const statusStyles: Record<string, { label: string; textClass: string; bgClass: string }> = {
  "in-service": { label: "In Service", textClass: "text-black", bgClass: "bg-black/5 border border-black/10" },
  waiting: { label: "Waiting", textClass: "text-gray-500", bgClass: "bg-white border border-gray-200" },
  confirmed: { label: "Confirmed", textClass: "text-gray-500", bgClass: "bg-white border border-gray-200" },
  done: { label: "Done", textClass: "text-gray-300", bgClass: "bg-white border border-gray-100" },
};

export default function Dashboard() {
  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map(({ label, value, trend, sub, icon: Icon }) => (
          <Card
            key={label}
            className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-gray-400 leading-none mb-1">{label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-extrabold text-black tracking-tight leading-none">
                      {value}
                    </p>
                    <span className="flex items-center gap-0.5 text-[10px] font-medium text-gray-500">
                      <ArrowUpRight size={9} />
                      {trend}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2.5 ml-[3.25rem]">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom row */}
      {/* Recent Activity */}
      <Card className="border border-gray-200 rounded-2xl bg-white shadow-sm">
        <CardHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-black">
              Recent Activity
            </CardTitle>
            <button className="text-xs font-medium text-black hover:opacity-60 transition-opacity">
              View all
            </button>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-5 pt-4">
          <div className="divide-y divide-gray-50">
            {recentActivity.map((item, i) => {
              const s = statusStyles[item.status];
              return (
                <div key={i} className="flex items-center gap-3.5 py-3.5 first:pt-0 last:pb-0">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 flex-shrink-0">
                    {item.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.action}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${s.bgClass} ${s.textClass}`}>
                      {s.label}
                    </span>
                    <span className="text-[10px] text-gray-300">{item.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
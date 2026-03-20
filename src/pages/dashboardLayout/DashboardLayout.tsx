import { Outlet, NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { useAuth } from "../../contexts/Authcontext";
import {
  Users, CalendarClock, Settings, LayoutDashboard,
  ClipboardList, LogOut, ChevronRight, Calendar
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Queue", path: "/dashboard/queue" },
  { icon: CalendarClock, label: "Bookings", path: "/dashboard/bookings" },
  { icon: ClipboardList, label: "Your Business", path: "/dashboard/business" },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "BM";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-white border-r border-gray-100 flex flex-col py-6 px-4 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 px-2 mb-10 mt-2">
          <div className="w-9 h-9 bg-[#0be48d] rounded-xl flex items-center justify-center shadow-md shadow-[#0be48d]/20">
            <Calendar size={18} className="text-white" />
          </div>
          <span className="font-extrabold text-black text-lg tracking-tight">BookingManager</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={label}
              to={path}
              end={path === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-gray-100 text-black shadow-sm"
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={16}/>
                  {label}
                  {isActive && <ChevronRight size={14} className="ml-auto opacity-40" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User profile */}
        <div className="border-t border-gray-100 pt-4 mt-4">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="w-8 h-8 border border-gray-100 shadow-sm">
              <AvatarImage src={user?.profileImage ?? undefined} />
              <AvatarFallback className="bg-black text-white text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-black truncate">
                {user?.displayName ?? "Business Owner"}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email ?? "Pro Account"}</p>
            </div>
            <button 
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" 
              onClick={logout}
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0be48d] opacity-[0.03] blur-[100px] rounded-full pointer-events-none -z-10"></div>

        {/* Universal Top Bar */}
        <header className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-md border-b border-gray-100 px-10 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium text-black tracking-tight">
              Welcome back,{" "}
              <span className="text-black font-bold">
                {user?.displayName?.split(" ")[0] ?? "there"}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-white text-black border border-gray-200 text-xs px-3 py-1.5 rounded-full shadow-sm">
              {user?.role === "BUSINESS" ? "Business" : "Customer"}
            </Badge>
          </div>
        </header>

        <div className="flex-1 p-10">
          <Outlet />
        </div>
        
      </main>
    </div>
  );
}
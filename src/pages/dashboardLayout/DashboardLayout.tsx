import { Outlet, NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
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
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-white border-r border-gray-200 flex flex-col py-6 px-4 z-20">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-2 mb-8 mt-1">
          <div className="w-7 h-7 bg-black rounded-sm flex items-center justify-center">
            <Calendar size={14} className="text-white" />
          </div>
          <span className="font-medium text-black text-sm tracking-tight">BookingManager</span>
        </div>

        {/* Nav section label */}
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest px-2 mb-2">
          Menu
        </p>

        {/* Nav Links */}
        <nav className="flex-1 flex flex-col gap-0.5">
          {navItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={label}
              to={path}
              end={path === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-black/[0.03] text-black"
                    : "text-gray-500 hover:text-gray-700 hover:bg-black/[0.03]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={15} className={isActive ? "text-black" : "text-gray-400"} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User profile */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <Avatar className="w-7 h-7 border border-gray-200">
              <AvatarImage src={user?.profileImage ?? undefined} />
              <AvatarFallback className="bg-black text-white text-[10px] font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-black truncate">
                {user?.displayName ?? "Business Owner"}
              </p>
              <p className="text-[10px] text-gray-400 truncate">{user?.email ?? "Pro Account"}</p>
            </div>
            <button
              className="w-6 h-6 flex items-center justify-center rounded text-gray-300 hover:text-red-400 transition-colors"
              onClick={logout}
              title="Log out"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col bg-[#f7f7f7]">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-[#f7f7f7] border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>

          <h1 className="text-lg">
            Welcome back,{" "}
              {user?.displayName?.split(" ")[0] ?? "there"}
          </h1>
          <p className="text-sm text-gray-400">Here is what's happening with your business today</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-full">
              {user?.role === "BUSINESS" ? "Business" : "Customer"}
            </span>
          </div>
        </header>

        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
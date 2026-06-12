import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Sparkles,
  Wallet,
  Building2,
  ChevronLeft,
  LogOut,
} from "lucide-react";

const businessNavItems = [
  { label: "Dashboard", href: "/business", icon: LayoutDashboard },
  { label: "Bookings", href: "/business/bookings", icon: ClipboardList },
  { label: "Staff", href: "/business/staff", icon: Users },
  { label: "Services", href: "/business/services", icon: Sparkles },
  { label: "Earnings", href: "/business/earnings", icon: Wallet },
  { label: "Profile", href: "/business/profile", icon: Building2 },
];

export default function BusinessLayout() {
  const { isBusiness, isLoading, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isBusiness) {
      navigate("/");
    }
  }, [isBusiness, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand" />
      </div>
    );
  }

  if (!isBusiness) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-ink text-cream/70 flex flex-col fixed h-full">
        <div className="p-6 border-b border-white/10">
          <Link to="/business" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-sm flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">Business Hub</span>
              <span className="block text-[10px] text-cream/40 uppercase tracking-wider truncate max-w-[140px]">
                {user?.name || "WeClean Partner"}
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {businessNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all ${
                  isActive
                    ? "bg-brand text-white"
                    : "text-cream/55 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium text-cream/55 hover:text-white hover:bg-white/5 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Site
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium text-cream/55 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64">
        <Outlet />
      </main>
    </div>
  );
}

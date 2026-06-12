import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  ClipboardList,
  User as UserIcon,
  Briefcase,
  ChevronLeft,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const providerNavItems = [
  { label: "Dashboard", href: "/provider", icon: LayoutDashboard },
  { label: "My Jobs", href: "/provider/jobs", icon: ClipboardList },
  { label: "Profile", href: "/provider/profile", icon: UserIcon },
];

export default function ProviderLayout() {
  const { isProvider, isLoading, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isProvider) navigate("/");
  }, [isProvider, isLoading, navigate]);

  useEffect(() => setOpen(false), [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand" />
      </div>
    );
  }

  if (!isProvider) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-ink text-white">
        <Link to="/provider" className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-brand" />
          <span className="font-display font-bold">Provider</span>
        </Link>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-2 -mr-2">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-ink text-cream/70 flex flex-col z-50 transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/provider" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-sm flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">Provider</span>
              <span className="block text-[10px] text-cream/40 uppercase tracking-wider truncate max-w-[120px]">
                {user?.name || "WeClean Pro"}
              </span>
            </div>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden p-1 text-cream/60" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {providerNavItems.map((item) => {
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

      <main className="lg:ml-64 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

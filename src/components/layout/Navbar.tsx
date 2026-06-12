import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Menu,
  User,
  LogOut,
  LayoutDashboard,
  Briefcase,
  Shield,
  Building2,
  ChevronDown,
  Home,
  ClipboardList,
  Info,
  HelpCircle,
  Mail,
} from "lucide-react";
import { useState } from "react";
import NotificationBell from "@/components/NotificationBell";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isBusiness, isProvider, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Services", href: "/services", icon: ClipboardList },
    { label: "About", href: "/about", icon: Info },
    { label: "FAQs", href: "/faq", icon: HelpCircle },
    { label: "Contact", href: "/contact", icon: Mail },
    ...(isBusiness
      ? [{ label: "Business Hub", href: "/business", icon: Building2 }]
      : []),
    ...(isProvider
      ? [{ label: "Provider Dashboard", href: "/provider", icon: Briefcase }]
      : []),
    ...(isAuthenticated && !isBusiness
      ? [{ label: "My Bookings", href: "/dashboard", icon: LayoutDashboard }]
      : []),
    ...(isAdmin
      ? [{ label: "Admin", href: "/admin", icon: Shield }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-cream/85 backdrop-blur-md border-b border-ink/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <span className="font-display text-2xl font-bold text-ink leading-none tracking-tight">
              We<span className="text-brand">Clean</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink/70 hover:text-ink hover:bg-ink/5 rounded-sm transition-colors"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <NotificationBell />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-ink/5 transition-colors">
                      <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name || ""}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-brand" />
                        )}
                      </div>
                      <span className="hidden sm:block text-sm font-medium text-ink/80 max-w-[100px] truncate">
                        {user?.name || "User"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    {isBusiness && (
                      <DropdownMenuItem onClick={() => navigate("/business")}>
                        <Building2 className="w-4 h-4 mr-2" />
                        Business Hub
                      </DropdownMenuItem>
                    )}
                    {isProvider && (
                      <DropdownMenuItem onClick={() => navigate("/provider")}>
                        <Briefcase className="w-4 h-4 mr-2" />
                        Provider Panel
                      </DropdownMenuItem>
                    )}
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="hidden sm:flex"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/services")}
                  className="bg-brand hover:bg-brand-700 text-white"
                >
                  Book Cleaning
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 text-slate-500 hover:text-ink hover:bg-ink/5 rounded-lg transition-colors">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetTitle className="mb-6">
                  <span className="font-display text-xl font-bold text-ink">
                    We<span className="text-brand">Clean</span>
                  </span>
                </SheetTitle>
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-slate-600 hover:text-ink hover:bg-ink/5 rounded-lg"
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  ))}
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg mt-4"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 text-sm font-medium bg-ink text-white rounded-lg mt-4 justify-center"
                    >
                      <User className="w-5 h-5" />
                      Sign In
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

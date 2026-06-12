import { Routes, Route } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { lazy, Suspense } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import BusinessLayout from "@/components/layout/BusinessLayout";
import ProviderLayout from "@/components/layout/ProviderLayout";

// Lazy load pages for code splitting
const Home = lazy(() => import("@/pages/Home"));
const Services = lazy(() => import("@/pages/Services"));
const ServiceDetail = lazy(() => import("@/pages/ServiceDetail"));
const BookingFlow = lazy(() => import("@/pages/BookingFlow"));
const BookingConfirmation = lazy(() => import("@/pages/BookingConfirmation"));
const CustomerDashboard = lazy(() => import("@/pages/CustomerDashboard"));
const ProviderDashboard = lazy(() => import("@/pages/ProviderDashboard"));
const ProviderJobs = lazy(() => import("@/pages/ProviderJobs"));
const ProviderProfile = lazy(() => import("@/pages/ProviderProfile"));
const ProviderOnboarding = lazy(() => import("@/pages/ProviderOnboarding"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminBookings = lazy(() => import("@/pages/AdminBookings"));
const AdminProviders = lazy(() => import("@/pages/AdminProviders"));
const AdminUsers = lazy(() => import("@/pages/AdminUsers"));
const AdminAnalytics = lazy(() => import("@/pages/AdminAnalytics"));
const AdminSettings = lazy(() => import("@/pages/AdminSettings"));
const AdminWithdrawals = lazy(() => import("@/pages/AdminWithdrawals"));
const BusinessDashboard = lazy(() => import("@/pages/BusinessDashboard"));
const BusinessBookings = lazy(() => import("@/pages/BusinessBookings"));
const BusinessStaff = lazy(() => import("@/pages/BusinessStaff"));
const BusinessServices = lazy(() => import("@/pages/BusinessServices"));
const BusinessEarnings = lazy(() => import("@/pages/BusinessEarnings"));
const BusinessProfile = lazy(() => import("@/pages/BusinessProfile"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Login = lazy(() => import("@/pages/Login"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand" />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/book/:serviceId" element={<BookingFlow />} />
            <Route path="/booking/confirmation/:bookingId" element={<BookingConfirmation />} />
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/provider/onboarding" element={<ProviderOnboarding />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/providers" element={<AdminProviders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          {/* Provider Routes */}
          <Route element={<ProviderLayout />}>
            <Route path="/provider" element={<ProviderDashboard />} />
            <Route path="/provider/jobs" element={<ProviderJobs />} />
            <Route path="/provider/profile" element={<ProviderProfile />} />
          </Route>

          {/* Business Routes */}
          <Route element={<BusinessLayout />}>
            <Route path="/business" element={<BusinessDashboard />} />
            <Route path="/business/bookings" element={<BusinessBookings />} />
            <Route path="/business/staff" element={<BusinessStaff />} />
            <Route path="/business/services" element={<BusinessServices />} />
            <Route path="/business/earnings" element={<BusinessEarnings />} />
            <Route path="/business/profile" element={<BusinessProfile />} />
          </Route>

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" richColors />
    </>
  );
}

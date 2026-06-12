import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileSettings from "@/components/ProfileSettings";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Package,
  Wallet,
  Home as HomeIcon,
  ClipboardList,
  Sparkles,
  CircleDot,
  Receipt,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import ReceiptDialog from "@/components/ReceiptDialog";

const naira = (v: string | number) =>
  "₦" + Number(v).toLocaleString("en-NG", { maximumFractionDigits: 0 });

const statusColors: Record<string, string> = {
  confirmed: "bg-brand-100 text-brand-700",
  completed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  provider_assigned: "bg-cyan-100 text-cyan-700",
  cancelled: "bg-red-100 text-red-700",
  in_progress: "bg-purple-100 text-purple-700",
};

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("bookings");

  const { data: bookings, isLoading } = trpc.booking.myBookings.useQuery({ limit: 50 });
  const { data: addresses } = trpc.address.list.useQuery();
  const { data: referral } = trpc.auth.myReferral.useQuery();

  const copyReferral = async () => {
    if (!referral?.code) return;
    const link = `${window.location.origin}/login?ref=${referral.code}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Referral link copied!");
    } catch {
      toast.success(`Your code: ${referral.code}`);
    }
  };

  const completed = (bookings ?? []).filter((b) => b.status === "completed");
  const totalSpent = (bookings ?? [])
    .filter((b) => b.paymentStatus === "paid")
    .reduce((s, b) => s + parseFloat(b.totalAmount || "0"), 0);

  const stats = [
    { label: "Total Bookings", value: bookings?.length ?? 0, icon: ClipboardList, color: "bg-brand-50 text-brand" },
    { label: "Completed", value: completed.length, icon: Package, color: "bg-green-50 text-green-600" },
    { label: "Loyalty Points", value: user?.loyaltyPoints ?? 0, icon: Star, color: "bg-amber-50 text-amber-600" },
    { label: "Total Spent", value: naira(totalSpent), icon: Wallet, color: "bg-violet-50 text-violet-600" },
  ];

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back, {user?.name?.split(" ")[0] || "Guest"}!
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage your bookings and account settings.
            </p>
          </div>
          <Button
            onClick={() => navigate("/services")}
            className="bg-brand hover:bg-brand-700 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Book a Cleaning
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-ink/12 shadow-hard-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="bookings">My Bookings</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="bookings" className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full" />
                  ))
                ) : !bookings?.length ? (
                  <div className="text-center py-16 bg-white rounded-lg">
                    <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No bookings yet</h3>
                    <p className="text-sm text-slate-500 mb-4">Book your first cleaning to get started.</p>
                    <Button onClick={() => navigate("/services")}>Browse Services</Button>
                  </div>
                ) : (
                  bookings.map((b) => (
                    <Card key={b.id} className="border-ink/12  hover:shadow-hard-sm transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-slate-900">
                                Booking #{b.id}
                              </h3>
                              <Badge variant="secondary" className={statusColors[b.status]}>
                                {b.status.replace(/_/g, " ")}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {b.scheduledDate ? new Date(b.scheduledDate).toLocaleDateString() : "—"}
                              </span>
                              {b.preferredTimeStart && (
                                <span className="flex items-center gap-1.5">
                                  <Clock className="w-4 h-4" />
                                  {b.preferredTimeStart}
                                </span>
                              )}
                              {b.propertyType && (
                                <span className="flex items-center gap-1.5">
                                  <MapPin className="w-4 h-4" />
                                  {b.propertyType}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <CircleDot className="w-4 h-4 text-brand" />
                              <span className="text-sm text-slate-600">
                                Payment:{" "}
                                <span className="font-medium">{b.paymentStatus}</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <p className="text-lg font-bold text-slate-900">
                              {naira(b.totalAmount)}
                            </p>
                            <ReceiptDialog bookingId={b.id}>
                              <Button size="sm" variant="outline" className="h-8">
                                <Receipt className="w-3.5 h-3.5 mr-1.5" />
                                Receipt
                              </Button>
                            </ReceiptDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="addresses">
                <div className="space-y-4">
                  {(addresses ?? []).map((a) => (
                    <Card key={a.id} className="border-ink/12 ">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-brand-50 rounded-md flex items-center justify-center">
                            <HomeIcon className="w-5 h-5 text-brand" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-slate-900">{a.label}</h3>
                              {a.isDefault && (
                                <Badge className="bg-brand-100 text-brand-700 text-xs">Default</Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 mt-1">
                              {a.address}, {a.city}, {a.state}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {!addresses?.length && (
                    <p className="text-sm text-slate-400 py-8 text-center">
                      No saved addresses yet.
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="profile">
                <ProfileSettings />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-ink/12 shadow-hard-sm">
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/services")}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Book a Service
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("profile")}>
                  <Star className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            <div className="bg-brand rounded-lg p-6 text-white">
              <Sparkles className="w-8 h-8 mb-3" />
              <h3 className="font-bold text-lg mb-1">Refer & Earn!</h3>
              <p className="text-cream text-sm mb-4">
                Invite friends and earn ₦{referral?.rewardPerReferral ?? "500"} for each
                successful referral.
              </p>
              {referral && (
                <div className="bg-white/15 border border-white/25 rounded-md px-3 py-2 mb-3 flex items-center justify-between">
                  <span className="font-mono font-bold tracking-widest text-lg">
                    {referral.code}
                  </span>
                  <span className="text-xs text-cream">
                    {referral.completed} referred
                  </span>
                </div>
              )}
              <Button
                variant="secondary"
                className="w-full bg-white text-brand hover:bg-brand-50"
                onClick={copyReferral}
              >
                Copy Referral Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

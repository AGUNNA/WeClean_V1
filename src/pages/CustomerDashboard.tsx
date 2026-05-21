import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  RefreshCw,
  ChevronRight,
  Package,
  Wallet,
  Heart,
  Settings,
  Bell,
  ClipboardList,
  Sparkles,
  CircleDot,
  Home as HomeIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const mockBookings = [
  {
    id: 1,
    service: "House Cleaning",
    date: "May 15, 2026",
    time: "10:00 AM",
    status: "confirmed",
    provider: "Chioma A.",
    amount: "12,000",
    address: "15 Admiralty Way, Lekki",
  },
  {
    id: 2,
    service: "Deep Cleaning",
    date: "May 10, 2026",
    time: "02:00 PM",
    status: "completed",
    provider: "Emmanuel K.",
    amount: "25,000",
    address: "15 Admiralty Way, Lekki",
  },
  {
    id: 3,
    service: "Laundry Service",
    date: "May 8, 2026",
    time: "09:00 AM",
    status: "completed",
    provider: "Amina S.",
    amount: "5,500",
    address: "15 Admiralty Way, Lekki",
  },
  {
    id: 4,
    service: "Fumigation",
    date: "Apr 28, 2026",
    time: "11:00 AM",
    status: "completed",
    provider: "CleanPro Team",
    amount: "15,000",
    address: "15 Admiralty Way, Lekki",
  },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-700",
  in_progress: "bg-purple-100 text-purple-700",
};

const recentActivity = [
  { id: 1, text: "Your booking #1283 has been confirmed", time: "2 hours ago", type: "booking" },
  { id: 2, text: "Chioma A. is assigned to your cleaning", time: "2 hours ago", type: "provider" },
  { id: 3, text: "Your laundry service was completed", time: "2 days ago", type: "completed" },
  { id: 4, text: "You earned 150 loyalty points!", time: "2 days ago", type: "reward" },
];

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("bookings");

  const stats = [
    {
      label: "Total Bookings",
      value: "12",
      icon: ClipboardList,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Completed",
      value: "9",
      icon: Package,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Loyalty Points",
      value: "1,250",
      icon: Star,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Total Spent",
      value: "N156K",
      icon: Wallet,
      color: "bg-violet-50 text-violet-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Book a Cleaning
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-0 shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}
                  >
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="bookings">My Bookings</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
              </TabsList>

              <TabsContent value="bookings" className="space-y-4">
                {mockBookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-slate-900">
                              {booking.service}
                            </h3>
                            <Badge
                              variant="secondary"
                              className={statusColors[booking.status]}
                            >
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {booking.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              {booking.time}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4" />
                              {booking.address}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CircleDot className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-slate-600">
                              Provider:{" "}
                              <span className="font-medium">
                                {booking.provider}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-900">
                            N{booking.amount}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 p-0 h-auto mt-2"
                          >
                            Details
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="favorites">
                <div className="text-center py-16 bg-white rounded-2xl">
                  <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    No Favorites Yet
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Save your favorite providers for quick booking.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/services")}
                  >
                    Browse Providers
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="addresses">
                <div className="space-y-4">
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <HomeIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-slate-900">
                                Home
                              </h3>
                              <Badge className="bg-blue-100 text-blue-700 text-xs">
                                Default
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">
                              15 Admiralty Way, Lekki Phase 1, Lagos
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Button variant="outline" className="w-full">
                    + Add New Address
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0" />
                    <div>
                      <p className="text-sm text-slate-700">{activity.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/services")}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Rebook a Service
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  Leave a Review
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="w-4 h-4 mr-2" />
                  My Favorite Providers
                </Button>
              </CardContent>
            </Card>

            {/* Promo */}
            <div className="bg-blue-600 rounded-2xl p-6 text-white">
              <Sparkles className="w-8 h-8 mb-3" />
              <h3 className="font-bold text-lg mb-1">Refer & Earn!</h3>
              <p className="text-blue-100 text-sm mb-4">
                Invite friends and earn N500 for each successful referral.
              </p>
              <Button
                variant="secondary"
                className="w-full bg-white text-blue-600 hover:bg-blue-50"
              >
                Share Referral Code
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

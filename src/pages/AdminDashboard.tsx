import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Briefcase,
  ClipboardList,
  DollarSign,
  Star,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  Shield,
  Activity,
} from "lucide-react";

const overviewCards = [
  {
    label: "Total Users",
    value: "2,456",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Active Providers",
    value: "486",
    change: "+8%",
    trend: "up",
    icon: Briefcase,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Total Bookings",
    value: "1,892",
    change: "+24%",
    trend: "up",
    icon: ClipboardList,
    color: "bg-violet-50 text-violet-600",
  },
  {
    label: "Revenue",
    value: "N12.4M",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
    color: "bg-amber-50 text-amber-600",
  },
];

const recentBookings = [
  { id: "#1284", customer: "Amara Okafor", service: "House Cleaning", amount: "12,000", status: "confirmed", time: "10 min ago" },
  { id: "#1283", customer: "Tunde Bakare", service: "Deep Cleaning", amount: "25,000", status: "in_progress", time: "32 min ago" },
  { id: "#1282", customer: "Ngozi Eze", service: "Office Cleaning", amount: "45,000", status: "completed", time: "1 hr ago" },
  { id: "#1281", customer: "Ibrahim K", service: "Fumigation", amount: "15,000", status: "pending", time: "2 hrs ago" },
  { id: "#1280", customer: "Chioma A", service: "Laundry", amount: "5,500", status: "completed", time: "3 hrs ago" },
];

const pendingVerifications = [
  { id: 1, name: "Emmanuel Okonkwo", type: "Individual", submitted: "2 hrs ago", documents: 3 },
  { id: 2, name: "Sparkle Clean Ltd", type: "Company", submitted: "5 hrs ago", documents: 5 },
  { id: 3, name: "Amina Suleiman", type: "Individual", submitted: "1 day ago", documents: 2 },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  in_progress: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Overview of your platform's performance.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock className="w-4 h-4" />
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {overviewCards.map((card) => (
          <Card key={card.label} className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {card.value}
                  </p>
                  <div className="flex items-center gap-1">
                    {card.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm font-medium text-green-600">
                      {card.change}
                    </span>
                    <span className="text-xs text-slate-400">vs last month</span>
                  </div>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}
                >
                  <card.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Bookings</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/bookings")}
                className="text-blue-600"
              >
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
                      <th className="pb-3 font-medium">ID</th>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Service</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b border-slate-50 last:border-0"
                      >
                        <td className="py-3 text-sm font-medium text-slate-900">
                          {booking.id}
                        </td>
                        <td className="py-3 text-sm text-slate-600">
                          {booking.customer}
                        </td>
                        <td className="py-3 text-sm text-slate-600">
                          {booking.service}
                        </td>
                        <td className="py-3 text-sm font-medium text-slate-900">
                          N{booking.amount}
                        </td>
                        <td className="py-3">
                          <Badge
                            variant="secondary"
                            className={statusColors[booking.status]}
                          >
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-sm text-slate-400">
                          {booking.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pending Verifications */}
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-500" />
                Pending Verifications
              </CardTitle>
              <Badge className="bg-amber-100 text-amber-700">
                {pendingVerifications.length}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingVerifications.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {v.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {v.type} &middot; {v.submitted}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <XCircle className="w-4 h-4 text-red-500" />
                    </Button>
                    <Button size="sm" className="h-8 bg-blue-600">
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/admin/providers")}
              >
                View All Pending
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-base">Platform Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Disputes", value: "3", icon: AlertTriangle, color: "text-red-500" },
                { label: "Avg. Rating", value: "4.8", icon: Star, color: "text-amber-500" },
                { label: "Response Time", value: "2.4h", icon: Activity, color: "text-blue-500" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-sm text-slate-600">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

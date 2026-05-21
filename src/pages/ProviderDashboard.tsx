import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DollarSign,
  Star,
  ClipboardList,
  Clock,
  TrendingUp,
  Calendar,
  MapPin,
  ChevronRight,
  Wallet,
  Award,
  CheckCircle2,
  XCircle,
  User,
  Briefcase,
  Bell,
} from "lucide-react";

const mockJobs = [
  {
    id: 1,
    service: "House Cleaning",
    customer: "Amara O.",
    date: "Today, 10:00 AM",
    location: "Lekki Phase 1",
    amount: "10,200",
    status: "upcoming",
  },
  {
    id: 2,
    service: "Deep Cleaning",
    customer: "Tunde B.",
    date: "Today, 02:00 PM",
    location: "Ikeja GRA",
    amount: "21,250",
    status: "upcoming",
  },
  {
    id: 3,
    service: "Office Cleaning",
    customer: "Ngozi E.",
    date: "Yesterday",
    location: "Victoria Island",
    amount: "17,000",
    status: "completed",
  },
  {
    id: 4,
    service: "Fumigation",
    customer: "Ibrahim K.",
    date: "May 8",
    location: "Yaba",
    amount: "12,750",
    status: "completed",
  },
];

const earningsData = [
  { label: "Today's Earnings", value: "N31,450", change: "+12%" },
  { label: "This Week", value: "N142,800", change: "+8%" },
  { label: "This Month", value: "N486,200", change: "+15%" },
  { label: "Pending Payout", value: "N52,000", change: "" },
];

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState("jobs");

  const stats = [
    {
      label: "Total Earnings",
      value: "N486K",
      icon: DollarSign,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Jobs Completed",
      value: "48",
      icon: ClipboardList,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Rating",
      value: "4.9",
      icon: Star,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Response Time",
      value: "12 min",
      icon: Clock,
      color: "bg-violet-50 text-violet-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Provider Dashboard
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
                <Badge className="bg-amber-100 text-amber-700">
                  <Award className="w-3 h-3 mr-1" />
                  Gold
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm">
              <span className="text-sm text-slate-600">Available</span>
              <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
            </div>
            <Button variant="outline">
              <Bell className="w-4 h-4" />
            </Button>
          </div>
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
                <TabsTrigger value="jobs">My Jobs</TabsTrigger>
                <TabsTrigger value="earnings">Earnings</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="jobs" className="space-y-4">
                {mockJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="border-0 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-slate-900">
                              {job.service}
                            </h3>
                            <Badge
                              variant="secondary"
                              className={
                                job.status === "upcoming"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                              }
                            >
                              {job.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <User className="w-4 h-4" />
                            {job.customer}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {job.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-900">
                            N{job.amount}
                          </p>
                          {job.status === "upcoming" && (
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="outline" className="h-8">
                                <XCircle className="w-3 h-3 mr-1" />
                                Decline
                              </Button>
                              <Button size="sm" className="h-8 bg-blue-600">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Accept
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="earnings" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {earningsData.map((item) => (
                    <Card key={item.label} className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <p className="text-xs text-slate-500 mb-1">
                          {item.label}
                        </p>
                        <p className="text-xl font-bold text-slate-900">
                          {item.value}
                        </p>
                        {item.change && (
                          <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3" />
                            {item.change}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { desc: "House Cleaning - Amara O.", amount: "+N10,200", date: "Today" },
                      { desc: "Deep Cleaning - Tunde B.", amount: "+N21,250", date: "Today" },
                      { desc: "Withdrawal to Bank", amount: "-N50,000", date: "Yesterday" },
                      { desc: "Office Cleaning - Ngozi E.", amount: "+N17,000", date: "Yesterday" },
                    ].map((tx, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {tx.desc}
                          </p>
                          <p className="text-xs text-slate-500">{tx.date}</p>
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            tx.amount.startsWith("+")
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {tx.amount}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Wallet className="w-4 h-4 mr-2" />
                  Request Withdrawal
                </Button>
              </TabsContent>

              <TabsContent value="schedule">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">This Week</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                        (day, i) => (
                          <div
                            key={day}
                            className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-sm font-semibold text-slate-600">
                                {day.slice(0, 3)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900">
                                  {i < 2 ? `${2 - i} jobs` : "No bookings"}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {i < 2 ? "08:00 - 16:00" : "Off day"}
                                </p>
                              </div>
                            </div>
                            {i < 2 && (
                              <Badge className="bg-blue-100 text-blue-700">
                                Working
                              </Badge>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-base">Profile Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-slate-100 rounded-full h-3 mb-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: "85%" }}
                  />
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  85% Complete - Add portfolio to reach 100%
                </p>
                <div className="space-y-2">
                  {[
                    { label: "ID Verification", done: true },
                    { label: "Bank Details", done: true },
                    { label: "Profile Photo", done: true },
                    { label: "Portfolio Photos", done: false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 text-sm"
                    >
                      {item.done ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300" />
                      )}
                      <span
                        className={
                          item.done ? "text-slate-600" : "text-slate-400"
                        }
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-base">Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Completion Rate", value: "96%", color: "bg-green-500" },
                  { label: "On-Time Rate", value: "98%", color: "bg-blue-500" },
                  { label: "Customer Satisfaction", value: "4.9/5", color: "bg-amber-500" },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600">
                        {metric.label}
                      </span>
                      <span className="text-sm font-semibold text-slate-900">
                        {metric.value}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`${metric.color} h-2 rounded-full`}
                        style={{ width: metric.value.replace(/[^0-9]/g, "") + "%" }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

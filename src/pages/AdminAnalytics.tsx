import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Star,
  MapPin,
} from "lucide-react";

const revenueData = [
  { month: "Jan", revenue: 450000, bookings: 120 },
  { month: "Feb", revenue: 520000, bookings: 145 },
  { month: "Mar", revenue: 680000, bookings: 189 },
  { month: "Apr", revenue: 810000, bookings: 234 },
  { month: "May", revenue: 1240000, bookings: 312 },
];

const topServices = [
  { name: "House Cleaning", bookings: 456, revenue: "N5.2M", growth: "+18%" },
  { name: "Deep Cleaning", bookings: 312, revenue: "N7.8M", growth: "+24%" },
  { name: "Office Cleaning", bookings: 234, revenue: "N10.5M", growth: "+15%" },
  { name: "Fumigation", bookings: 189, revenue: "N2.8M", growth: "+32%" },
  { name: "Laundry", bookings: 167, revenue: "N1.2M", growth: "+10%" },
];

const topLocations = [
  { city: "Lekki", bookings: 534, percentage: 28 },
  { city: "Ikeja", bookings: 423, percentage: 22 },
  { city: "Victoria Island", bookings: 312, percentage: 16 },
  { city: "Yaba", bookings: 234, percentage: 12 },
  { city: "Ikoyi", bookings: 189, percentage: 10 },
];

export default function AdminAnalytics() {
  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">
          Detailed insights into your platform performance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Revenue", value: "N3.7M", change: "+22%", icon: DollarSign },
          { label: "Active Users", value: "2,456", change: "+12%", icon: Users },
          { label: "Avg. Order Value", value: "N8,200", change: "+5%", icon: TrendingUp },
          { label: "Customer Satisfaction", value: "4.8/5", change: "+0.2", icon: Star },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-0 shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-slate-500">{kpi.label}</p>
                <kpi.icon className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
              <p className="text-xs text-green-600 mt-1 font-medium">
                {kpi.change} vs last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueData.map((d) => (
                <div key={d.month}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">{d.month}</span>
                    <span className="text-sm font-medium text-slate-900">
                      N{(d.revenue / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-4">
                    <div
                      className="bg-blue-600 h-4 rounded-full transition-all"
                      style={{
                        width: `${(d.revenue / maxRevenue) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Services */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">Top Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topServices.map((service, i) => (
              <div
                key={service.name}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-semibold text-slate-600">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {service.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {service.bookings} bookings
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {service.revenue}
                  </p>
                  <p className="text-xs text-green-600">{service.growth}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topLocations.map((loc) => (
              <div key={loc.city}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">{loc.city}</span>
                  <span className="text-sm font-medium text-slate-900">
                    {loc.bookings} bookings
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full"
                    style={{ width: `${loc.percentage * 3}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Customer Retention */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">Customer Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Repeat Customer Rate", value: "68%", color: "bg-blue-500" },
              { label: "Customer Retention", value: "82%", color: "bg-green-500" },
              { label: "Referral Rate", value: "34%", color: "bg-amber-500" },
              { label: "Churn Rate", value: "8%", color: "bg-red-400" },
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
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className={`${metric.color} h-3 rounded-full`}
                    style={{ width: metric.value }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/providers/trpc";
import { RevenueAreaChart, SeriesBarChart, StatusBarChart } from "@/components/charts";
import { TrendingUp, Users, DollarSign, Star } from "lucide-react";

const naira = (v: string | number) =>
  "₦" + Number(v).toLocaleString("en-NG", { maximumFractionDigits: 0 });

export default function AdminAnalytics() {
  const { data: stats } = trpc.admin.dashboard.useQuery();
  const { data: series } = trpc.admin.revenueTimeSeries.useQuery();
  const { data: analytics } = trpc.admin.bookingAnalytics.useQuery();

  const kpis = [
    { label: "Total Revenue", value: stats ? naira(stats.finance.totalRevenue) : undefined, icon: DollarSign },
    { label: "Active Users", value: stats?.users.total, icon: Users },
    { label: "Avg. Order Value", value: analytics ? naira(analytics.averageOrderValue) : undefined, icon: TrendingUp },
    { label: "Avg. Rating", value: stats ? `${stats.reviews.averageRating}/5` : undefined, icon: Star },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">
          Detailed insights into your platform performance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border-ink/12 shadow-hard-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-slate-500">{kpi.label}</p>
                <kpi.icon className="w-5 h-5 text-brand" />
              </div>
              {kpi.value === undefined ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-ink/12 shadow-hard-sm">
          <CardHeader>
            <CardTitle className="text-base">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {series ? (
              <RevenueAreaChart data={series.monthly} />
            ) : (
              <Skeleton className="h-[240px] w-full" />
            )}
          </CardContent>
        </Card>

        <Card className="border-ink/12 shadow-hard-sm">
          <CardHeader>
            <CardTitle className="text-base">Bookings per month</CardTitle>
          </CardHeader>
          <CardContent>
            {series ? (
              <SeriesBarChart
                data={series.monthly}
                xKey="month"
                dataKey="bookings"
                label="Bookings"
                color="hsl(217 91% 60%)"
              />
            ) : (
              <Skeleton className="h-[240px] w-full" />
            )}
          </CardContent>
        </Card>

        <Card className="border-ink/12 shadow-hard-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Booking status distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics ? (
              <StatusBarChart counts={analytics.statusDistribution} />
            ) : (
              <Skeleton className="h-[240px] w-full" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

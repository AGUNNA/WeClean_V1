import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/providers/trpc";
import { RevenueAreaChart, StatusBarChart } from "@/components/charts";
import {
  Users,
  Briefcase,
  ClipboardList,
  DollarSign,
  Star,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Shield,
  Activity,
} from "lucide-react";

const naira = (v: string | number) =>
  "₦" + Number(v).toLocaleString("en-NG", { maximumFractionDigits: 0 });

const statusColors: Record<string, string> = {
  confirmed: "bg-brand-100 text-brand-700",
  completed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  provider_assigned: "bg-cyan-100 text-cyan-700",
  in_progress: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-700",
  disputed: "bg-rose-100 text-rose-700",
  refunded: "bg-slate-100 text-slate-600",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: stats, isLoading } = trpc.admin.dashboard.useQuery();
  const { data: recent } = trpc.admin.recentBookings.useQuery({ limit: 6 });
  const { data: series } = trpc.admin.revenueTimeSeries.useQuery();

  const cards = [
    { label: "Total Users", value: stats?.users.total, sub: `${stats?.users.newThisMonth ?? 0} new this month`, icon: Users, color: "bg-brand-50 text-brand" },
    { label: "Active Providers", value: stats?.providers.active, sub: `${stats?.providers.pending ?? 0} pending review`, icon: Briefcase, color: "bg-emerald-50 text-emerald-600" },
    { label: "Total Bookings", value: stats?.bookings.total, sub: `${stats?.bookings.thisMonth ?? 0} this month`, icon: ClipboardList, color: "bg-violet-50 text-violet-600" },
    { label: "Revenue", value: stats ? naira(stats.finance.totalRevenue) : undefined, sub: `${stats ? naira(stats.finance.totalCommission) : "—"} commission`, icon: DollarSign, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
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

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <Card key={card.label} className="border-ink/12 shadow-hard-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-sm text-slate-500">{card.label}</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                  )}
                  <p className="text-xs text-slate-400">{card.sub}</p>
                </div>
                <div className={`w-12 h-12 rounded-md flex items-center justify-center ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-ink/12 shadow-hard-sm">
          <CardHeader>
            <CardTitle className="text-base">Revenue (last 6 months)</CardTitle>
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
            <CardTitle className="text-base">Bookings by status</CardTitle>
          </CardHeader>
          <CardContent>
            {series ? (
              <StatusBarChart counts={series.statusCounts} />
            ) : (
              <Skeleton className="h-[240px] w-full" />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent bookings */}
        <div className="lg:col-span-2">
          <Card className="border-ink/12 shadow-hard-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Bookings</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/bookings")}
                className="text-brand"
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
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(recent ?? []).map((b) => (
                      <tr key={b.id} className="border-b border-slate-50 last:border-ink/12">
                        <td className="py-3 text-sm font-medium text-slate-900">#{b.id}</td>
                        <td className="py-3 text-sm text-slate-600">{b.customerName ?? "—"}</td>
                        <td className="py-3 text-sm font-medium text-slate-900">{naira(b.totalAmount)}</td>
                        <td className="py-3">
                          <Badge variant="secondary" className={statusColors[b.status]}>
                            {b.status.replace(/_/g, " ")}
                          </Badge>
                        </td>
                        <td className="py-3 text-sm text-slate-400">
                          {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health sidebar */}
        <div className="space-y-6">
          <Card className="border-ink/12 shadow-hard-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-500" />
                Needs attention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Pending verifications", value: stats?.providers.pending ?? 0, to: "/admin/providers" },
                { label: "Pending withdrawals", value: stats?.finance.pendingWithdrawals ?? 0, to: "/admin/withdrawals" },
                { label: "Open disputes", value: stats?.disputes.open ?? 0, to: "/admin/bookings" },
                { label: "Flagged reviews", value: stats?.reviews.flagged ?? 0, to: "/admin/analytics" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.to)}
                  className="w-full flex items-center justify-between p-3 bg-cream rounded-md hover:bg-slate-100 transition-colors text-left"
                >
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <Badge className="bg-amber-100 text-amber-700">{item.value}</Badge>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-ink/12 shadow-hard-sm">
            <CardHeader>
              <CardTitle className="text-base">Platform Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Disputes", value: stats?.disputes.total ?? 0, icon: AlertTriangle, color: "text-red-500" },
                { label: "Avg. Rating", value: stats?.reviews.averageRating ?? "—", icon: Star, color: "text-amber-500" },
                { label: "Completed", value: stats?.bookings.completed ?? 0, icon: Activity, color: "text-brand" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-sm text-slate-600">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/providers/trpc";
import { RevenueAreaChart, StatusBarChart } from "@/components/charts";
import {
  ClipboardList,
  CheckCircle2,
  Wallet,
  Users,
  Star,
  TrendingUp,
  Activity,
} from "lucide-react";

const naira = (v: string | number) =>
  "₦" + Number(v).toLocaleString("en-NG", { maximumFractionDigits: 0 });

export default function BusinessDashboard() {
  const { data, isLoading } = trpc.business.dashboard.useQuery();

  const kpis = data?.kpis;
  const cards = [
    { label: "Total Bookings", value: kpis?.totalBookings ?? 0, icon: ClipboardList, color: "bg-brand-50 text-brand" },
    { label: "Completed", value: kpis?.completed ?? 0, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
    { label: "Active Jobs", value: kpis?.active ?? 0, icon: Activity, color: "bg-violet-50 text-violet-600" },
    { label: "Revenue", value: kpis ? naira(kpis.revenue) : "₦0", icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
    { label: "Wallet Balance", value: kpis ? naira(kpis.walletBalance) : "₦0", icon: Wallet, color: "bg-green-50 text-green-600" },
    { label: "Staff", value: kpis?.staffCount ?? 0, icon: Users, color: "bg-cyan-50 text-cyan-600" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              {data?.business.name ?? "Business Dashboard"}
            </h1>
            {data && (
              <Badge
                className={
                  data.business.verificationStatus === "verified"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }
              >
                {data.business.verificationStatus}
              </Badge>
            )}
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Performance overview for your cleaning business.
          </p>
        </div>
        {kpis && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Star className="w-4 h-4 text-amber-500" />
            {kpis.rating} avg rating
          </div>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {cards.map((card) => (
          <Card key={card.label} className="border-ink/12 shadow-hard-sm">
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-md flex items-center justify-center mb-3 ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              {isLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-ink/12 shadow-hard-sm">
          <CardHeader>
            <CardTitle className="text-base">Revenue (last 6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[240px] w-full" />
            ) : (
              <RevenueAreaChart
                data={data?.revenueByMonth ?? []}
                color="hsl(160 84% 39%)"
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-ink/12 shadow-hard-sm">
          <CardHeader>
            <CardTitle className="text-base">Bookings by status</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[240px] w-full" />
            ) : (
              <StatusBarChart counts={data?.statusDistribution ?? {}} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  DollarSign,
  Star,
  ClipboardList,
  CheckCircle2,
  Wallet,
  Calendar,
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
};

export default function ProviderDashboard() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const { data: profile, isLoading } = trpc.provider.myProfile.useQuery();
  const { data: jobs } = trpc.booking.providerBookings.useQuery({ limit: 20 });

  const setAvailability = trpc.provider.updateAvailability.useMutation({
    onSuccess: () => {
      utils.provider.myProfile.invalidate();
      toast.success("Availability updated");
    },
    onError: (e) => toast.error(e.message),
  });

  const completed = (jobs ?? []).filter((j) => j.status === "completed");
  const earnings = completed.reduce(
    (s, j) => s + parseFloat(j.providerEarnings || "0"),
    0
  );

  const stats = [
    { label: "Rating", value: profile?.overallRating ?? "0.0", icon: Star, color: "bg-amber-50 text-amber-600" },
    { label: "Jobs Completed", value: profile?.totalJobsCompleted ?? 0, icon: ClipboardList, color: "bg-brand-50 text-brand" },
    { label: "Wallet Balance", value: naira(profile?.walletBalance ?? "0"), icon: Wallet, color: "bg-green-50 text-green-600" },
    { label: "Completion Rate", value: `${profile?.completionRate ?? "0"}%`, icon: CheckCircle2, color: "bg-violet-50 text-violet-600" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome, {user?.name?.split(" ")[0] || "Pro"}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            {profile && (
              <Badge
                className={
                  profile.verificationStatus === "verified"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }
              >
                {profile.verificationStatus}
              </Badge>
            )}
            {profile?.badge && profile.badge !== "none" && (
              <Badge className="bg-amber-100 text-amber-700 capitalize">{profile.badge}</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 bg-paper border border-ink/12 rounded-md px-4 py-2">
          <span className="text-sm text-slate-600">Available for jobs</span>
          <Switch
            checked={!!profile?.isAvailable}
            onCheckedChange={(v) => setAvailability.mutate({ isAvailable: v })}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label} className="border-ink/12 shadow-hard-sm">
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-md flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              {isLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent jobs + earnings */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="border-ink/12 shadow-hard-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!jobs?.length ? (
              <p className="text-sm text-slate-400 py-8 text-center">
                No jobs assigned yet.
              </p>
            ) : (
              jobs.slice(0, 8).map((j) => (
                <div
                  key={j.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-slate-100 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">Booking #{j.id}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {j.scheduledDate ? new Date(j.scheduledDate).toLocaleDateString() : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className={statusColors[j.status]}>
                      {j.status.replace(/_/g, " ")}
                    </Badge>
                    <span className="text-sm font-semibold text-slate-900">{naira(j.totalAmount)}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-ink/12 shadow-hard-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-brand" />
              Earnings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-slate-500">From completed jobs</p>
              <p className="text-3xl font-bold text-slate-900">{naira(earnings)}</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Completed jobs</span>
              <span className="font-semibold">{completed.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Total assigned</span>
              <span className="font-semibold">{jobs?.length ?? 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

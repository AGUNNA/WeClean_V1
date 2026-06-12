import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Calendar, MapPin } from "lucide-react";

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

// Allowed next status from the provider's side.
const nextAction: Record<string, { to: string; label: string } | undefined> = {
  pending: { to: "confirmed", label: "Accept" },
  provider_assigned: { to: "confirmed", label: "Accept" },
  confirmed: { to: "in_progress", label: "Start job" },
  in_progress: { to: "completed", label: "Mark complete" },
};

export default function ProviderJobs() {
  const utils = trpc.useUtils();
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: jobs, isLoading } = trpc.booking.providerBookings.useQuery({ limit: 100 });

  const updateStatus = trpc.booking.updateStatus.useMutation({
    onSuccess: () => {
      utils.booking.providerBookings.invalidate();
      utils.provider.myProfile.invalidate();
      toast.success("Job updated");
    },
    onError: (e) => toast.error(e.message),
  });

  const filtered = (jobs ?? []).filter(
    (j) => statusFilter === "all" || j.status === statusFilter
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Jobs</h1>
          <p className="text-slate-500 text-sm mt-1">
            Accept, start, and complete your assigned cleanings.
          </p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {["all", "pending", "confirmed", "in_progress", "completed", "cancelled"].map((s) => (
              <SelectItem key={s} value={s}>
                {s === "all" ? "All jobs" : s.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : !filtered.length ? (
        <p className="text-sm text-slate-400 py-12 text-center">No jobs to show.</p>
      ) : (
        <div className="grid gap-4">
          {filtered.map((j) => {
            const action = nextAction[j.status];
            return (
              <Card key={j.id} className="border-ink/12 shadow-hard-sm">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-900">Booking #{j.id}</h3>
                        <Badge variant="secondary" className={statusColors[j.status]}>
                          {j.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {j.scheduledDate ? new Date(j.scheduledDate).toLocaleDateString() : "—"}
                        </span>
                        {j.propertyType && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {j.propertyType}
                          </span>
                        )}
                        <span className="font-semibold text-slate-900">{naira(j.totalAmount)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {action && (
                        <Button
                          size="sm"
                          className="bg-brand hover:bg-brand-700 text-white"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate({ bookingId: j.id, status: action.to as never })
                          }
                        >
                          {action.label}
                        </Button>
                      )}
                      {["pending", "provider_assigned", "confirmed"].includes(j.status) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate({ bookingId: j.id, status: "cancelled" as never })
                          }
                        >
                          Decline
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

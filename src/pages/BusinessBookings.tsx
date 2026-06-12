import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { ClipboardList } from "lucide-react";

const naira = (v: string | number) =>
  "₦" + Number(v).toLocaleString("en-NG", { maximumFractionDigits: 0 });

const statusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-brand-100 text-brand-700",
  provider_assigned: "bg-cyan-100 text-cyan-700",
  in_progress: "bg-violet-100 text-violet-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  disputed: "bg-rose-100 text-rose-700",
  refunded: "bg-slate-100 text-slate-600",
};

const NEXT_STATUS: Record<string, { value: string; label: string } | undefined> = {
  pending: { value: "confirmed", label: "Confirm" },
  confirmed: { value: "provider_assigned", label: "Mark assigned" },
  provider_assigned: { value: "in_progress", label: "Start" },
  in_progress: { value: "completed", label: "Complete" },
};

export default function BusinessBookings() {
  const [status, setStatus] = useState<string>("all");
  const utils = trpc.useUtils();
  const { data: bookings, isLoading } = trpc.business.listBookings.useQuery(
    status === "all" ? {} : { status }
  );
  const { data: staff } = trpc.business.listStaff.useQuery();

  const assign = trpc.business.assignBooking.useMutation({
    onSuccess: () => {
      toast.success("Staff assigned");
      utils.business.listBookings.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });
  const updateStatus = trpc.booking.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Booking updated");
      utils.business.listBookings.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
          <p className="text-slate-500 text-sm mt-1">
            Assign staff and move jobs through their lifecycle.
          </p>
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            {["all", "pending", "confirmed", "provider_assigned", "in_progress", "completed", "cancelled"].map((s) => (
              <SelectItem key={s} value={s}>
                {s === "all" ? "All statuses" : s.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="border-ink/12 shadow-hard-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !bookings?.length ? (
            <Empty className="py-16">
              <EmptyHeader>
                <ClipboardList className="w-10 h-10 text-slate-300 mx-auto" />
                <EmptyTitle>No bookings</EmptyTitle>
                <EmptyDescription>
                  Bookings routed to your business will appear here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assign staff</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => {
                  const next = NEXT_STATUS[b.status];
                  return (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">#{b.id}</TableCell>
                      <TableCell>{b.customerName ?? "—"}</TableCell>
                      <TableCell className="text-slate-500">
                        {b.scheduledDate ? new Date(b.scheduledDate).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="font-medium">{naira(b.totalAmount)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusColor[b.status]}>
                          {b.status.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={b.providerId ? String(b.providerId) : undefined}
                          onValueChange={(v) =>
                            assign.mutate({ bookingId: b.id, providerId: Number(v) })
                          }
                        >
                          <SelectTrigger className="w-40 h-8">
                            <SelectValue placeholder="Unassigned" />
                          </SelectTrigger>
                          <SelectContent>
                            {staff
                              ?.filter((s) => s.providerProfileId)
                              .map((s) => (
                                <SelectItem key={s.id} value={String(s.providerProfileId)}>
                                  {s.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        {next ? (
                          <Button
                            size="sm"
                            className="h-8 bg-emerald-600 hover:bg-emerald-700"
                            disabled={updateStatus.isPending}
                            onClick={() =>
                              updateStatus.mutate({
                                bookingId: b.id,
                                status: next.value as never,
                              })
                            }
                          >
                            {next.label}
                          </Button>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

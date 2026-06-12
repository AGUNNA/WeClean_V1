import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Search, Filter, Calendar } from "lucide-react";

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

export default function AdminBookings() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: bookings, isLoading } = trpc.admin.recentBookings.useQuery({ limit: 100 });

  const filtered = (bookings ?? []).filter((b) => {
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      (b.customerName ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(b.id).includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitor all platform bookings.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {["all", "pending", "confirmed", "provider_assigned", "in_progress", "completed", "cancelled", "disputed", "refunded"].map((s) => (
              <SelectItem key={s} value={s}>
                {s === "all" ? "All Status" : s.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="border-ink/12 shadow-hard-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b border-slate-100 bg-cream/50">
                    <th className="py-4 px-6 font-medium">ID</th>
                    <th className="py-4 px-6 font-medium">Customer</th>
                    <th className="py-4 px-6 font-medium">Amount</th>
                    <th className="py-4 px-6 font-medium">Status</th>
                    <th className="py-4 px-6 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id} className="border-b border-slate-50 last:border-ink/12 hover:bg-cream/50 transition-colors">
                      <td className="py-4 px-6 text-sm font-semibold text-brand">#{b.id}</td>
                      <td className="py-4 px-6 text-sm text-slate-900">{b.customerName ?? "—"}</td>
                      <td className="py-4 px-6 text-sm font-medium text-slate-900">{naira(b.totalAmount)}</td>
                      <td className="py-4 px-6">
                        <Badge variant="secondary" className={statusColors[b.status]}>
                          {b.status.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

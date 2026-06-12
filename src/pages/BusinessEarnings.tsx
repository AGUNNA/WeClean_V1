import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { SeriesBarChart } from "@/components/charts";
import { Wallet, TrendingUp, Banknote } from "lucide-react";

const naira = (v: string | number) =>
  "₦" + Number(v).toLocaleString("en-NG", { maximumFractionDigits: 0 });

const statusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-brand-100 text-brand-700",
  completed: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

export default function BusinessEarnings() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.business.earnings.useQuery();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const request = trpc.business.requestWithdrawal.useMutation({
    onSuccess: () => {
      toast.success("Withdrawal requested");
      utils.business.earnings.invalidate();
      setOpen(false);
      setAmount("");
    },
    onError: (e) => toast.error(e.message),
  });

  const stats = [
    { label: "Wallet Balance", value: data ? naira(data.walletBalance) : "—", icon: Wallet, color: "bg-green-50 text-green-600" },
    { label: "Gross Revenue", value: data ? naira(data.grossRevenue) : "—", icon: TrendingUp, color: "bg-brand-50 text-brand" },
    { label: "Net Earnings", value: data ? naira(data.netEarnings) : "—", icon: Banknote, color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Earnings</h1>
          <p className="text-slate-500 text-sm mt-1">
            Track revenue and request payouts to your bank.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Wallet className="w-4 h-4 mr-2" />
              Request withdrawal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request a withdrawal</DialogTitle>
            </DialogHeader>
            <div className="py-2">
              <label className="text-sm text-slate-600 mb-1.5 block">
                Amount (available: {data ? naira(data.walletBalance) : "—"})
              </label>
              <Input
                type="number"
                placeholder="50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={!amount || request.isPending}
                onClick={() => request.mutate({ amount })}
              >
                Submit request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (
          <Card key={s.label} className="border-ink/12 shadow-hard-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-md flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                {isLoading ? (
                  <Skeleton className="h-6 w-20" />
                ) : (
                  <p className="text-xl font-bold text-slate-900">{s.value}</p>
                )}
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-ink/12 shadow-hard-sm">
          <CardHeader>
            <CardTitle className="text-base">Revenue (last 6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[240px] w-full" />
            ) : (
              <SeriesBarChart
                data={data?.monthly ?? []}
                xKey="month"
                dataKey="revenue"
                label="Revenue"
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-ink/12 shadow-hard-sm">
          <CardHeader>
            <CardTitle className="text-base">Withdrawal history</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : !data?.withdrawals.length ? (
              <p className="text-sm text-slate-400 p-6">No withdrawals yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.withdrawals.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell className="text-slate-500">
                        {w.createdAt ? new Date(w.createdAt).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="font-medium">{naira(w.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusColor[w.status]}>
                          {w.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

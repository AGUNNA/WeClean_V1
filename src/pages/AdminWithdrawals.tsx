import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { CheckCircle2, XCircle, Wallet } from "lucide-react";

const naira = (v: string | number) =>
  "₦" + Number(v).toLocaleString("en-NG", { maximumFractionDigits: 0 });

const statusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-brand-100 text-brand-700",
  completed: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

export default function AdminWithdrawals() {
  const [tab, setTab] = useState("pending");
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.listWithdrawals.useQuery(
    tab === "all" ? {} : { status: tab }
  );

  const process = trpc.admin.processWithdrawal.useMutation({
    onSuccess: () => {
      toast.success("Withdrawal processed");
      utils.admin.listWithdrawals.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-md bg-green-50 text-green-600 flex items-center justify-center">
          <Wallet className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Withdrawals</h1>
          <p className="text-slate-500 text-sm">
            Review and process provider & business payout requests.
          </p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList>
          {["pending", "processing", "completed", "rejected", "all"].map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize">
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card className="border-ink/12 shadow-hard-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !data?.length ? (
            <p className="text-sm text-slate-400 p-8 text-center">
              No {tab !== "all" ? tab : ""} withdrawals.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="font-medium">#{w.id}</TableCell>
                    <TableCell className="text-slate-600">
                      {w.businessId ? `Business #${w.businessId}` : `Provider #${w.providerId}`}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {w.bankName} · {w.accountNumber}
                    </TableCell>
                    <TableCell className="font-semibold">{naira(w.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColor[w.status]}>
                        {w.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {w.status === "pending" || w.status === "processing" ? (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-red-600"
                            disabled={process.isPending}
                            onClick={() =>
                              process.mutate({ id: w.id, decision: "rejected", rejectionReason: "Rejected by admin" })
                            }
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 bg-emerald-600 hover:bg-emerald-700"
                            disabled={process.isPending}
                            onClick={() => process.mutate({ id: w.id, decision: "completed" })}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

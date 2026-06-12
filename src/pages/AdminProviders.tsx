import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import {
  Search,
  Filter,
  Star,
  MapPin,
  CheckCircle2,
  XCircle,
  Briefcase,
} from "lucide-react";

export default function AdminProviders() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const utils = trpc.useUtils();

  const { data: providers, isLoading } =
    trpc.admin.listProviderVerifications.useQuery({ status: statusFilter });

  const verify = trpc.admin.verifyProvider.useMutation({
    onSuccess: () => {
      toast.success("Provider updated");
      utils.admin.listProviderVerifications.invalidate();
      utils.admin.dashboard.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const filtered = (providers ?? []).filter(
    (p) =>
      !searchQuery ||
      (p.name ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Providers</h1>
          <p className="text-slate-500 text-sm mt-1">
            Review and verify cleaning professionals.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search providers..."
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
            <SelectItem value="all">All providers</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : !filtered.length ? (
        <p className="text-sm text-slate-400 py-12 text-center">
          No providers{statusFilter !== "all" ? ` with status "${statusFilter}"` : ""}.
        </p>
      ) : (
        <div className="grid gap-4">
          {filtered.map((provider) => (
            <Card key={provider.id} className="border-ink/12 ">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-100 rounded-md flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-brand" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                          {provider.name ?? "Unnamed"}
                        </h3>
                        <Badge
                          className={
                            provider.verificationStatus === "verified"
                              ? "bg-green-100 text-green-700"
                              : provider.verificationStatus === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }
                        >
                          {provider.verificationStatus}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {provider.city ?? "—"}
                        </span>
                        <span>{provider.email}</span>
                        <span>{provider.yearsOfExperience ?? 0} yrs exp</span>
                        {provider.idType && (
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {provider.idType}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {provider.verificationStatus !== "verified" && (
                      <Button
                        size="sm"
                        className="h-8 bg-brand hover:bg-brand-700"
                        disabled={verify.isPending}
                        onClick={() =>
                          verify.mutate({ providerId: provider.id, decision: "verified" })
                        }
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Verify
                      </Button>
                    )}
                    {provider.verificationStatus !== "rejected" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-red-600"
                        disabled={verify.isPending}
                        onClick={() =>
                          verify.mutate({ providerId: provider.id, decision: "rejected" })
                        }
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

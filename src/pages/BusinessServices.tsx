import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Check, Plus, Sparkles } from "lucide-react";

const naira = (v: string | number) =>
  "₦" + Number(v).toLocaleString("en-NG", { maximumFractionDigits: 0 });

export default function BusinessServices() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.business.listServices.useQuery();

  const add = trpc.business.addService.useMutation({
    onSuccess: () => {
      toast.success("Service added");
      utils.business.listServices.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });
  const remove = trpc.business.removeService.useMutation({
    onSuccess: () => {
      toast.success("Service removed");
      utils.business.listServices.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const offeredIds = new Set((data?.offered ?? []).map((o) => o.serviceId));

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Services</h1>
        <p className="text-slate-500 text-sm mt-1">
          Choose which services your business offers from the catalogue.
        </p>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.catalogue.map((svc) => {
            const isOffered = offeredIds.has(svc.id);
            return (
              <Card
                key={svc.id}
                className={`border-ink/12 shadow-hard-sm transition-all ${
                  isOffered ? "ring-2 ring-emerald-500/40" : ""
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    {isOffered && (
                      <Badge className="bg-emerald-100 text-emerald-700">
                        <Check className="w-3 h-3 mr-1" />
                        Offered
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-900">{svc.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    from {naira(svc.basePrice)}
                  </p>
                  <Button
                    size="sm"
                    variant={isOffered ? "outline" : "default"}
                    className={`w-full mt-4 ${
                      isOffered ? "" : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                    disabled={add.isPending || remove.isPending}
                    onClick={() =>
                      isOffered
                        ? remove.mutate({ serviceId: svc.id })
                        : add.mutate({ serviceId: svc.id })
                    }
                  >
                    {isOffered ? (
                      "Remove"
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

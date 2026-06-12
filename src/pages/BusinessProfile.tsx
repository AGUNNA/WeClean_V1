import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import ProfileSettings from "@/components/ProfileSettings";
import { Building2 } from "lucide-react";

export default function BusinessProfile() {
  const utils = trpc.useUtils();
  const { data: biz, isLoading } = trpc.business.myBusiness.useQuery();
  const [form, setForm] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    registrationNumber: "",
  });

  useEffect(() => {
    if (biz) {
      setForm({
        name: biz.name ?? "",
        description: biz.description ?? "",
        email: biz.email ?? "",
        phone: biz.phone ?? "",
        website: biz.website ?? "",
        address: biz.address ?? "",
        city: biz.city ?? "",
        state: biz.state ?? "",
        registrationNumber: biz.registrationNumber ?? "",
      });
    }
  }, [biz]);

  const update = trpc.business.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Business profile updated");
      utils.business.myBusiness.invalidate();
      utils.business.dashboard.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Business Profile</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your company details and personal account.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-ink/12 shadow-hard-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Company details
            </CardTitle>
            {biz && (
              <Badge
                className={
                  biz.verificationStatus === "verified"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }
              >
                {biz.verificationStatus}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Business name</Label>
                    <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Registration number</Label>
                    <Input
                      value={form.registrationNumber}
                      onChange={(e) => set("registrationNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input value={form.email} onChange={(e) => set("email", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Phone</Label>
                    <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Website</Label>
                    <Input value={form.website} onChange={(e) => set("website", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>City</Label>
                    <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>State</Label>
                    <Input value={form.state} onChange={(e) => set("state", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Address</Label>
                    <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                  />
                </div>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={update.isPending}
                  onClick={() => update.mutate(form)}
                >
                  Save company details
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <ProfileSettings />
      </div>
    </div>
  );
}

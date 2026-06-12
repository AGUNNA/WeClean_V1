import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import ProfileSettings from "@/components/ProfileSettings";
import { Briefcase, Banknote } from "lucide-react";

export default function ProviderProfile() {
  const utils = trpc.useUtils();
  const { data: profile, isLoading } = trpc.provider.myProfile.useQuery();
  const [form, setForm] = useState({
    bio: "",
    yearsOfExperience: "",
    city: "",
    state: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        bio: profile.bio ?? "",
        yearsOfExperience: String(profile.yearsOfExperience ?? ""),
        city: profile.city ?? "",
        state: profile.state ?? "",
        bankName: profile.bankName ?? "",
        accountNumber: profile.accountNumber ?? "",
        accountName: profile.accountName ?? "",
      });
    }
  }, [profile]);

  const update = trpc.provider.upsertProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated");
      utils.provider.myProfile.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = () =>
    update.mutate({
      bio: form.bio || undefined,
      yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : undefined,
      city: form.city || undefined,
      state: form.state || undefined,
      bankName: form.bankName || undefined,
      accountNumber: form.accountNumber || undefined,
      accountName: form.accountName || undefined,
    });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Provider Profile</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your professional details, payout account, and personal info.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-ink/12 shadow-hard-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand" />
              Professional details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label>Bio</Label>
                  <Textarea rows={3} value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Tell customers about your experience…" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label>Years of experience</Label>
                    <Input type="number" value={form.yearsOfExperience} onChange={(e) => set("yearsOfExperience", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>City</Label>
                    <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>State</Label>
                    <Input value={form.state} onChange={(e) => set("state", e.target.value)} />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Bank account */}
        <Card className="border-ink/12 shadow-hard-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Banknote className="w-4 h-4 text-brand" />
              Bank account (payouts)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Bank name</Label>
                <Input value={form.bankName} onChange={(e) => set("bankName", e.target.value)} placeholder="e.g. GTBank" />
              </div>
              <div className="space-y-1.5">
                <Label>Account number</Label>
                <Input value={form.accountNumber} onChange={(e) => set("accountNumber", e.target.value)} placeholder="0123456789" />
              </div>
              <div className="space-y-1.5">
                <Label>Account name</Label>
                <Input value={form.accountName} onChange={(e) => set("accountName", e.target.value)} placeholder="Account holder name" />
              </div>
            </div>
            <Button className="bg-ink hover:bg-brand text-white" disabled={update.isPending} onClick={save}>
              Save details
            </Button>
          </CardContent>
        </Card>

        <ProfileSettings />
      </div>
    </div>
  );
}

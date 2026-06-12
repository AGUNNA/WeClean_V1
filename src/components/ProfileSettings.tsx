import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import PasswordCard from "@/components/PasswordCard";

/**
 * Reusable account-profile editor used by all roles (admin, business, customer).
 * Edits the signed-in user's own record via auth.updateProfile.
 */
export default function ProfileSettings() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    state: "",
    notificationsEnabled: true,
    smsEnabled: true,
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        phone: user.phone ?? "",
        city: user.city ?? "",
        state: user.state ?? "",
        notificationsEnabled: user.notificationsEnabled ?? true,
        smsEnabled: user.smsEnabled ?? true,
      });
    }
  }, [user]);

  const update = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated");
      utils.auth.me.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
    <Card className="border-ink/12 shadow-hard-sm">
      <CardHeader>
        <CardTitle className="text-base">Account profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.avatar ?? undefined} />
            <AvatarFallback className="bg-slate-100 text-slate-600 text-lg">
              {user?.name?.slice(0, 2).toUpperCase() ?? "ME"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-slate-900">{user?.name}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <p className="text-xs text-slate-400 capitalize mt-0.5">{user?.role}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Full name</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
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

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">Push notifications</p>
              <p className="text-xs text-slate-500">Booking updates and reminders</p>
            </div>
            <Switch
              checked={form.notificationsEnabled}
              onCheckedChange={(v) => set("notificationsEnabled", v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">SMS alerts</p>
              <p className="text-xs text-slate-500">Text messages for key events</p>
            </div>
            <Switch
              checked={form.smsEnabled}
              onCheckedChange={(v) => set("smsEnabled", v)}
            />
          </div>
        </div>

        <Button
          className="bg-brand hover:bg-brand-700"
          disabled={update.isPending}
          onClick={() => update.mutate(form)}
        >
          Save changes
        </Button>
      </CardContent>
    </Card>

    <PasswordCard />
    </div>
  );
}

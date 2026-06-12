import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Percent, Bell, Shield, Mail, MessageSquare } from "lucide-react";
import PasswordCard from "@/components/PasswordCard";

const EDITABLE = [
  { key: "platform_commission_rate", label: "Platform Commission (%)", hint: "Percentage taken from each booking" },
  { key: "min_withdrawal_amount", label: "Minimum Withdrawal (NGN)", hint: "Smallest payout a provider can request" },
  { key: "support_email", label: "Support Email", hint: "Shown to customers for help" },
];

export default function AdminSettings() {
  const utils = trpc.useUtils();
  const { data: settings, isLoading } = trpc.admin.getSettings.useQuery();
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      for (const s of settings) map[s.key] = s.value;
      setValues(map);
    }
  }, [settings]);

  const update = trpc.admin.updateSetting.useMutation({
    onError: (e) => toast.error(e.message),
  });

  async function saveAll() {
    try {
      await Promise.all(
        EDITABLE.map((f) =>
          update.mutateAsync({ key: f.key, value: values[f.key] ?? "" })
        )
      );
      toast.success("Settings saved");
      utils.admin.getSettings.invalidate();
    } catch {
      /* per-mutation toast already fired */
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage platform configuration and policies.
        </p>
      </div>

      <div className="space-y-6">
        {/* Editable platform settings (backed by platform_settings table) */}
        <Card className="border-ink/12 shadow-hard-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Percent className="w-4 h-4 text-brand" />
              Platform configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {EDITABLE.map((f) => (
                  <div key={f.key}>
                    <Label>{f.label}</Label>
                    <Input
                      className="mt-1.5"
                      value={values[f.key] ?? ""}
                      onChange={(e) =>
                        setValues((v) => ({ ...v, [f.key]: e.target.value }))
                      }
                    />
                    <p className="text-xs text-slate-500 mt-1">{f.hint}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Display-only platform policy toggles */}
        <Card className="border-ink/12 shadow-hard-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "SMS Notifications", desc: "Send booking alerts via SMS", icon: MessageSquare },
              { label: "Email Notifications", desc: "Send transactional emails", icon: Mail },
              { label: "Admin Alerts", desc: "Alert admins for disputes and verifications", icon: Shield },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>

        <PasswordCard />

        <div className="flex justify-end gap-4">
          <Button
            className="bg-brand hover:bg-brand-700"
            disabled={update.isPending}
            onClick={saveAll}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

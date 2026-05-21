import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Percent,
  CreditCard,
  Bell,
  Shield,
  Mail,
  MessageSquare,
} from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage platform configuration and policies.
        </p>
      </div>

      <div className="space-y-6">
        {/* Commission Settings */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Percent className="w-4 h-4 text-blue-600" />
              Commission & Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>Platform Commission (%)</Label>
                <Input defaultValue="15" className="mt-1.5" />
                <p className="text-xs text-slate-500 mt-1">
                  Percentage taken from each booking
                </p>
              </div>
              <div>
                <Label>Minimum Booking Amount (NGN)</Label>
                <Input defaultValue="3000" className="mt-1.5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>Emergency Booking Surcharge (%)</Label>
                <Input defaultValue="25" className="mt-1.5" />
              </div>
              <div>
                <Label>Weekend Surcharge (%)</Label>
                <Input defaultValue="10" className="mt-1.5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-green-600" />
              Payment Gateways
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Paystack", connected: true, key: "pk_live_****" },
              { name: "Flutterwave", connected: true, key: "FLWPUBK_live_****" },
            ].map((gateway) => (
              <div
                key={gateway.name}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
              >
                <div>
                  <p className="font-medium text-slate-900">{gateway.name}</p>
                  <p className="text-xs text-slate-500">{gateway.key}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-green-600 font-medium">
                    Connected
                  </span>
                  <Switch defaultChecked={gateway.connected} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-0 shadow-md">
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
              { label: "Push Notifications", desc: "Send push notifications via Firebase", icon: Bell },
              { label: "Admin Alerts", desc: "Alert admins for disputes and verifications", icon: Shield },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* KYC Settings */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600" />
              Verification & KYC
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Require ID Verification", desc: "All providers must verify identity" },
              { label: "Require BVN", desc: "Bank Verification Number for payouts" },
              { label: "Background Checks", desc: "Run background checks on all providers" },
              { label: "Insurance Required", desc: "Providers must have liability insurance" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline">Reset to Defaults</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

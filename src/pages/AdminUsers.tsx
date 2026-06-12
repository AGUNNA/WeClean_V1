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
import { toast } from "sonner";
import { Search, Shield, Briefcase, UserCircle, Building2 } from "lucide-react";

const roleIcons: Record<string, typeof UserCircle> = {
  user: UserCircle,
  provider: Briefcase,
  business: Building2,
  admin: Shield,
  superadmin: Shield,
};

const roleColor: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700",
  superadmin: "bg-purple-100 text-purple-700",
  provider: "bg-brand-100 text-brand-700",
  business: "bg-emerald-100 text-emerald-700",
  user: "bg-slate-100 text-slate-700",
};

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const utils = trpc.useUtils();

  const { data: users, isLoading } = trpc.admin.listUsers.useQuery(
    roleFilter === "all" ? { limit: 100 } : { role: roleFilter, limit: 100 }
  );

  const update = trpc.admin.updateUser.useMutation({
    onSuccess: () => {
      toast.success("User updated");
      utils.admin.listUsers.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const filtered = (users ?? []).filter(
    (u) =>
      !search ||
      (u.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all platform users.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="user">Customers</SelectItem>
            <SelectItem value="provider">Providers</SelectItem>
            <SelectItem value="business">Businesses</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
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
                    <th className="py-4 px-6 font-medium">User</th>
                    <th className="py-4 px-6 font-medium">Role</th>
                    <th className="py-4 px-6 font-medium">Status</th>
                    <th className="py-4 px-6 font-medium">Location</th>
                    <th className="py-4 px-6 font-medium">Joined</th>
                    <th className="py-4 px-6 font-medium">Change role</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => {
                    const RoleIcon = roleIcons[user.role] || UserCircle;
                    return (
                      <tr key={user.id} className="border-b border-slate-50 last:border-ink/12 hover:bg-cream/50">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-brand-100 rounded-full flex items-center justify-center">
                              <RoleIcon className="w-4 h-4 text-brand" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{user.name ?? "—"}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant="secondary" className={roleColor[user.role]}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <Badge className={user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                            {user.isActive ? "active" : "inactive"}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600">
                          {user.city ?? "—"}
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-500">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-4 px-6">
                          <Select
                            value={user.role}
                            onValueChange={(v) =>
                              update.mutate({ userId: user.id, role: v as never })
                            }
                          >
                            <SelectTrigger className="w-32 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">Customer</SelectItem>
                              <SelectItem value="provider">Provider</SelectItem>
                              <SelectItem value="business">Business</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

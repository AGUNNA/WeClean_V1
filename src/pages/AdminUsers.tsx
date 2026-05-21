import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Users,
  Shield,
  Briefcase,
  UserCircle,
  Ban,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";

const allUsers = [
  { id: 1, name: "Amara Okafor", email: "amara@email.com", role: "user", status: "active", joinDate: "Jan 2025", bookings: 12 },
  { id: 2, name: "Tunde Bakare", email: "tunde@email.com", role: "user", status: "active", joinDate: "Feb 2025", bookings: 8 },
  { id: 3, name: "Chioma Adeleke", email: "chioma@email.com", role: "provider", status: "active", joinDate: "Jan 2025", bookings: 156 },
  { id: 4, name: "Admin User", email: "admin@cleanpro.ng", role: "admin", status: "active", joinDate: "Dec 2024", bookings: 0 },
  { id: 5, name: "Ngozi Eze", email: "ngozi@email.com", role: "user", status: "active", joinDate: "Mar 2025", bookings: 5 },
  { id: 6, name: "Emmanuel Okonkwo", email: "emma@email.com", role: "provider", status: "pending", joinDate: "May 2026", bookings: 0 },
];

const roleIcons: Record<string, any> = {
  user: UserCircle,
  provider: Briefcase,
  admin: Shield,
};

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const filtered = allUsers.filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage all platform users.
          </p>
        </div>
      </div>

      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-slate-100 bg-slate-50/50">
                  <th className="py-4 px-6 font-medium">User</th>
                  <th className="py-4 px-6 font-medium">Role</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                  <th className="py-4 px-6 font-medium">Bookings</th>
                  <th className="py-4 px-6 font-medium">Joined</th>
                  <th className="py-4 px-6 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => {
                  const RoleIcon = roleIcons[user.role] || UserCircle;
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                            <RoleIcon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          variant="secondary"
                          className={
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : user.role === "provider"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-700"
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <Badge className="bg-green-100 text-green-700">
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600">
                        {user.bookings}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500">
                        {user.joinDate}
                      </td>
                      <td className="py-4 px-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

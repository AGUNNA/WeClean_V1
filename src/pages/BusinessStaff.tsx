import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { UserPlus, Trash2, Star } from "lucide-react";

const statusColor: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  invited: "bg-amber-100 text-amber-700",
  suspended: "bg-red-100 text-red-700",
};

export default function BusinessStaff() {
  const utils = trpc.useUtils();
  const { data: staff, isLoading } = trpc.business.listStaff.useQuery();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"manager" | "cleaner">("cleaner");

  const invite = trpc.business.inviteStaff.useMutation({
    onSuccess: () => {
      toast.success("Staff member added");
      utils.business.listStaff.invalidate();
      setOpen(false);
      setEmail("");
    },
    onError: (e) => toast.error(e.message),
  });
  const update = trpc.business.updateStaff.useMutation({
    onSuccess: () => {
      toast.success("Updated");
      utils.business.listStaff.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });
  const remove = trpc.business.removeStaff.useMutation({
    onSuccess: () => {
      toast.success("Removed");
      utils.business.listStaff.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage the cleaners and managers in your business.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Add staff
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a staff member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <label className="text-sm text-slate-600 mb-1.5 block">
                  Their account email
                </label>
                <Input
                  type="email"
                  placeholder="cleaner@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-slate-400 mt-1">
                  The person must already have a WeClean account.
                </p>
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1.5 block">Role</label>
                <Select value={role} onValueChange={(v) => setRole(v as never)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleaner">Cleaner</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={!email || invite.isPending}
                onClick={() => invite.mutate({ email, role })}
              >
                Send invite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff?.map((s) => (
            <Card key={s.id} className="border-ink/12 shadow-hard-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        {s.name?.slice(0, 2).toUpperCase() ?? "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.email}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={statusColor[s.status]}>
                    {s.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    {s.rating ?? "—"}
                  </span>
                  <span>{s.jobsCompleted ?? 0} jobs</span>
                  <span className="capitalize">{s.role}</span>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Select
                    value={s.status}
                    onValueChange={(v) =>
                      update.mutate({ staffId: s.id, status: v as never })
                    }
                  >
                    <SelectTrigger className="h-8 flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="invited">Invited</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                    onClick={() => remove.mutate({ staffId: s.id })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

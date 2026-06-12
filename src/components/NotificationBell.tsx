import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/providers/trpc";
import { Bell, CheckCheck, Inbox } from "lucide-react";

function timeAgo(d: Date | string | null) {
  if (!d) return "";
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationBell() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const { data: unread } = trpc.notification.unreadCount.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const { data: notifications } = trpc.notification.myNotifications.useQuery({ limit: 12 });
  const markAll = trpc.notification.markAllRead.useMutation({
    onSuccess: () => {
      utils.notification.unreadCount.invalidate();
      utils.notification.myNotifications.invalidate();
    },
  });
  const markOne = trpc.notification.markRead.useMutation({
    onSuccess: () => {
      utils.notification.unreadCount.invalidate();
      utils.notification.myNotifications.invalidate();
    },
  });

  const count = unread?.count ?? 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 text-ink/60 hover:text-ink hover:bg-ink/5 rounded-md transition-colors">
          <Bell className="w-5 h-5" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink/10">
          <span className="font-semibold text-sm text-ink">Notifications</span>
          {count > 0 && (
            <button
              onClick={() => markAll.mutate()}
              className="text-xs font-medium text-brand hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {!notifications?.length ? (
            <div className="py-12 text-center text-slate-400">
              <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">You're all caught up.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  if (!n.isRead) markOne.mutate({ notificationId: n.id });
                  if (n.actionUrl) navigate(n.actionUrl);
                }}
                className={`w-full text-left px-4 py-3 border-b border-ink/5 hover:bg-ink/5 transition-colors flex gap-3 ${
                  n.isRead ? "" : "bg-brand-50/40"
                }`}
              >
                <span
                  className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                    n.isRead ? "bg-transparent" : "bg-brand"
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{n.title}</p>
                  <p className="text-xs text-slate-500 line-clamp-2">{n.body}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

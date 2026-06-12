import { useCallback } from "react";
import { trpc } from "@/providers/trpc";

export function useAuth() {
  const utils = trpc.useUtils();
  const { data: user, isLoading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate();
      // Hard-redirect home so protected dashboards (admin/business/provider)
      // are fully torn down and the user lands logged-out.
      window.location.href = "/";
    },
  });

  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const isBusiness = user?.role === "business";
  const isProvider = user?.role === "provider" || user?.role === "company";

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    isBusiness,
    isProvider,
    logout,
  };
}

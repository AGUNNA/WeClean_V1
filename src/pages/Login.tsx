import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";

const DEMO_ACCOUNTS = [
  { account: "customer" as const, label: "Customer" },
  { account: "business" as const, label: "Business" },
  { account: "provider" as const, label: "Provider" },
  { account: "admin" as const, label: "Admin" },
];

function routeFor(role: string) {
  if (role === "admin" || role === "superadmin") return "/admin";
  if (role === "business") return "/business";
  if (role === "provider" || role === "company") return "/provider";
  return "/dashboard";
}

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const utils = trpc.useUtils();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "business" | "provider">("user");

  const login = trpc.auth.login.useMutation();
  const register = trpc.auth.register.useMutation();
  const demoLogin = trpc.auth.demoLogin.useMutation();

  async function afterAuth(roleResult: string, label: string) {
    await utils.auth.me.invalidate();
    toast.success(`Signed in${label ? ` as ${label}` : ""}`);
    navigate(routeFor(roleResult));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (mode === "login") {
        const res = await login.mutateAsync({ email, password });
        await afterAuth(res.role, "");
      } else {
        const res = await register.mutateAsync({ name, email, password, role });
        await afterAuth(res.role, "");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function quickDemo(account: (typeof DEMO_ACCOUNTS)[number]) {
    try {
      const res = await demoLogin.mutateAsync({ account: account.account });
      await afterAuth(res.role, account.label);
    } catch {
      toast.error("Demo login failed");
    }
  }

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand" />
      </div>
    );
  }

  const busy = login.isPending || register.isPending;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        <div className="mb-7">
          <span className="font-display text-2xl font-bold text-ink tracking-tight">
            We<span className="text-brand">Clean</span>
          </span>
          <h1 className="font-display text-3xl font-bold text-ink mt-4">
            {mode === "login" ? "Sign in" : "Create your account"}
          </h1>
          <p className="text-ink/60 text-sm mt-1.5">
            {mode === "login"
              ? "Welcome back — enter your details."
              : "Join WeClean in under a minute."}
          </p>
        </div>

        {/* Email / password form */}
        <form
          onSubmit={handleSubmit}
          className="border-2 border-ink rounded-lg bg-paper p-6 space-y-4"
        >
          {mode === "register" && (
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Obi" required />
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          {mode === "register" && (
            <div className="space-y-1.5">
              <Label>Account type</Label>
              <Select value={role} onValueChange={(v) => setRole(v as never)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Customer — book cleanings</SelectItem>
                  <SelectItem value="business">Business — run a cleaning company</SelectItem>
                  <SelectItem value="provider">Provider — work as a cleaner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            type="submit"
            disabled={busy}
            className="w-full bg-ink hover:bg-brand text-white h-11"
          >
            {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </Button>

          <p className="text-center text-sm text-ink/60">
            {mode === "login" ? "New to WeClean?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="font-semibold text-brand hover:underline"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </form>

        {/* Demo quick access */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-ink/15" />
            <span className="text-xs font-semibold uppercase tracking-wider text-ink/45">
              Or try a demo account
            </span>
            <div className="h-px flex-1 bg-ink/15" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.account}
                disabled={demoLogin.isPending}
                onClick={() => quickDemo(acc)}
                className="border-2 border-ink/15 rounded-md py-2.5 text-xs font-semibold text-ink hover:bg-ink hover:text-white transition-colors disabled:opacity-60"
              >
                {acc.label}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-ink/45 mt-3">
            Demo accounts use password <span className="font-mono text-ink/70">password123</span>
          </p>
        </div>
      </div>
    </div>
  );
}

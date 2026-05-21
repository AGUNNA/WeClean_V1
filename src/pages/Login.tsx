import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Mail, Phone, Fingerprint, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

function getOAuthUrl() {
  const kimiauthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiauthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-600/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 text-sm mt-1">
            Sign in to access your account
          </p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="p-6 space-y-4">
            {/* OAuth Login */}
            <Button
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium"
              onClick={() => {
                window.location.href = getOAuthUrl();
              }}
            >
              <Fingerprint className="w-5 h-5 mr-2" />
              Continue with Kimi OAuth
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-slate-400">
                  Other sign-in methods
                </span>
              </div>
            </div>

            {/* Alternative Login Methods */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 justify-start text-slate-600 hover:bg-slate-50"
                disabled
              >
                <Mail className="w-5 h-5 mr-3 text-slate-400" />
                Sign in with Email
                <span className="ml-auto text-xs text-slate-400">
                  Coming soon
                </span>
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 justify-start text-slate-600 hover:bg-slate-50"
                disabled
              >
                <Phone className="w-5 h-5 mr-3 text-slate-400" />
                Sign in with Phone (OTP)
                <span className="ml-auto text-xs text-slate-400">
                  Coming soon
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sign up link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/provider/onboarding")}
            className="text-blue-600 hover:underline font-medium"
          >
            Become a Provider
          </button>
        </p>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <span className="text-xs text-slate-400">Secured by</span>
          <span className="px-2 py-1 bg-white rounded border text-xs font-medium text-slate-500">
            SSL
          </span>
          <span className="px-2 py-1 bg-white rounded border text-xs font-medium text-slate-500">
            OAuth 2.0
          </span>
          <span className="px-2 py-1 bg-white rounded border text-xs font-medium text-slate-500">
            JWT
          </span>
        </div>
      </div>
    </div>
  );
}

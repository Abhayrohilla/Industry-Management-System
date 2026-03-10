import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { createApiClient } from "../api";
import { useAuth } from "../hooks/useAuth";

type AuthMode = "login" | "signup";

interface AuthPageProps {
  initialMode: AuthMode;
}

export function AuthPage({ initialMode }: AuthPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(
    () => (location.state as { signupSuccess?: string } | null)?.signupSuccess ?? null
  );

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);

  useEffect(() => {
    if (location.pathname === "/signup") {
      setMode("signup");
    } else {
      setMode("login");
      const state = location.state as { signupSuccess?: string } | null;
      if (state?.signupSuccess) setLoginSuccess(state.signupSuccess);
    }
  }, [location.pathname, location.state]);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      const api = createApiClient();
      const response = await api.post("/auth/login", {
        email: loginEmail,
        password: loginPassword
      });
      auth.saveAuth(response.data.token, response.data.email);
      navigate("/industries");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message || "Login failed. Please check your details.";
      setLoginError(message);
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleSignup(event: FormEvent) {
    event.preventDefault();
    setSignupError(null);
    setSignupSuccess(null);
    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters long");
      return;
    }
    setSignupLoading(true);
    try {
      const api = createApiClient();
      await api.post("/auth/signup", {
        email: signupEmail,
        password: signupPassword
      });
      setSignupSuccess("Account created. You can now log in.");
      setSignupPassword("");
      setSignupConfirmPassword("");
      setMode("login");
      navigate("/login", { state: { signupSuccess: "Account created. You can now log in." } });
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message || "Signup failed. Email may already be registered.";
      setSignupError(message);
    } finally {
      setSignupLoading(false);
    }
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    if (nextMode === "login") {
      navigate("/login");
    } else {
      navigate("/signup");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
        {/* Top brand strip */}
        <div className="mb-6 flex w-full max-w-md items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white shadow-sm">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Industry Console</p>
              <p className="text-xs text-slate-500">Live overview of your sectors</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span>Operational · Reliable</span>
          </div>
        </div>

        {/* Auth card */}
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
          <div className="mb-5">
            <h1 className="text-xl font-semibold tracking-tight text-slate-800">
              {mode === "login" ? "Sign in to dashboard" : "Create an operator account"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {mode === "login"
                ? "Use your work email to access industry metrics and portfolios."
                : "Provision secure access for your operations or analytics team."}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="mb-6 inline-flex w-full rounded-lg bg-slate-100 p-1 text-sm">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 rounded-md px-4 py-2 font-medium transition ${
                mode === "login"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-200"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`flex-1 rounded-md px-4 py-2 font-medium transition ${
                mode === "signup"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-200"
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Login form */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="login-email">
                  Work email
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@company.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor="login-password"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="Your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              {loginSuccess && (
                <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                  {loginSuccess}
                </p>
              )}
              {loginError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {loginError}
                </p>
              )}
              <button
                type="submit"
                disabled={loginLoading}
                className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loginLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          )}

          {/* Signup form */}
          {mode === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="signup-email">
                  Work email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="you@company.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor="signup-password"
                >
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor="signup-confirm-password"
                >
                  Confirm password
                </label>
                <input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="Re-enter password"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              {signupError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {signupError}
                </p>
              )}
              {signupSuccess && (
                <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                  {signupSuccess}
                </p>
              )}
              <button
                type="submit"
                disabled={signupLoading}
                className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-slate-200"
              >
                {signupLoading ? "Creating account..." : "Create account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


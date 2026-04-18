"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lightbulb, Loader2 } from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) setError("Invalid or missing invite link.");
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/referrer/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, name, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/referrer/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#0c0a07] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-600/30">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-[#f2ede4] text-base tracking-tight">Light Patterns</span>
          </div>
          <p className="text-[#f2ede4]/40 text-sm">Referral partner portal</p>
        </div>

        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8">
          <h1 className="text-[#f2ede4] font-semibold text-lg mb-1">Create your account</h1>
          <p className="text-[#f2ede4]/40 text-xs mb-6">
            You&apos;re joining the Light Patterns referral program.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[#f2ede4]/50 mb-1.5">Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-[#f2ede4] text-sm placeholder:text-[#f2ede4]/20 focus:outline-none focus:border-amber-600/50 transition-colors"
                placeholder="Jane Smith"
              />
            </div>

            <div>
              <label className="block text-xs text-[#f2ede4]/50 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-[#f2ede4] text-sm placeholder:text-[#f2ede4]/20 focus:outline-none focus:border-amber-600/50 transition-colors"
                placeholder="Min. 8 characters"
              />
            </div>

            <div>
              <label className="block text-xs text-[#f2ede4]/50 mb-1.5">Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-[#f2ede4] text-sm placeholder:text-[#f2ede4]/20 focus:outline-none focus:border-amber-600/50 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors mt-2"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ReferrerSignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}

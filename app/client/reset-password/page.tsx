"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) setError("Invalid or missing reset link.");
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/client/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/client/login"), 2000);
  }

  return (
    <div className="min-h-screen bg-[#05050a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-white font-bold text-xl mb-1">Light Patterns</div>
          <p className="text-white/40 text-sm">Client portal</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {done ? (
            <div className="text-center space-y-3">
              <div className="text-3xl">✅</div>
              <h1 className="text-white font-semibold text-lg">Password updated</h1>
              <p className="text-white/40 text-sm">Redirecting you to sign in…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h1 className="text-white font-semibold text-lg mb-6">Choose a new password</h1>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
                  {error}{" "}
                  {!token && (
                    <Link href="/client/forgot-password" className="underline">Request a new link</Link>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm text-white/50 mb-1.5">New password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500"
                  placeholder="Min. 8 characters"
                />
              </div>

              <div>
                <label className="block text-sm text-white/50 mb-1.5">Confirm password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors mt-2"
              >
                {loading ? "Saving…" : "Set new password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}

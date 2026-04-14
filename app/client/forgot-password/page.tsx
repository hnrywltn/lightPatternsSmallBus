"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/client/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#05050a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-white font-bold text-xl mb-1">Light Patterns</div>
          <p className="text-white/40 text-sm">Client portal</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="text-3xl">📬</div>
              <h1 className="text-white font-semibold text-lg">Check your email</h1>
              <p className="text-white/40 text-sm leading-relaxed">
                If an account exists for {email}, we sent a reset link. It expires in 1 hour.
              </p>
              <Link href="/client/login" className="block text-xs text-violet-400 hover:text-violet-300 mt-4">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h1 className="text-white font-semibold text-lg mb-6">Reset your password</h1>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
              <div className="text-center pt-1">
                <Link href="/client/login" className="text-xs text-white/30 hover:text-white/60 transition-colors">
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

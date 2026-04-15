"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowDownToLine, RefreshCw, Loader2, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface Balance {
  available: number;
  pending: number;
}

interface Payout {
  id: string;
  amount: number;
  currency: string;
  status: string;
  arrivalDate: number;
  created: number;
  description: string | null;
  method: string;
}

function fmt(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function fmtDate(unix: number) {
  return new Date(unix * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
    paid: { label: "Paid", icon: <CheckCircle className="w-3 h-3" />, cls: "text-emerald-400 bg-emerald-400/10" },
    pending: { label: "Pending", icon: <Clock className="w-3 h-3" />, cls: "text-amber-400 bg-amber-400/10" },
    in_transit: { label: "In Transit", icon: <TrendingUp className="w-3 h-3" />, cls: "text-blue-400 bg-blue-400/10" },
    failed: { label: "Failed", icon: <XCircle className="w-3 h-3" />, cls: "text-red-400 bg-red-400/10" },
    canceled: { label: "Canceled", icon: <AlertCircle className="w-3 h-3" />, cls: "text-[#f2ede4]/30 bg-white/5" },
  };
  const s = map[status] ?? { label: status, icon: null, cls: "text-[#f2ede4]/40 bg-white/5" };
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${s.cls}`}>
      {s.icon}
      {s.label}
    </span>
  );
}

export default function BillingClient() {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [loadingPayouts, setLoadingPayouts] = useState(true);

  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutError, setPayoutError] = useState("");
  const [payoutSuccess, setPayoutSuccess] = useState("");

  const fetchBalance = useCallback(async () => {
    setLoadingBalance(true);
    try {
      const res = await fetch("/api/admin/stripe/balance");
      const data = await res.json();
      if (res.ok) setBalance(data);
    } finally {
      setLoadingBalance(false);
    }
  }, []);

  const fetchPayouts = useCallback(async () => {
    setLoadingPayouts(true);
    try {
      const res = await fetch("/api/admin/stripe/payouts");
      const data = await res.json();
      if (res.ok) setPayouts(data.payouts);
    } finally {
      setLoadingPayouts(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
    fetchPayouts();
  }, [fetchBalance, fetchPayouts]);

  async function handlePayout(e: React.FormEvent) {
    e.preventDefault();
    setPayoutError("");
    setPayoutSuccess("");

    const dollars = parseFloat(payoutAmount);
    if (isNaN(dollars) || dollars <= 0) {
      setPayoutError("Enter a valid amount.");
      return;
    }
    const cents = Math.round(dollars * 100);

    setPayoutLoading(true);
    try {
      const res = await fetch("/api/admin/stripe/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: cents }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPayoutError(data.error ?? "Failed to send payout.");
      } else {
        setPayoutSuccess(`Payout of ${fmt(data.amount)} initiated — arrives ${fmtDate(data.arrivalDate)}.`);
        setPayoutAmount("");
        fetchBalance();
        fetchPayouts();
      }
    } finally {
      setPayoutLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#f2ede4]">Billing</h1>
          <p className="text-sm text-[#f2ede4]/40 mt-1">Stripe account balance and payouts.</p>
        </div>
        <button
          onClick={() => { fetchBalance(); fetchPayouts(); }}
          className="flex items-center gap-1.5 text-xs text-[#f2ede4]/40 hover:text-[#f2ede4] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <p className="text-xs text-[#f2ede4]/40 mb-2">Available balance</p>
          {loadingBalance ? (
            <Loader2 className="w-5 h-5 text-[#f2ede4]/20 animate-spin" />
          ) : (
            <p className="text-3xl font-semibold text-[#f2ede4]">
              {balance ? fmt(balance.available) : "—"}
            </p>
          )}
          <p className="text-[11px] text-[#f2ede4]/30 mt-1">Ready to pay out</p>
        </div>
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <p className="text-xs text-[#f2ede4]/40 mb-2">Pending balance</p>
          {loadingBalance ? (
            <Loader2 className="w-5 h-5 text-[#f2ede4]/20 animate-spin" />
          ) : (
            <p className="text-3xl font-semibold text-[#f2ede4]">
              {balance ? fmt(balance.pending) : "—"}
            </p>
          )}
          <p className="text-[11px] text-[#f2ede4]/30 mt-1">Clearing from recent payments</p>
        </div>
      </div>

      {/* Manual payout */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 mb-10">
        <h2 className="text-sm font-medium text-[#f2ede4] mb-1">Send payout</h2>
        <p className="text-xs text-[#f2ede4]/40 mb-5">
          Manually push funds to your linked bank account. Stripe will use your default payout destination.
        </p>
        <form onSubmit={handlePayout} className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f2ede4]/30 text-sm">$</span>
            <input
              type="number"
              step="0.01"
              min="1"
              placeholder="0.00"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg pl-7 pr-3 py-2 text-sm text-[#f2ede4] placeholder-[#f2ede4]/20 focus:outline-none focus:border-amber-600/50 w-36"
            />
          </div>
          <button
            type="submit"
            disabled={payoutLoading || !payoutAmount}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {payoutLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowDownToLine className="w-4 h-4" />
            )}
            Send payout
          </button>
        </form>
        {payoutError && (
          <p className="text-xs text-red-400 mt-3">{payoutError}</p>
        )}
        {payoutSuccess && (
          <p className="text-xs text-emerald-400 mt-3">{payoutSuccess}</p>
        )}
      </div>

      {/* Payout history */}
      <div>
        <h2 className="text-sm font-medium text-[#f2ede4] mb-4">Payout history</h2>
        {loadingPayouts ? (
          <div className="flex items-center gap-2 text-xs text-[#f2ede4]/30 py-6">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading payouts…
          </div>
        ) : payouts.length === 0 ? (
          <p className="text-xs text-[#f2ede4]/30 py-6">No payouts yet.</p>
        ) : (
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left text-[11px] font-medium text-[#f2ede4]/40 px-5 py-3">Amount</th>
                  <th className="text-left text-[11px] font-medium text-[#f2ede4]/40 px-5 py-3">Status</th>
                  <th className="text-left text-[11px] font-medium text-[#f2ede4]/40 px-5 py-3 hidden sm:table-cell">Created</th>
                  <th className="text-left text-[11px] font-medium text-[#f2ede4]/40 px-5 py-3 hidden sm:table-cell">Est. arrival</th>
                  <th className="text-left text-[11px] font-medium text-[#f2ede4]/40 px-5 py-3 hidden md:table-cell">Method</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p, i) => (
                  <tr key={p.id} className={i < payouts.length - 1 ? "border-b border-white/5" : ""}>
                    <td className="px-5 py-3.5 font-medium text-[#f2ede4]">{fmt(p.amount)}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-3.5 text-xs text-[#f2ede4]/50 hidden sm:table-cell">{fmtDate(p.created)}</td>
                    <td className="px-5 py-3.5 text-xs text-[#f2ede4]/50 hidden sm:table-cell">{fmtDate(p.arrivalDate)}</td>
                    <td className="px-5 py-3.5 text-xs text-[#f2ede4]/40 capitalize hidden md:table-cell">{p.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

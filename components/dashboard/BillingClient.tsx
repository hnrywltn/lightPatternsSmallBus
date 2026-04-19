"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ArrowDownToLine,
  RefreshCw,
  Loader2,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  DollarSign,
  CreditCard,
} from "lucide-react";

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

interface PendingCommission {
  siteId: string;
  businessName: string;
  datePublished: string | null;
  buildFee: number;
  referrerId: string;
  referrerName: string;
  referrerEmail: string;
  commissionType: "flat" | "percentage";
  commissionAmount: number;
  commissionDue: number;
  stripeConnectId: string | null;
}

function fmt(dollars: number) {
  return dollars.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function fmtCents(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function fmtDate(unix: number) {
  return new Date(unix * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtDateStr(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
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
  const [pendingCommissions, setPendingCommissions] = useState<PendingCommission[]>([]);

  const [loadingBalance, setLoadingBalance] = useState(true);
  const [loadingPayouts, setLoadingPayouts] = useState(true);
  const [loadingCommissions, setLoadingCommissions] = useState(true);

  // Payout form
  const [payTo, setPayTo] = useState("myself");
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutError, setPayoutError] = useState("");
  const [payoutSuccess, setPayoutSuccess] = useState("");

  // Mark paid
  const [markingPaid, setMarkingPaid] = useState<string | null>(null);

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

  const fetchCommissions = useCallback(async () => {
    setLoadingCommissions(true);
    try {
      const res = await fetch("/api/admin/billing/pending-commissions");
      const data = await res.json();
      if (res.ok) setPendingCommissions(data.commissions);
    } finally {
      setLoadingCommissions(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
    fetchPayouts();
    fetchCommissions();
  }, [fetchBalance, fetchPayouts, fetchCommissions]);

  // When payTo changes to a referrer, pre-fill their commission amount
  useEffect(() => {
    if (payTo === "myself") {
      setPayoutAmount("");
    } else {
      const commission = pendingCommissions.find((c) => c.siteId === payTo);
      if (commission) {
        setPayoutAmount(commission.commissionDue.toString());
      }
    }
  }, [payTo, pendingCommissions]);

  async function handlePayout(e: React.FormEvent) {
    e.preventDefault();
    setPayoutError("");
    setPayoutSuccess("");

    const dollars = parseFloat(payoutAmount);
    if (isNaN(dollars) || dollars <= 0) {
      setPayoutError("Enter a valid amount.");
      return;
    }

    setPayoutLoading(true);
    try {
      if (payTo === "myself") {
        const cents = Math.round(dollars * 100);
        const res = await fetch("/api/admin/stripe/payouts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: cents }),
        });
        const data = await res.json();
        if (!res.ok) {
          setPayoutError(data.error ?? "Failed to send payout.");
        } else {
          setPayoutSuccess(`Payout of ${fmtCents(data.amount)} initiated — arrives ${fmtDate(data.arrivalDate)}.`);
          setPayoutAmount("");
          fetchBalance();
          fetchPayouts();
        }
      } else {
        const commission = pendingCommissions.find((c) => c.siteId === payTo);
        if (!commission) return;

        const res = await fetch("/api/admin/billing/pending-commissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            siteId: commission.siteId,
            transfer: !!commission.stripeConnectId,
            amountDollars: dollars,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setPayoutError(data.error ?? "Failed to process commission payment.");
        } else {
          const via = commission.stripeConnectId ? "transferred via Stripe" : "marked as paid";
          setPayoutSuccess(
            `${fmt(dollars)} for ${commission.referrerName} (${commission.businessName}) ${via}.`
          );
          setPayoutAmount("");
          setPayTo("myself");
          fetchCommissions();
        }
      }
    } finally {
      setPayoutLoading(false);
    }
  }

  async function handleMarkPaid(siteId: string) {
    setMarkingPaid(siteId);
    try {
      const res = await fetch("/api/admin/billing/pending-commissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId }),
      });
      if (res.ok) {
        fetchCommissions();
      }
    } finally {
      setMarkingPaid(null);
    }
  }

  const selectedCommission = pendingCommissions.find((c) => c.siteId === payTo);

  return (
    <div>
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#f2ede4]">Billing</h1>
          <p className="text-sm text-[#f2ede4]/40 mt-1">Stripe balance, payouts, and commissions.</p>
        </div>
        <button
          onClick={() => { fetchBalance(); fetchPayouts(); fetchCommissions(); }}
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
              {balance ? fmtCents(balance.available) : "—"}
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
              {balance ? fmtCents(balance.pending) : "—"}
            </p>
          )}
          <p className="text-[11px] text-[#f2ede4]/30 mt-1">Clearing from recent payments</p>
        </div>
      </div>

      {/* Pending commissions */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-medium text-[#f2ede4]">Pending commissions</h2>
            <p className="text-xs text-[#f2ede4]/40 mt-0.5">
              Referrers owed a commission for sites that have gone live.
            </p>
          </div>
          {!loadingCommissions && pendingCommissions.length > 0 && (
            <span className="text-[11px] font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
              {pendingCommissions.length} pending
            </span>
          )}
        </div>

        {loadingCommissions ? (
          <div className="flex items-center gap-2 text-xs text-[#f2ede4]/30 py-6">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading…
          </div>
        ) : pendingCommissions.length === 0 ? (
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 flex items-center gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="text-sm text-[#f2ede4]/50">All commissions paid — nothing pending.</p>
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left text-[11px] font-medium text-[#f2ede4]/40 px-5 py-3">Person</th>
                  <th className="text-left text-[11px] font-medium text-[#f2ede4]/40 px-5 py-3 hidden sm:table-cell">Site</th>
                  <th className="text-left text-[11px] font-medium text-[#f2ede4]/40 px-5 py-3">Commission</th>
                  <th className="text-left text-[11px] font-medium text-[#f2ede4]/40 px-5 py-3 hidden md:table-cell">Published</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {pendingCommissions.map((c, i) => (
                  <tr key={c.siteId} className={i < pendingCommissions.length - 1 ? "border-b border-white/5" : ""}>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-[#f2ede4]">{c.referrerName}</p>
                      <p className="text-[11px] text-[#f2ede4]/40 flex items-center gap-1">
                        {c.stripeConnectId && <CreditCard className="w-2.5 h-2.5 text-emerald-400" />}
                        {c.referrerEmail}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[#f2ede4]/60 hidden sm:table-cell">{c.businessName}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-[#f2ede4]">{fmt(c.commissionDue)}</p>
                      <p className="text-[11px] text-[#f2ede4]/40 capitalize">
                        {c.commissionType === "percentage"
                          ? `${c.commissionAmount}% of build fee`
                          : "flat rate"}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[#f2ede4]/50 hidden md:table-cell">
                      {c.datePublished ? fmtDateStr(c.datePublished) : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleMarkPaid(c.siteId)}
                        disabled={markingPaid === c.siteId}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        {markingPaid === c.siteId ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5" />
                        )}
                        Mark paid
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Send payout */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 mb-10">
        <h2 className="text-sm font-medium text-[#f2ede4] mb-1">Send payout</h2>
        <p className="text-xs text-[#f2ede4]/40 mb-5">
          Pay yourself via Stripe or record a commission payment for a referrer.
        </p>

        <form onSubmit={handlePayout} className="space-y-4">
          {/* Pay to selector */}
          <div>
            <label className="block text-[11px] text-[#f2ede4]/40 mb-1.5">Pay to</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f2ede4]/30 pointer-events-none" />
              <select
                value={payTo}
                onChange={(e) => setPayTo(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-[#f2ede4] focus:outline-none focus:border-amber-600/50 appearance-none"
              >
                <option value="myself">Myself — bank account (Stripe)</option>
                {pendingCommissions.length > 0 && (
                  <optgroup label="Pending commissions">
                    {pendingCommissions.map((c) => (
                      <option key={c.siteId} value={c.siteId}>
                        {c.referrerName} — {c.businessName} ({fmt(c.commissionDue)})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
            {selectedCommission && (
              <p className="text-[11px] mt-1.5">
                <span className="text-[#f2ede4]/40">{selectedCommission.referrerEmail}</span>
                {selectedCommission.stripeConnectId ? (
                  <span className="text-emerald-400 ml-2">· Will transfer via Stripe Connect</span>
                ) : (
                  <span className="text-amber-400/70 ml-2">· No Stripe account — will mark as paid only</span>
                )}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-[11px] text-[#f2ede4]/40 mb-1.5">Amount</label>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f2ede4]/30 pointer-events-none" />
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="0.00"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-[#f2ede4] placeholder-[#f2ede4]/20 focus:outline-none focus:border-amber-600/50 w-36"
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
                {payTo === "myself" ? "Send payout" : "Mark as paid"}
              </button>
            </div>
          </div>
        </form>

        {payoutError && <p className="text-xs text-red-400 mt-3">{payoutError}</p>}
        {payoutSuccess && <p className="text-xs text-emerald-400 mt-3">{payoutSuccess}</p>}
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
                    <td className="px-5 py-3.5 font-medium text-[#f2ede4]">{fmtCents(p.amount)}</td>
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

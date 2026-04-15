"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  ExternalLink,
  CreditCard,
  FileText,
  Download,
  X,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity,
  Mail,
} from "lucide-react";

// ─── Stripe setup ─────────────────────────────────────────────────────────────

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClientProps {
  isAdminPreview?: boolean;
  name: string;
  email: string;
  siteId: string | null;
  businessName: string | null;
  domain: string | null;
  tier: string | null;
  siteStatus: string | null;
  stripeCustomerId: string | null;
  monthlyRevenue: number;
  addOns: string[];
}

interface PaymentMethod {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

interface SubItem {
  name: string;
  amount: number | null;
  interval: string | undefined;
}

interface Subscription {
  id: string;
  status: string;
  cancelAtPeriodEnd: boolean;
  cancelAt: number | null;
  billingCycleAnchor: number;
  items: SubItem[];
}

interface Invoice {
  id: string;
  number: string | null;
  amount: number;
  status: string | null;
  date: number;
  pdfUrl: string | null;
  hostedUrl: string | null;
}

interface BillingData {
  subscription: Subscription | null;
  paymentMethod: PaymentMethod | null;
  invoices: Invoice[];
}

interface ActivityEntry {
  id: string;
  description: string;
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function fmtAmount(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function fmtActivityDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  trialing: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  past_due: "bg-red-500/15 text-red-400 border-red-500/20",
  unpaid: "bg-red-500/15 text-red-400 border-red-500/20",
  canceled: "bg-white/5 text-white/30 border-white/10",
  paused: "bg-white/5 text-white/30 border-white/10",
};

const SITE_STATUS_STYLES: Record<string, { label: string; style: string }> = {
  active: { label: "Live", style: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  in_progress: { label: "In Progress", style: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  paused: { label: "Paused", style: "bg-white/5 text-white/30 border-white/10" },
  inactive: { label: "Offline", style: "bg-red-500/15 text-red-400 border-red-500/20" },
};

// ─── Update card form ─────────────────────────────────────────────────────────

function UpdateCardForm({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSaving(true);
    setError("");

    const { setupIntent, error: confirmError } = await stripe.confirmSetup({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Something went wrong.");
      setSaving(false);
      return;
    }

    if (setupIntent?.payment_method) {
      const res = await fetch("/api/client/stripe/update-payment-method", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethodId: setupIntent.payment_method }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to update card.");
        setSaving(false);
        return;
      }
    }

    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <PaymentElement />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || !stripe}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
        >
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Save card
        </button>
      </div>
    </form>
  );
}

// ─── Update card modal ────────────────────────────────────────────────────────

function UpdateCardModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/client/stripe/setup-intent", { method: "POST" })
      .then((r) => r.json())
      .then((d) => {
        if (d.clientSecret) setClientSecret(d.clientSecret);
        else setError(d.error ?? "Failed to initialize.");
      });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0c0a07] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-white">Update payment method</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        {!clientSecret && !error && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-white/30" />
          </div>
        )}

        {clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "night",
                variables: {
                  colorBackground: "#0c0a07",
                  colorText: "#f2ede4",
                  colorPrimary: "#d97706",
                  borderRadius: "10px",
                },
              },
            }}
          >
            <UpdateCardForm onSuccess={onSuccess} onClose={onClose} />
          </Elements>
        )}
      </div>
    </div>
  );
}

// ─── Cancel modal ─────────────────────────────────────────────────────────────

function CancelModal({ onClose, onConfirm, loading }: { onClose: () => void; onConfirm: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0c0a07] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-1">Cancel subscription?</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Your subscription will stay active until the end of the current billing period. After that, <strong className="text-white/70">your site will go offline</strong> and your domain will stop resolving.
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white/40 hover:text-white transition-colors"
          >
            Keep subscription
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Cancel subscription
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function ClientDashboardClient({ client, isAdminPreview }: { client: ClientProps; isAdminPreview?: boolean }) {
  const router = useRouter();
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [billingLoading, setBillingLoading] = useState(true);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [showUpdateCard, setShowUpdateCard] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [cardUpdated, setCardUpdated] = useState(false);

  async function fetchBilling() {
    setBillingLoading(true);
    const res = await fetch("/api/client/stripe/billing");
    const data = await res.json();
    setBillingLoading(false);
    if (res.ok) setBilling(data as BillingData);
  }

  useEffect(() => {
    fetchBilling();
    if (client.siteId) {
      fetch("/api/client/activity")
        .then((r) => r.json())
        .then((d) => setActivity(d.activity ?? []));
    }
  }, [client.siteId]);

  async function handleLogout() {
    await fetch("/api/client/auth/logout", { method: "POST" });
    router.push("/client/login");
  }

  async function handleCancel() {
    setCanceling(true);
    const res = await fetch("/api/client/stripe/cancel", { method: "POST" });
    setCanceling(false);
    if (res.ok) {
      setShowCancel(false);
      fetchBilling();
    }
  }

  function handleCardUpdated() {
    setShowUpdateCard(false);
    setCardUpdated(true);
    setTimeout(() => setCardUpdated(false), 4000);
    fetchBilling();
  }

  const siteInfo = SITE_STATUS_STYLES[client.siteStatus ?? ""] ?? SITE_STATUS_STYLES.inactive;
  const sub = billing?.subscription;
  const pm = billing?.paymentMethod;

  return (
    <div className="min-h-screen bg-[#05050a] text-white">
      {/* Admin preview bar */}
      {isAdminPreview && (
        <div className="bg-amber-600 px-6 py-2 flex items-center justify-between text-sm">
          <span className="text-white font-medium">Admin preview — viewing as {client.email}</span>
          <a href="/dashboard/sites" className="text-white/80 hover:text-white font-medium transition-colors">
            ← Back to admin
          </a>
        </div>
      )}
      {/* Nav */}
      <nav className="border-b border-white/8 px-6 sm:px-8 py-4 flex items-center justify-between">
        <span className="font-bold text-base tracking-tight">Light Patterns</span>
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="hidden sm:block text-white/40 text-sm">{client.email}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 sm:px-8 py-12 flex flex-col gap-8">

        {/* Welcome */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">
            Hey, {client.name.split(" ")[0]}
          </h1>
          <p className="text-white/40 text-sm">Here&apos;s everything about your account.</p>
        </div>

        {/* Site card */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 mb-1">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-2">Your site</p>
              <h2 className="text-lg font-semibold text-white">
                {client.businessName ?? "Your site"}
              </h2>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${siteInfo.style}`}>
              {siteInfo.label}
            </span>
          </div>

          {client.domain ? (
            <a
              href={`https://${client.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors mt-2"
            >
              {client.domain}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <p className="text-white/30 text-sm mt-2">Your domain will appear here once your site is live.</p>
          )}
        </div>

        {/* Billing card */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 flex flex-col gap-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Billing</p>

          {billingLoading ? (
            <div className="flex items-center gap-2 text-white/30 text-sm py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading billing info…
            </div>
          ) : !client.stripeCustomerId || !sub ? (
            <div className="flex flex-col gap-1">
              {client.tier && (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-white">{client.tier} Plan</span>
                  {client.monthlyRevenue > 0 && (
                    <span className="text-white/40 text-sm">${client.monthlyRevenue}/mo</span>
                  )}
                </div>
              )}
              <p className="text-white/30 text-sm">Billing details will appear here once your subscription is active.</p>
            </div>
          ) : (
            <>
              {/* Plan + status */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-xl font-bold text-white">
                      {sub.items[0]?.name ?? `${client.tier ?? "Your"} Plan`}
                    </span>
                    {sub.items[0]?.amount != null && (
                      <span className="text-white/40 text-sm">
                        {fmtAmount(sub.items[0].amount)}/{sub.items[0].interval}
                      </span>
                    )}
                  </div>
                  {sub.cancelAtPeriodEnd && sub.cancelAt && (
                    <p className="text-red-400 text-xs mt-1">
                      Cancels {fmtDate(sub.cancelAt)} — your site will go offline after this date.
                    </p>
                  )}
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${STATUS_STYLES[sub.status] ?? "bg-white/5 text-white/30 border-white/10"}`}>
                  {sub.status.replace("_", " ")}
                </span>
              </div>

              {/* Add-ons */}
              {sub.items.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {sub.items.slice(1).map((item, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-amber-600/10 border border-amber-600/20 text-amber-400">
                      {item.name}
                      {item.amount != null && ` · ${fmtAmount(item.amount)}/${item.interval}`}
                    </span>
                  ))}
                </div>
              )}

              <div className="h-px bg-white/5" />

              {/* Payment method */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-white/30" />
                  {pm ? (
                    <span className="text-sm text-white/70">
                      {pm.brand.charAt(0).toUpperCase() + pm.brand.slice(1)} ···· {pm.last4}
                      <span className="text-white/30 ml-2 text-xs">{pm.expMonth}/{pm.expYear}</span>
                    </span>
                  ) : (
                    <span className="text-sm text-white/30">No card on file</span>
                  )}
                </div>
                <button
                  onClick={() => setShowUpdateCard(true)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  {pm ? "Update" : "Add card"}
                </button>
              </div>

              {cardUpdated && (
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Card updated successfully.
                </div>
              )}

              {/* Cancel */}
              {!sub.cancelAtPeriodEnd && (
                <button
                  onClick={() => setShowCancel(true)}
                  className="self-start text-xs text-white/25 hover:text-red-400 transition-colors"
                >
                  Cancel subscription
                </button>
              )}
            </>
          )}
        </div>

        {/* Invoice history */}
        {billing && billing.invoices.length > 0 && (
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-4">Invoices</p>
            <div className="flex flex-col divide-y divide-white/5">
              {billing.invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-white/20 shrink-0" />
                    <div>
                      <p className="text-sm text-white/70">{fmtAmount(inv.amount)}</p>
                      <p className="text-xs text-white/30">{fmtDate(inv.date)}{inv.number ? ` · ${inv.number}` : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                      inv.status === "paid"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {inv.status ?? "—"}
                    </span>
                    {inv.pdfUrl && (
                      <a
                        href={inv.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/30 hover:text-white/70 transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity */}
        {activity.length > 0 && (
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-4">Recent activity</p>
            <div className="flex flex-col gap-3">
              {activity.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm text-white/70 leading-snug">{entry.description}</p>
                    <p className="text-xs text-white/25 mt-0.5">{fmtActivityDate(entry.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Support + Account */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-white/30" />
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Need something?</p>
            </div>
            <p className="text-white/40 text-sm mb-4 leading-relaxed">
              Changes, questions, or anything else — just send us an email.
            </p>
            <a
              href="mailto:hello@lightpatternsonline.com"
              className="text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              hello@lightpatternsonline.com
            </a>
          </div>

          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-white/30" />
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Account</p>
            </div>
            <p className="text-white/50 text-sm mb-4">{client.email}</p>
            <a
              href="/client/forgot-password"
              className="text-sm font-semibold text-white/30 hover:text-white/60 transition-colors"
            >
              Change password →
            </a>
          </div>
        </div>

      </div>

      {showUpdateCard && (
        <UpdateCardModal
          onClose={() => setShowUpdateCard(false)}
          onSuccess={handleCardUpdated}
        />
      )}

      {showCancel && (
        <CancelModal
          onClose={() => setShowCancel(false)}
          onConfirm={handleCancel}
          loading={canceling}
        />
      )}
    </div>
  );
}

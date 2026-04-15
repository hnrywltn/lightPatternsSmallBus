"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Loader2, CheckCircle, CreditCard, ArrowRight } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SetupClientProps {
  name: string;
  businessName: string | null;
  tier: string | null;
  addOns: string[];
  monthlyRevenue: number;
  buildFee: number;
  hasStripeCustomer: boolean;
}

interface IntentData {
  type: "payment" | "setup";
  clientSecret: string;
  buildFee: number;
  tier: string;
  addOns: string[];
  monthlyRevenue: number;
}

function formatCurrency(amount: number) {
  return `$${amount.toLocaleString()}`;
}

// ─── Payment form ─────────────────────────────────────────────────────────────

function PaymentForm({
  intentData,
  onSuccess,
}: {
  intentData: IntentData;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    const result =
      intentData.type === "payment"
        ? await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.href },
            redirect: "if_required",
          })
        : await stripe.confirmSetup({
            elements,
            confirmParams: { return_url: window.location.href },
            redirect: "if_required",
          });

    if (result.error) {
      setError(result.error.message ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <PaymentElement />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading || !stripe}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold text-sm transition-colors shadow-lg shadow-amber-600/20"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {intentData.type === "payment"
              ? `Pay ${formatCurrency(intentData.buildFee)} & save card`
              : "Save payment method"}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SetupClient({
  name,
  businessName,
  tier,
  addOns,
  monthlyRevenue,
  buildFee,
  hasStripeCustomer,
}: SetupClientProps) {
  const router = useRouter();
  const [intentData, setIntentData] = useState<IntentData | null>(null);
  const [loadingIntent, setLoadingIntent] = useState(true);
  const [intentError, setIntentError] = useState("");
  const [done, setDone] = useState(false);

  const firstName = name.split(" ")[0];
  const planLabel = tier === "Premium" ? "Premium Plan" : tier ? `${tier} Plan` : "Your Plan";

  useEffect(() => {
    if (!hasStripeCustomer) {
      setLoadingIntent(false);
      return;
    }
    fetch("/api/client/setup/intent", { method: "POST" })
      .then((r) => r.json())
      .then((d) => {
        if (d.clientSecret) setIntentData(d as IntentData);
        else setIntentError(d.error ?? "Failed to load payment form.");
      })
      .catch(() => setIntentError("Failed to load payment form."))
      .finally(() => setLoadingIntent(false));
  }, [hasStripeCustomer]);

  function handleSuccess() {
    setDone(true);
    setTimeout(() => router.push("/client/dashboard"), 2000);
  }

  return (
    <div className="min-h-screen bg-[#05050a] text-white flex flex-col">
      {/* Nav */}
      <nav className="border-b border-white/8 px-6 sm:px-8 py-4">
        <span className="font-bold text-base tracking-tight">Light Patterns</span>
      </nav>

      <div className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-lg flex flex-col gap-8">

          {/* Welcome */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Welcome, {firstName}
            </h1>
            <p className="text-white/40 text-sm">
              {businessName
                ? `One last step to get ${businessName} set up.`
                : "One last step to get your account set up."}
            </p>
          </div>

          {/* Plan summary */}
          {(tier || buildFee > 0 || monthlyRevenue > 0) && (
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-4">What you&apos;ve agreed to</p>

              <div className="flex flex-col divide-y divide-white/5">
                {tier && (
                  <div className="flex items-center justify-between py-3 first:pt-0">
                    <span className="text-sm text-white/80">{planLabel}</span>
                    {monthlyRevenue > 0 && (
                      <span className="text-sm text-amber-400 font-medium">{formatCurrency(monthlyRevenue)}/mo</span>
                    )}
                  </div>
                )}
                {addOns.map((ao) => (
                  <div key={ao} className="flex items-center justify-between py-3">
                    <span className="text-sm text-white/60">{ao}</span>
                    <span className="text-xs text-white/30">Add-on</span>
                  </div>
                ))}
                {buildFee > 0 && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-white/80">One-time build fee</span>
                    <span className="text-sm text-white/60 font-medium">{formatCurrency(buildFee)}</span>
                  </div>
                )}
              </div>

              {monthlyRevenue > 0 && (
                <p className="text-xs text-white/25 mt-4 leading-relaxed">
                  Your {formatCurrency(monthlyRevenue)}/mo subscription starts when your site goes live. Your card will not be charged the monthly fee until then.
                </p>
              )}
            </div>
          )}

          {/* Payment section */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <CreditCard className="w-4 h-4 text-white/30" />
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                {buildFee > 0 ? "Payment" : "Save payment method"}
              </p>
            </div>

            {done ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
                <p className="text-white font-semibold">All set!</p>
                <p className="text-white/40 text-sm">Taking you to your dashboard…</p>
              </div>
            ) : !hasStripeCustomer ? (
              <p className="text-sm text-white/40">
                Your account is being set up. You&apos;ll be able to add a payment method from your dashboard shortly.
              </p>
            ) : loadingIntent ? (
              <div className="flex items-center gap-2 text-white/30 py-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading…</span>
              </div>
            ) : intentError ? (
              <p className="text-sm text-red-400">{intentError}</p>
            ) : intentData ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret: intentData.clientSecret,
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
                <PaymentForm intentData={intentData} onSuccess={handleSuccess} />
              </Elements>
            ) : null}
          </div>

          <a href="/client/dashboard" className="text-center text-xs text-white/20 hover:text-white/40 transition-colors">
            Skip for now →
          </a>

        </div>
      </div>
    </div>
  );
}

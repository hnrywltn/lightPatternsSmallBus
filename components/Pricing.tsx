"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: 79,
    description: "Perfect for getting your business online fast.",
    buildFee: 499,
    features: [
      "Up to 5 pages",
      "Mobile-responsive design",
      "Contact form",
      "Basic SEO setup",
      "Monthly content updates (2/mo)",
      "Hosting & security included",
    ],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Growth",
    price: 149,
    description: "For businesses ready to compete and convert.",
    buildFee: 899,
    features: [
      "Up to 12 pages",
      "Custom animations & interactions",
      "Blog or news section",
      "Advanced SEO & analytics",
      "Unlimited content updates",
      "Priority support",
      "Monthly performance report",
    ],
    cta: "Get started",
    highlight: true,
  },
  {
    name: "Pro",
    price: 249,
    description: "Full-service web presence for serious businesses.",
    buildFee: 1799,
    features: [
      "Unlimited pages",
      "E-commerce ready",
      "Custom integrations",
      "Google Ads landing pages",
      "A/B testing",
      "Dedicated account manager",
      "Weekly performance reports",
    ],
    cta: "Contact us",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-violet-400 text-sm font-medium uppercase tracking-widest mb-4">
            Pricing
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            One-time build fee to get started, then a monthly subscription to
            keep your site running and growing.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative flex flex-col rounded-2xl p-8 border transition-all duration-300 ${
                plan.highlight
                  ? "bg-violet-600/10 border-violet-500/40 shadow-xl shadow-violet-600/10"
                  : "bg-white/[0.02] border-white/5 hover:border-white/10"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-semibold">
                  Most popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-white font-semibold text-lg mb-1">
                  {plan.name}
                </h3>
                <p className="text-white/40 text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    ${plan.price}
                  </span>
                  <span className="text-white/40">/mo</span>
                </div>
                <p className="text-white/30 text-sm mt-1">
                  + ${plan.buildFee} one-time build fee
                </p>
              </div>

              <div className="h-px bg-white/5 my-6" />

              {/* Features */}
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                    <span className="text-white/60 text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#"
                className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  plan.highlight
                    ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/25"
                    : "border border-white/10 hover:border-white/20 text-white hover:bg-white/5"
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-white/30 text-sm mt-8"
        >
          All plans include free SSL, hosting, and a 14-day satisfaction
          guarantee.
        </motion.p>
      </div>
    </section>
  );
}

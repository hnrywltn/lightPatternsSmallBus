"use client";

import { motion } from "framer-motion";
import { Check, Mail, TrendingUp, Building2, NotebookPen } from "lucide-react";

const plans = [
  {
    name: "Essential",
    price: 59,
    buildFee: 1500,
    description:
      "A professional web presence with everything you need to stay online and supported.",
    highlight: false,
    cta: "Get started",
    sections: [
      {
        label: "Every month includes",
        items: [
          "Hosting, SSL & security patches",
          "Uptime monitoring",
          "CMS access for basic self-edits",
          "Custom Notion dashboard — passwords, payments & session tracking",
        ],
      },
      {
        label: "First year includes",
        items: [
          "Bug & technical issue fixes at no charge",
          "After year 1: all changes quoted per job",
        ],
      },
    ],
  },
  {
    name: "Premium",
    price: 99,
    buildFee: 3000,
    description:
      "A high-performance site with a full year of hands-on support, updates, and strategy.",
    highlight: true,
    cta: "Get started",
    sections: [
      {
        label: "Every month includes",
        items: [
          "Hosting, SSL & security patches",
          "Uptime monitoring",
          "CMS access for basic self-edits",
          "Custom Notion dashboard — passwords, payments & session tracking",
          "Monthly analytics report (traffic, rankings, top pages)",
        ],
      },
      {
        label: "First year includes",
        items: [
          "Bug & technical issue fixes at no charge",
          "Content updates — copy, photos, new sections",
          "Quarterly 30-min strategy & performance call",
          "After year 1: all changes quoted per job",
        ],
      },
    ],
  },
];

const addons = [
  {
    icon: Mail,
    name: "Business Setup",
    price: 349,
    priceLabel: "one-time",
    badge: null,
    description:
      "We handle your full digital footprint so your business looks established from day one.",
    features: [
      "Professional email via Google Workspace",
      "Google Calendar setup & configuration",
      "Google Business Profile listing",
      "Yelp business page",
      "Facebook & Instagram accounts",
      "LinkedIn business page",
    ],
  },
  {
    icon: TrendingUp,
    name: "Advanced SEO",
    price: 149,
    priceLabel: "/mo",
    badge: null,
    description:
      "Ongoing SEO that compounds over time — more organic traffic, more leads, less ad spend.",
    features: [
      "Monthly keyword research & targeting",
      "Technical SEO audits & fixes",
      "Google Search Console management",
      "Backlink building",
      "Local SEO optimization",
      "Monthly ranking report",
    ],
  },
  {
    icon: Building2,
    name: "Virtual Office",
    price: 89,
    priceLabel: "/mo",
    badge: "Coming soon",
    description:
      "A real business address and phone presence — without the overhead of physical office space.",
    features: [
      "Registered business mailing address",
      "Mail scanning & forwarding",
      "Live receptionist answering service",
      "Local or toll-free business number",
      "Voicemail-to-email transcription",
      "Package acceptance & notification",
    ],
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
          <p className="text-amber-400 text-sm font-medium uppercase tracking-widest mb-4">
            Pricing
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#f2ede4] tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-[#f2ede4]/40 max-w-xl mx-auto">
            A one-time build fee to get your site built right. A low monthly
            fee to keep it running. Changes after year one are quoted per job —
            no surprises.
          </p>
        </motion.div>

        {/* Notion callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl mx-auto mb-10 flex items-start gap-4 px-5 py-4 rounded-2xl border border-amber-500/20 bg-amber-500/5"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
            <NotebookPen className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-white text-sm font-medium mb-0.5">
              Every client gets a custom Notion dashboard
            </p>
            <p className="text-[#f2ede4]/40 text-sm leading-relaxed">
              Your own private workspace to track invoices, manage passwords for
              every service we set up, and log support sessions — organized and
              handed off to you on launch day.
            </p>
          </div>
        </motion.div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-24">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className={`relative flex flex-col rounded-2xl p-8 border transition-all duration-300 ${
                plan.highlight
                  ? "bg-amber-600/10 border-amber-500/40 shadow-xl shadow-amber-600/10"
                  : "bg-white/[0.02] border-white/5 hover:border-white/10"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-semibold">
                  Most popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-[#f2ede4] font-semibold text-lg mb-1">
                  {plan.name}
                </h3>
                <p className="text-[#f2ede4]/40 text-sm leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="mb-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#f2ede4]">
                    ${plan.price}
                  </span>
                  <span className="text-[#f2ede4]/40">/mo</span>
                </div>
                <p className="text-[#f2ede4]/30 text-sm mt-1">
                  ${plan.buildFee.toLocaleString()} one-time build fee
                </p>
              </div>

              <div className="h-px bg-white/5 my-6" />

              <div className="flex flex-col gap-6 flex-1 mb-8">
                {plan.sections.map((section) => (
                  <div key={section.label}>
                    <p className="text-[#f2ede4]/30 text-xs uppercase tracking-wider font-medium mb-3">
                      {section.label}
                    </p>
                    <ul className="flex flex-col gap-2.5">
                      {section.items.map((item) => {
                        const isDimmed = item.startsWith("After year 1");
                        return (
                          <li key={item} className="flex items-start gap-3">
                            <Check
                              className={`w-4 h-4 mt-0.5 shrink-0 ${
                                isDimmed
                                  ? "text-white/20"
                                  : "text-amber-400"
                              }`}
                            />
                            <span
                              className={`text-sm ${
                                isDimmed ? "text-[#f2ede4]/25" : "text-[#f2ede4]/60"
                              }`}
                            >
                              {item}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              <a
                href="#"
                className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  plan.highlight
                    ? "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/25"
                    : "border border-white/10 hover:border-white/20 text-white hover:bg-white/5"
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Add-ons header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-[#f2ede4]/30 text-sm uppercase tracking-widest font-medium mb-2">
            Add-ons
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            Extend your package
          </h3>
        </motion.div>

        {/* Add-on cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {addons.map((addon, i) => (
            <motion.div
              key={addon.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col rounded-2xl p-6 border border-white/5 bg-white/[0.02] hover:border-amber-500/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <addon.icon className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-[#f2ede4] font-semibold text-sm">
                      {addon.name}
                    </h4>
                    {addon.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#f2ede4]/30 font-medium border border-white/5">
                        {addon.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-amber-400 font-bold text-sm">
                      ${addon.price}
                    </span>
                    <span className="text-[#f2ede4]/30 text-xs">
                      {addon.priceLabel}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[#f2ede4]/40 text-sm mb-5 leading-relaxed">
                {addon.description}
              </p>

              <ul className="flex flex-col gap-2.5 flex-1">
                {addon.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                    <span className="text-[#f2ede4]/50 text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`mt-6 w-full text-center py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                  addon.badge
                    ? "border-white/5 text-[#f2ede4]/25 cursor-not-allowed"
                    : "border-white/8 hover:border-amber-500/30 text-[#f2ede4]/60 hover:text-white hover:bg-amber-500/5"
                }`}
              >
                {addon.badge ? "Coming soon" : "Add to plan"}
              </a>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-[#f2ede4]/25 text-sm mt-10"
        >
          All plans include a 14-day satisfaction guarantee. Add-ons can be
          added at signup or any time after launch.
        </motion.p>
      </div>
    </section>
  );
}

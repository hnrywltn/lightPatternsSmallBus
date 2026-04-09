"use client";

import { motion } from "framer-motion";
import { MessageSquare, Paintbrush, Rocket, RefreshCw } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Tell us about your business",
    description:
      "Fill out a short brief about your business, your goals, and what you love (and hate) about your current online presence.",
  },
  {
    icon: Paintbrush,
    step: "02",
    title: "We design & build your site",
    description:
      "Our team crafts a custom, high-performance site tailored to your brand. You get a preview and we refine until it's perfect.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Launch in under 2 weeks",
    description:
      "We handle hosting, domain setup, and launch. Your business is live and ready to attract customers.",
  },
  {
    icon: RefreshCw,
    step: "04",
    title: "We keep it running",
    description:
      "Your subscription covers hosting, security, monitoring, and your Notion dashboard — and your first year includes support.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#0c0a07] py-32 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">

        {/* Editorial header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#f2ede4] tracking-tight leading-none"
          >
            How<br />
            <span className="text-amber-400">it works.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-[#f2ede4]/40 max-w-xs text-sm leading-relaxed lg:text-right"
          >
            From first conversation to live site — we keep it simple, fast, and stress-free for you.
          </motion.p>
        </div>

        {/* Steps — horizontal rule style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group p-8 border-t border-[#f2ede4]/5 lg:border-t-0 lg:border-l first:border-l-0 hover:bg-amber-400/[0.04] transition-colors duration-300"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-5xl font-black text-[#f2ede4]/5 group-hover:text-amber-400/10 transition-colors select-none">
                  {s.step}
                </span>
              </div>

              <h3 className="text-[#f2ede4] font-bold text-lg mb-3 leading-snug">{s.title}</h3>
              <p className="text-[#f2ede4]/40 text-sm leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  }),
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background glow — warm amber/gold Edison tones */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-700/20 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-orange-700/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-yellow-600/8 rounded-full blur-[80px]" />
      </div>

      {/* Warm grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#f2ede4 1px, transparent 1px), linear-gradient(90deg, #f2ede4 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-sm mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Professional websites for small businesses</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#f2ede4] leading-[1.05] mb-6"
        >
          Your business deserves
          <br />
          <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 bg-clip-text text-transparent">
            a beautiful website
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-lg text-[#f2ede4]/50 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          We design and build high-performance websites for small businesses,
          then keep them running, updated, and growing — all for one simple
          monthly subscription.
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#pricing"
            className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-amber-600/25 hover:shadow-amber-500/40"
          >
            See plans & pricing
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="#portfolio"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#f2ede4]/10 hover:border-[#f2ede4]/20 text-[#f2ede4]/80 hover:text-[#f2ede4] font-medium transition-all duration-200 hover:bg-[#f2ede4]/5"
          >
            View our work
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.p
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-10 text-sm text-[#f2ede4]/30"
        >
          Trusted by 50+ small businesses across the country
        </motion.p>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0c0a07] to-transparent" />
    </section>
  );
}

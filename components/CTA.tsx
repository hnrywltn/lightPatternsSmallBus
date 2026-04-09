"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-[#0c0a07] py-32 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">

          {/* Bold statement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-6">
              Ready to start?
            </p>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#f2ede4] tracking-tight leading-none">
              Let&apos;s light up<br />
              <span className="text-amber-400">your business.</span>
            </h2>
          </motion.div>

          {/* CTA block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-4 shrink-0"
          >
            <a
              href="#pricing"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-lg transition-all duration-200 shadow-xl shadow-amber-500/20"
            >
              See plans & pricing
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-[#f2ede4]/25 text-xs text-center">
              14-day satisfaction guarantee. No lock-in.
            </p>
          </motion.div>

        </div>

        {/* Bottom rule with tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24 pt-8 border-t border-[#f2ede4]/5 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-[#f2ede4]/20 text-sm">
            Built once. Kept perfect. Always on.
          </p>
          <p className="text-[#f2ede4]/20 text-sm">
            Serving small businesses nationwide.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden border border-violet-500/20 bg-gradient-to-br from-violet-600/20 to-indigo-700/10 p-12 text-center"
        >
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-violet-600/20 rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
              Ready to stand out online?
            </h2>
            <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
              Join dozens of small businesses that trust Light Patterns to be
              their web presence — built beautifully, maintained reliably.
            </p>
            <a
              href="#pricing"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all duration-200 shadow-xl shadow-violet-600/30 hover:shadow-violet-500/40"
            >
              See plans & pricing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

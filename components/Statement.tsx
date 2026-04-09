"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Statement() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  return (
    <section ref={ref} className="bg-amber-400 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-32 lg:py-48">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">

          {/* Statement text — takes 3 cols */}
          <div className="lg:col-span-3">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-amber-700 text-sm font-semibold uppercase tracking-widest mb-8"
            >
              Our belief
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-amber-950 leading-[1.05] tracking-tight"
            >
              A great website is the hardest&#8209;working employee your business will ever hire.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-10 flex flex-col sm:flex-row gap-8"
            >
              <div>
                <p className="text-3xl font-black text-amber-950">24/7</p>
                <p className="text-amber-800/60 text-sm mt-1">Always working for you</p>
              </div>
              <div className="w-px bg-amber-600/20 hidden sm:block" />
              <div>
                <p className="text-3xl font-black text-amber-950">14 days</p>
                <p className="text-amber-800/60 text-sm mt-1">Average time to launch</p>
              </div>
              <div className="w-px bg-amber-600/20 hidden sm:block" />
              <div>
                <p className="text-3xl font-black text-amber-950">50+</p>
                <p className="text-amber-800/60 text-sm mt-1">Businesses launched</p>
              </div>
            </motion.div>
          </div>

          {/* Decorative side — 2 cols */}
          <motion.div
            style={{ y }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {/* Mock site preview card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="rounded-2xl overflow-hidden border-2 border-amber-900/10 bg-amber-950 shadow-2xl shadow-amber-900/30"
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 bg-amber-900/30 border-b border-amber-900/20">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-700/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-700/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-700/40" />
                <div className="mx-auto w-36 h-4 rounded bg-amber-900/30 text-amber-700/50 text-[9px] flex items-center justify-center font-mono">
                  yoursite.com
                </div>
              </div>

              {/* Fake site content */}
              <div className="p-5 space-y-3 bg-[#0c0a07]">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-3 w-16 rounded bg-amber-600/60" />
                  <div className="flex gap-2">
                    <div className="h-2 w-10 rounded bg-[#f2ede4]/10" />
                    <div className="h-2 w-10 rounded bg-[#f2ede4]/10" />
                    <div className="h-2 w-10 rounded bg-[#f2ede4]/10" />
                  </div>
                </div>
                <div className="h-24 rounded-xl bg-gradient-to-br from-amber-600/20 to-amber-900/10 border border-amber-600/10 flex items-end p-3">
                  <div className="space-y-1.5">
                    <div className="h-3 w-28 rounded bg-[#f2ede4]/30" />
                    <div className="h-2 w-20 rounded bg-[#f2ede4]/15" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-12 rounded-lg bg-[#f2ede4]/5 border border-[#f2ede4]/5" />
                  ))}
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-full rounded bg-[#f2ede4]/8" />
                  <div className="h-2 w-4/5 rounded bg-[#f2ede4]/8" />
                  <div className="h-2 w-2/3 rounded bg-[#f2ede4]/8" />
                </div>
              </div>
            </motion.div>

            {/* Small label */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center text-amber-800/40 text-xs tracking-wider"
            >
              Every site we build — yours too.
            </motion.p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

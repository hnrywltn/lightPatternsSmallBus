"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import EdisonBulb from "./EdisonBulb";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-amber-400">
      {/* Subtle radial warmth — brighter center */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-yellow-300/40 rounded-full blur-[120px]" />
      </div>

      {/* ── Left side vertical nav ── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-5 z-20"
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-xs font-medium text-amber-900/60 hover:text-amber-900 tracking-widest uppercase transition-colors writing-mode-vertical"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
          >
            {link.label}
          </a>
        ))}
      </motion.div>

      {/* ── Large Edison Bulb — centrepiece ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <EdisonBulb className="w-64 sm:w-80 lg:w-[26rem] xl:w-[30rem] drop-shadow-2xl" />
      </div>

      {/* ── Bottom-left headline (beans.agency style) ── */}
      <div className="absolute bottom-0 inset-x-0 px-8 pb-12 lg:px-16">
        <div className="flex flex-col sm:flex-row items-end justify-between gap-6 max-w-7xl mx-auto">
          {/* Headline */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-amber-950 leading-[0.95]"
            >
              We are<br />
              Light Patterns<span className="text-amber-700">®</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-3 text-amber-900/60 text-sm max-w-xs leading-relaxed"
            >
              Beautiful websites for small businesses —
              built once, kept running.
            </motion.p>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-2 text-amber-900/40 text-xs uppercase tracking-widest shrink-0 pb-1"
          >
            <span>Scroll</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </motion.div>
          </motion.div>
        </div>
      </div>

    </section>
  );
}

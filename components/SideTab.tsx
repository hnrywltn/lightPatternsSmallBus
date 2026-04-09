"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function SideTab() {
  return (
    <motion.a
      href="#pricing"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden lg:flex"
    >
      <div className="flex items-center gap-2 bg-amber-950 text-amber-300 px-3 py-4 rounded-l-xl cursor-pointer hover:bg-amber-900 transition-colors group">
        <span
          className="text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Get a site
        </span>
        <ArrowRight className="w-3 h-3 rotate-90 group-hover:translate-y-0.5 transition-transform" />
      </div>
    </motion.a>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Lightbulb } from "lucide-react";

const links = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "FAQ", href: "#faq" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar({ forceDark = false }: { forceDark?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Over the amber hero: dark text. Once scrolled into dark sections: light text.
  // forceDark: used on non-homepage pages that have a dark background from the start.
  const onAmber = !forceDark && !scrolled;

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0c0a07]/85 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-600/30">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          <span className={`font-semibold tracking-tight transition-colors duration-300 ${onAmber ? "text-amber-950" : "text-[#f2ede4]"}`}>
            Light Patterns
          </span>
        </a>

        {/* Desktop links — hidden on hero (left-side nav handles it) */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors duration-300 ${
                onAmber
                  ? "text-amber-900/60 hover:text-amber-900"
                  : "text-[#f2ede4]/60 hover:text-[#f2ede4]"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Sign in — desktop only */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/login"
            className={`text-sm transition-colors duration-300 ${
              onAmber
                ? "text-amber-900/60 hover:text-amber-900"
                : "text-[#f2ede4]/60 hover:text-[#f2ede4]"
            }`}
          >
            Sign in
          </a>
          <a
            href="#contact"
            className="text-sm px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors shadow-lg shadow-amber-600/20"
          >
            Get started
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className={`md:hidden transition-colors ${onAmber ? "text-amber-900/70 hover:text-amber-900" : "text-[#f2ede4]/70 hover:text-[#f2ede4]"}`}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0c0a07]/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-[#f2ede4]/70 hover:text-[#f2ede4] transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                className="mt-2 text-center px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors"
              >
                Get started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

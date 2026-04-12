"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
      } else {
        setStatus("success");
        setEmail("");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mt-20 border-t border-[#f2ede4]/8 pt-16"
    >
      <div className="max-w-xl">
        <p className="text-amber-500 text-sm font-medium tracking-widest uppercase mb-3">
          Stay in the loop
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#f2ede4] leading-snug">
          New articles, straight to your inbox.
        </h2>
        <p className="mt-3 text-[#f2ede4]/45 text-base leading-relaxed">
          We write about ethical design, dark patterns, and what building an
          honest website actually looks like. No noise, no selling your data.
        </p>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-amber-400 font-medium"
            >
              You&apos;re in. We&apos;ll be in touch.
            </motion.p>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#f2ede4]/6 border border-[#f2ede4]/10 text-[#f2ede4] placeholder:text-[#f2ede4]/25 focus:outline-none focus:border-amber-600/50 focus:bg-[#f2ede4]/8 transition-colors text-sm"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-medium text-sm transition-colors shadow-lg shadow-amber-600/20 shrink-0"
              >
                {status === "loading" ? "Subscribing…" : "Subscribe"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {status === "error" && (
          <p className="mt-3 text-red-400 text-sm">{errorMsg}</p>
        )}

        <p className="mt-4 text-[#f2ede4]/20 text-xs">
          Unsubscribe any time. We&apos;ll never share your email.
        </p>
      </div>
    </motion.section>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";

type Field = "name" | "phone" | "email" | "business" | "goals";

type FormState = Record<Field, string>;

const inputClass =
  "w-full bg-[#f2ede4]/5 border border-[#f2ede4]/10 rounded-xl px-4 py-3.5 text-[#f2ede4] placeholder:text-[#f2ede4]/25 text-sm focus:outline-none focus:border-amber-500/50 focus:bg-[#f2ede4]/8 transition-all duration-200";

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    business: "",
    goals: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function set(field: Field) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Network error — please try again.");
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="bg-[#0c0a07] py-32 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24">

          {/* Left col — header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2"
          >
            <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-6">
              Get in touch
            </p>
            <h2 className="text-5xl sm:text-6xl font-black text-[#f2ede4] tracking-tight leading-none">
              Let&apos;s talk<br />
              <span className="text-amber-400">about your site.</span>
            </h2>
            <p className="mt-6 text-[#f2ede4]/40 text-sm leading-relaxed max-w-xs">
              Tell us a bit about your business and what you&apos;re looking for. We&apos;ll get back to you within one business day.
            </p>
          </motion.div>

          {/* Right col — form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-3"
          >
            {status === "success" ? (
              <div className="flex flex-col items-start gap-4 py-12">
                <CheckCircle className="w-10 h-10 text-amber-400" />
                <h3 className="text-2xl font-bold text-[#f2ede4]">We&apos;ll be in touch.</h3>
                <p className="text-[#f2ede4]/40 text-sm leading-relaxed max-w-sm">
                  Thanks for reaching out. Expect a reply within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Row — name + phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#f2ede4]/40 font-medium uppercase tracking-widest">
                      Name <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Smith"
                      value={form.name}
                      onChange={set("name")}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#f2ede4]/40 font-medium uppercase tracking-widest">
                      Phone <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(555) 000-0000"
                      value={form.phone}
                      onChange={set("phone")}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Row — email + business */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#f2ede4]/40 font-medium uppercase tracking-widest">
                      Email <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@yourbiz.com"
                      value={form.email}
                      onChange={set("email")}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#f2ede4]/40 font-medium uppercase tracking-widest">
                      Business name
                    </label>
                    <input
                      type="text"
                      placeholder="Optional"
                      value={form.business}
                      onChange={set("business")}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Goals textarea */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#f2ede4]/40 font-medium uppercase tracking-widest">
                    Tell us about your goals <span className="text-amber-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="What does your business do, and what are you hoping a new website will help you achieve?"
                    value={form.goals}
                    onChange={set("goals")}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {errorMsg && (
                  <p className="text-red-400 text-sm">{errorMsg}</p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-amber-950 font-black text-base transition-all duration-200 shadow-xl shadow-amber-500/20"
                  >
                    {status === "loading" ? "Sending…" : "Send message"}
                    {status !== "loading" && (
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

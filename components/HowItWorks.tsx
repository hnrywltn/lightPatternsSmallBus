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
      "Your subscription covers updates, security, performance monitoring, and content changes — so you never touch a line of code.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  }),
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-violet-400 text-sm font-medium uppercase tracking-widest mb-4">
            How it works
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            From idea to live site
            <br />
            <span className="text-white/40">in four steps</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-violet-500/20 transition-all duration-300"
            >
              {/* Step number */}
              <span className="absolute top-5 right-5 text-4xl font-bold text-white/5 group-hover:text-violet-500/10 transition-colors select-none">
                {s.step}
              </span>

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-5">
                <s.icon className="w-5 h-5 text-violet-400" />
              </div>

              <h3 className="text-white font-semibold mb-2">{s.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

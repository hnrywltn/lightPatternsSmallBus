"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "What is the one-time build fee for?",
    a: "The build fee covers design, development, and launch of your custom website. It's a one-time cost — once your site is live, you only pay the monthly subscription.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Yes, any time. If you cancel, your site remains live for the remainder of your billing period. After that, you can take ownership of the site files — no lock-in.",
  },
  {
    q: "How long does it take to build my site?",
    a: "Most sites are live within 10–14 business days. Complex projects (e-commerce, custom integrations) may take 3–4 weeks. We'll give you a timeline before we start.",
  },
  {
    q: "What does 'content updates' mean?",
    a: "Need to change your hours, swap a photo, update your menu, or add a new team member? That's a content update. On Starter you get 2/mo; Growth and Pro are unlimited.",
  },
  {
    q: "Do I need to own my domain?",
    a: "You can use a domain you already own, or we can help you purchase one. Either way, you always retain ownership of your domain.",
  },
  {
    q: "What if I'm not happy with the design?",
    a: "We offer unlimited revisions during the build phase, and a 14-day satisfaction guarantee after launch. If you're not happy, we'll make it right — or refund you.",
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="text-white/80 font-medium">{q}</span>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus className="w-4 h-4 text-white/40 shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-white/40 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-violet-400 text-sm font-medium uppercase tracking-widest mb-4">
            FAQ
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Common questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {faqs.map((item) => (
            <Item key={item.q} {...item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

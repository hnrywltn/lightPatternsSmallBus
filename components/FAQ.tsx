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
    q: "What counts as a bug vs. a content change?",
    a: "A bug is anything broken — a form not submitting, a layout breaking on mobile, a page not loading. Those are fixed at no charge during your first year. A content change is an intentional update: new copy, new photos, adding a page. Those are quoted per job.",
  },
  {
    q: "What happens after my first year?",
    a: "Your monthly subscription stays the same — hosting, security, and your Notion dashboard are always included. Content updates and changes simply move to a per-job quote, so you only pay when you need something.",
  },
  {
    q: "Do I need to own my domain?",
    a: "You can use a domain you already own, or we can help you purchase one. Either way, you always retain full ownership of your domain.",
  },
  {
    q: "What if I'm not happy with the design?",
    a: "We offer unlimited revisions during the build phase, and a 14-day satisfaction guarantee after launch. If you're not happy, we'll make it right — or refund you.",
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-amber-900/15">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left gap-4"
      >
        <span className="text-amber-950 font-semibold text-lg">{q}</span>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus className="w-5 h-5 text-amber-800/50 shrink-0" />
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
            <p className="pb-6 text-amber-900/60 text-sm leading-relaxed max-w-2xl">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="bg-amber-400 py-32 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

          {/* Sticky header col */}
          <div className="lg:col-span-2">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-5xl sm:text-6xl font-black text-amber-950 tracking-tight leading-none lg:sticky lg:top-24"
            >
              Common<br />
              <span className="text-amber-700">questions.</span>
            </motion.h2>
          </div>

          {/* Accordion col */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            {faqs.map((item) => (
              <Item key={item.q} {...item} />
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

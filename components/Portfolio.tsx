"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    name: "Bloom Florals",
    category: "Floral Shop",
    description: "Elegant e-commerce site with custom booking system.",
    gradient: "from-rose-500/30 to-pink-600/10",
  },
  {
    name: "Ironwood Coffee",
    category: "Café",
    description: "Brand-forward site with menu and loyalty program integration.",
    gradient: "from-amber-600/30 to-orange-700/10",
  },
  {
    name: "Peak Legal",
    category: "Law Firm",
    description: "Trust-building professional site with client portal.",
    gradient: "from-stone-400/20 to-stone-600/10",
  },
  {
    name: "Solstice Spa",
    category: "Wellness",
    description: "Calming, animated site with online booking integration.",
    gradient: "from-emerald-500/30 to-teal-700/10",
  },
  {
    name: "Anchor & Oak",
    category: "Restaurant",
    description: "Full-screen visuals, reservations, and weekly specials.",
    gradient: "from-amber-700/30 to-yellow-900/10",
  },
  {
    name: "Meridian Fitness",
    category: "Gym",
    description: "Class scheduling, membership tiers, and trainer profiles.",
    gradient: "from-orange-500/30 to-red-700/10",
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-amber-400 text-sm font-medium uppercase tracking-widest mb-4">
            Portfolio
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#f2ede4] tracking-tight">
            Sites we&apos;ve built
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-white/5 hover:border-amber-500/20 bg-white/[0.02] transition-all duration-300 cursor-pointer"
            >
              {/* Mock site preview */}
              <div
                className={`h-48 bg-gradient-to-br ${p.gradient} relative overflow-hidden`}
              >
                {/* Fake browser chrome */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>
                {/* Fake content lines */}
                <div className="absolute bottom-6 left-5 right-5 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-white/10" />
                  <div className="h-2 w-1/2 rounded bg-white/6" />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ExternalLink className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-[#f2ede4] font-semibold">{p.name}</h3>
                  <span className="text-xs text-[#f2ede4]/30 bg-white/5 px-2 py-0.5 rounded-full">
                    {p.category}
                  </span>
                </div>
                <p className="text-[#f2ede4]/40 text-sm">{p.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

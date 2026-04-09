"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    name: "Bloom Florals",
    category: "Floral Shop",
    description: "Elegant e-commerce with custom booking.",
    gradient: "from-rose-400/60 to-pink-600/30",
    size: "large",
  },
  {
    name: "Ironwood Coffee",
    category: "Café",
    description: "Brand-forward with menu integration.",
    gradient: "from-amber-700/60 to-orange-800/30",
    size: "small",
  },
  {
    name: "Peak Legal",
    category: "Law Firm",
    description: "Professional site with client portal.",
    gradient: "from-stone-500/50 to-stone-700/30",
    size: "small",
  },
  {
    name: "Solstice Spa",
    category: "Wellness",
    description: "Calming animations with online booking.",
    gradient: "from-emerald-500/60 to-teal-700/30",
    size: "large",
  },
  {
    name: "Anchor & Oak",
    category: "Restaurant",
    description: "Full-screen visuals and reservations.",
    gradient: "from-amber-800/60 to-yellow-900/30",
    size: "small",
  },
  {
    name: "Meridian Fitness",
    category: "Gym",
    description: "Class scheduling and membership tiers.",
    gradient: "from-orange-500/60 to-red-700/30",
    size: "small",
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="bg-amber-400 py-32 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">

        {/* Editorial header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-amber-950 tracking-tight leading-none"
          >
            Our<br />
            <span className="text-amber-700">work.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-amber-900/50 max-w-xs text-sm leading-relaxed lg:text-right"
          >
            Every site is custom-built for the business it represents.
            No templates, no shortcuts.
          </motion.p>
        </div>

        {/* Asymmetric editorial grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Row 1: 1 large + 2 small */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 group relative overflow-hidden rounded-3xl bg-amber-950 border-2 border-amber-900/20 cursor-pointer min-h-72"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${projects[0].gradient}`} />
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-white/40 bg-white/10 px-3 py-1 rounded-full">
                  {projects[0].category}
                </span>
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-1">{projects[0].name}</h3>
                <p className="text-white/50 text-sm">{projects[0].description}</p>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            {[projects[1], projects[2]].map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i + 1) * 0.1 }}
                className="group relative overflow-hidden rounded-3xl bg-amber-950 border-2 border-amber-900/20 cursor-pointer min-h-32"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient}`} />
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/40 bg-white/10 px-3 py-1 rounded-full">
                      {p.category}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{p.name}</h3>
                    <p className="text-white/40 text-xs">{p.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Row 2: 2 small + 1 large */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            {[projects[4], projects[5]].map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-3xl bg-amber-950 border-2 border-amber-900/20 cursor-pointer min-h-32"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient}`} />
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/40 bg-white/10 px-3 py-1 rounded-full">
                      {p.category}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{p.name}</h3>
                    <p className="text-white/40 text-xs">{p.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 group relative overflow-hidden rounded-3xl bg-amber-950 border-2 border-amber-900/20 cursor-pointer min-h-72"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${projects[3].gradient}`} />
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-white/40 bg-white/10 px-3 py-1 rounded-full">
                  {projects[3].category}
                </span>
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-1">{projects[3].name}</h3>
                <p className="text-white/50 text-sm">{projects[3].description}</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

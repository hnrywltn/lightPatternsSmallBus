"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import Image from "next/image";

const projects = [
  {
    name: "Atlas Barbershop",
    category: "Barbershop",
    description: "Dark editorial aesthetic with services, hours, and booking.",
    image: "/portfolio/atlas-barbershop.png",
    size: "large",
  },
  {
    name: "Bright Side Plumbing",
    category: "Home Services",
    description: "Trust-forward design with emergency line and service cards.",
    image: "/portfolio/bright-side-plumbing.png",
    size: "small",
  },
  {
    name: "Greenway Landscaping",
    category: "Landscaping",
    description: "Bold outdoor aesthetic with process flow and service grid.",
    image: "/portfolio/greenway-landscaping.png",
    size: "small",
  },
  {
    name: "Bloom Nail Studio",
    category: "Nail Studio",
    description: "Minimal luxury with full service menu and online booking.",
    image: "/portfolio/bloom-nail-studio.png",
    size: "large",
  },
  {
    name: "Iron & Oak Fitness",
    category: "Fitness Studio",
    description: "High-energy layout with class schedule and membership tiers.",
    image: "/portfolio/iron-oak-fitness.png",
    size: "small",
  },
  {
    name: "Pepper & Salt Café",
    category: "Café",
    description: "Warm, editorial feel with all-day menu and ordering.",
    image: "/portfolio/pepper-salt-cafe.png",
    size: "small",
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="bg-amber-400 py-32 px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
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

        {/* 2-column gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
              className="group relative aspect-video overflow-hidden rounded-2xl cursor-pointer shadow-lg"
            >
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-11 h-11 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

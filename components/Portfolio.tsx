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

function ProjectCard({
  project,
  className,
  delay = 0,
  large = false,
}: {
  project: (typeof projects)[0];
  className?: string;
  delay?: number;
  large?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`group relative overflow-hidden rounded-3xl bg-amber-950 border-2 border-amber-900/20 cursor-pointer ${large ? "min-h-72" : "min-h-32"} ${className ?? ""}`}
    >
      <Image
        src={project.image}
        alt={project.name}
        fill
        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        sizes="(max-width: 1024px) 100vw, 60vw"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <ArrowUpRight className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

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
          <ProjectCard project={projects[0]} className="lg:col-span-7" delay={0} large />

          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            <ProjectCard project={projects[1]} delay={0.1} />
            <ProjectCard project={projects[2]} delay={0.2} />
          </div>

          {/* Row 2: 2 small + 1 large */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            <ProjectCard project={projects[4]} delay={0} />
            <ProjectCard project={projects[5]} delay={0.1} />
          </div>

          <ProjectCard project={projects[3]} className="lg:col-span-7" delay={0.2} large />

        </div>
      </div>
    </section>
  );
}

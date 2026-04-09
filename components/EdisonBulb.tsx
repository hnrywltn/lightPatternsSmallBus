"use client";

import { motion } from "framer-motion";

export default function EdisonBulb({ className }: { className?: string }) {
  // Smooth filament path — flowing S-curve M-shape
  const filament = "M 128,244 C 118,196 134,148 156,144 C 178,140 182,196 190,212 C 198,196 202,140 224,144 C 246,148 262,196 252,244";

  return (
    <motion.div
      className={className}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 380 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* === Filters === */}
          <filter id="heavyGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <filter id="midGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>

          {/* === Gradients === */}
          <radialGradient id="innerLight" cx="50%" cy="52%" r="48%">
            <stop offset="0%"  stopColor="#FFFBEA" stopOpacity="0.65" />
            <stop offset="35%" stopColor="#FFD566" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#FF9A00" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#FF6A00" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="baseGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#3B1F00" />
            <stop offset="22%"  stopColor="#A86800" />
            <stop offset="45%"  stopColor="#E8A800" />
            <stop offset="68%"  stopColor="#B07500" />
            <stop offset="100%" stopColor="#3B1F00" />
          </linearGradient>

          <linearGradient id="collarGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#2A1500" />
            <stop offset="35%"  stopColor="#D4A000" />
            <stop offset="65%"  stopColor="#A07000" />
            <stop offset="100%" stopColor="#2A1500" />
          </linearGradient>
        </defs>

        {/* ── AMBIENT HALO ── */}
        <ellipse
          cx="190" cy="192" rx="130" ry="120"
          fill="#FFB700" opacity="0.18"
          filter="url(#heavyGlow)"
        />

        {/* ── GLASS GLOBE ── */}
        {/* Interior warm glow */}
        <circle cx="190" cy="192" r="155" fill="url(#innerLight)" />
        {/* Glass body — near-transparent amber tint */}
        <circle
          cx="190" cy="192" r="155"
          fill="#C87000" fillOpacity="0.05"
          stroke="#3B1F00" strokeWidth="2.5"
        />

        {/* ── GLASS HIGHLIGHTS ── */}
        {/* Primary specular — one bold confident arc, upper-left */}
        <path
          d="M 62,95 Q 92,52 148,44"
          stroke="white" strokeWidth="5.5"
          strokeLinecap="round" opacity="0.6"
        />
        {/* Secondary specular — smaller, lower */}
        <path
          d="M 48,142 Q 58,118 76,108"
          stroke="white" strokeWidth="3"
          strokeLinecap="round" opacity="0.32"
        />
        {/* Tiny glint dot */}
        <circle cx="68" cy="82" r="5" fill="white" opacity="0.28" />

        {/* Subtle right-side rim warmth */}
        <path
          d="M 332,148 Q 344,184 338,228"
          stroke="#FFD566" strokeWidth="2"
          strokeLinecap="round" opacity="0.18"
        />

        {/* ── FILAMENT SUPPORT WIRES ── */}
        <line x1="128" y1="244" x2="128" y2="300" stroke="#7A5000" strokeWidth="1.5" opacity="0.55" />
        <line x1="252" y1="244" x2="252" y2="300" stroke="#7A5000" strokeWidth="1.5" opacity="0.55" />
        <line x1="128" y1="290" x2="252" y2="290" stroke="#7A5000" strokeWidth="1.2" opacity="0.4"  />
        {/* Inner spacers */}
        <line x1="155" y1="268" x2="155" y2="244" stroke="#7A5000" strokeWidth="1"   opacity="0.3"  />
        <line x1="225" y1="268" x2="225" y2="244" stroke="#7A5000" strokeWidth="1"   opacity="0.3"  />

        {/* ── FILAMENT — heavy outer glow ── */}
        <motion.path
          d={filament}
          stroke="#FF7700" strokeWidth="28"
          strokeLinecap="round" strokeLinejoin="round"
          fill="none" opacity="0.22"
          filter="url(#heavyGlow)"
          animate={{ opacity: [0.22, 0.14, 0.22, 0.18, 0.22] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ── FILAMENT — mid glow ── */}
        <motion.path
          d={filament}
          stroke="#FFAA00" strokeWidth="10"
          strokeLinecap="round" strokeLinejoin="round"
          fill="none" opacity="0.55"
          filter="url(#midGlow)"
          animate={{ opacity: [0.55, 0.38, 0.58, 0.42, 0.55] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ── FILAMENT — soft inner ── */}
        <motion.path
          d={filament}
          stroke="#FFD566" strokeWidth="4"
          strokeLinecap="round" strokeLinejoin="round"
          fill="none" opacity="0.85"
          filter="url(#softGlow)"
          animate={{ opacity: [0.85, 0.6, 0.88, 0.68, 0.85] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ── FILAMENT — bright core ── */}
        <motion.path
          d={filament}
          stroke="#FFFCE0" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
          fill="none"
          animate={{ opacity: [1, 0.65, 1, 0.75, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ── NECK (globe → collar) ── */}
        <path
          d="M 142,334 C 142,346 152,356 162,360 L 218,360 C 228,356 238,346 238,334"
          fill="#3B1F00" fillOpacity="0.12"
          stroke="#3B1F00" strokeWidth="1.5"
        />

        {/* ── COLLAR ── */}
        <path d="M 157,360 L 150,382 L 230,382 L 223,360 Z" fill="url(#collarGold)" />
        <line x1="150" y1="368" x2="230" y2="368" stroke="#E8C000" strokeWidth="0.8" opacity="0.45" />
        <line x1="150" y1="375" x2="230" y2="375" stroke="#2A1500" strokeWidth="0.6" opacity="0.35" />

        {/* ── SCREW BASE ── */}
        <path d="M 150,382 L 145,510 Q 190,522 235,510 L 230,382 Z" fill="url(#baseGold)" />

        {/* Thread grooves */}
        {([396,410,424,438,452,466,480,494,507] as number[]).map((y, i) => (
          <g key={y}>
            <line
              x1={148 - i * 0.25} y1={y}
              x2={232 + i * 0.25} y2={y}
              stroke="#2A1500" strokeWidth="1.4" opacity="0.5"
            />
            <line
              x1={148 - i * 0.25} y1={y - 2}
              x2={232 + i * 0.25} y2={y - 2}
              stroke="#D4A000" strokeWidth="0.6" opacity="0.3"
            />
          </g>
        ))}

        {/* ── CONTACT CAP ── */}
        <ellipse cx="190" cy="512" rx="45" ry="9"  fill="#2A1500" />
        <ellipse cx="190" cy="509" rx="45" ry="8"  fill="#7A5000" />
        <ellipse cx="190" cy="506" rx="45" ry="7.5" fill="#C49000" />
        {/* Centre contact tip */}
        <ellipse cx="190" cy="504" rx="16" ry="4.5" fill="#E8C800" />
      </svg>
    </motion.div>
  );
}

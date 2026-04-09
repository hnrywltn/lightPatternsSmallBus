"use client";

import { motion } from "framer-motion";

// Spiral shifted down 20px so it sits centered in the larger globe body
const SPIRAL = `
  M 145,192
  C 145,200 235,198 235,206
  C 235,214 145,212 145,221
  C 145,229 235,227 235,235
  C 235,243 145,241 145,250
  C 145,258 235,256 235,264
  C 235,272 145,270 145,279
  C 145,287 235,285 235,293
  C 235,301 145,299 145,308
  C 145,316 235,314 235,322
  C 235,330 145,328 145,337
  C 145,345 235,343 235,351
  C 235,359 145,357 145,366
`.trim();

// Globe shape path — proper neck at top, rounded body
// Neck: ~44px wide at y=130, widens to ~300px at body, rounded bottom at y=450
const GLOBE = "M 168,130 C 138,148 36,210 36,305 C 36,405 106,452 190,452 C 274,452 344,405 344,305 C 344,210 242,148 212,130 Z";

export default function EdisonBulb({ className }: { className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 380 570"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Clip to globe shape */}
          <clipPath id="ep-clip">
            <path d={GLOBE} />
          </clipPath>

          <filter id="ep-heavy" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="20" />
          </filter>
          <filter id="ep-mid" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="ep-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>

          {/* Warm interior glow — centred on filament */}
          <radialGradient id="ep-glow" cx="50%" cy="46%" r="46%">
            <stop offset="0%"   stopColor="#FFF8D6" stopOpacity="0.65" />
            <stop offset="28%"  stopColor="#FFD060" stopOpacity="0.32" />
            <stop offset="60%"  stopColor="#FF8800" stopOpacity="0.1"  />
            <stop offset="100%" stopColor="#FF5500" stopOpacity="0"    />
          </radialGradient>

          <radialGradient id="ep-glassfill" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFF9EE" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#FFE0A0" stopOpacity="0.02" />
          </radialGradient>

          <linearGradient id="ep-socket" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#0a0a0a" />
            <stop offset="40%"  stopColor="#282828" />
            <stop offset="70%"  stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#070707" />
          </linearGradient>
        </defs>

        {/* ── PENDANT CORD ── */}
        <line x1="190" y1="0" x2="190" y2="38"
          stroke="#1a0e00" strokeWidth="3" strokeLinecap="round" />

        {/* ── SOCKET CAP ── */}
        <ellipse cx="190" cy="38" rx="26" ry="10" fill="url(#ep-socket)" />
        <rect x="164" y="38" width="52" height="54" rx="3" fill="url(#ep-socket)" />
        <ellipse cx="190" cy="92" rx="26" ry="9" fill="#111" />

        {/* ── SCREW COLLAR ── */}
        {([100, 108, 116, 123] as number[]).map((y) => (
          <g key={y}>
            <line x1="164" y1={y} x2="216" y2={y} stroke="#2a2a2a" strokeWidth="6" />
            <line x1="164" y1={y - 1} x2="216" y2={y - 1} stroke="#444" strokeWidth="1" opacity="0.5" />
          </g>
        ))}

        {/* ── AMBIENT WARMTH BEHIND GLOBE ── */}
        <ellipse cx="190" cy="300" rx="110" ry="120"
          fill="#FFAA00" opacity="0.14" filter="url(#ep-heavy)" />

        {/* ── GLASS GLOBE — fills ── */}
        <path d={GLOBE} fill="url(#ep-glow)" />
        <path d={GLOBE} fill="url(#ep-glassfill)" />

        {/* ── GLASS RIM ── */}
        <path d={GLOBE} stroke="#000" strokeWidth="3" strokeOpacity="0.05" />

        {/* ── GLASS SPECULAR HIGHLIGHTS — clipped inside globe ── */}
        <g clipPath="url(#ep-clip)">
          <path d="M 78,165 Q 108,118 162,108"
            stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.40" />
          <path d="M 62,218 Q 74,188 96,174"
            stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.22" />
          <circle cx="90" cy="152" r="5" fill="white" opacity="0.2" />
          <path d="M 78,165 Q 108,118 162,108"
            stroke="white" strokeWidth="14" strokeLinecap="round" opacity="0.07"
            filter="url(#ep-soft)" />
        </g>

        {/* ── FILAMENT SUPPORT WIRES ── */}
        <line x1="145" y1="132" x2="145" y2="192" stroke="#555" strokeWidth="1.2" opacity="0.5" />
        <line x1="235" y1="132" x2="235" y2="192" stroke="#555" strokeWidth="1.2" opacity="0.5" />
        <line x1="145" y1="132" x2="235" y2="132" stroke="#444" strokeWidth="1"   opacity="0.4" />
        <line x1="145" y1="366" x2="235" y2="366" stroke="#444" strokeWidth="1"   opacity="0.35" />

        {/* ── SPIRAL FILAMENT — 4 glow layers ── */}
        <motion.path d={SPIRAL} stroke="#FF5500" strokeWidth="38"
          strokeLinecap="round" fill="none" opacity="0.18" filter="url(#ep-heavy)"
          animate={{ opacity: [0.18, 0.10, 0.20, 0.14, 0.18] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path d={SPIRAL} stroke="#FFAA00" strokeWidth="14"
          strokeLinecap="round" fill="none" opacity="0.52" filter="url(#ep-mid)"
          animate={{ opacity: [0.52, 0.34, 0.56, 0.40, 0.52] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path d={SPIRAL} stroke="#FFD566" strokeWidth="5.5"
          strokeLinecap="round" fill="none" opacity="0.78" filter="url(#ep-soft)"
          animate={{ opacity: [0.78, 0.55, 0.82, 0.62, 0.78] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path d={SPIRAL} stroke="#FFFCE8" strokeWidth="1.8"
          strokeLinecap="round" fill="none"
          animate={{ opacity: [1, 0.68, 1, 0.78, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
}

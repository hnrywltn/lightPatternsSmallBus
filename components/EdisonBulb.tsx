"use client";

import { motion } from "framer-motion";

const SPIRAL = `
  M 145,168
  C 145,176 235,174 235,182
  C 235,190 145,188 145,197
  C 145,205 235,203 235,211
  C 235,219 145,217 145,226
  C 145,234 235,232 235,240
  C 235,248 145,246 145,255
  C 145,263 235,261 235,269
  C 235,277 145,275 145,284
  C 145,292 235,290 235,298
  C 235,306 145,304 145,313
  C 145,321 235,319 235,327
  C 235,335 145,333 145,342
`.trim();

// Globe center & radius — used in both clipPath and arc math
const CX = 190, CY = 270, R = 158;

export default function EdisonBulb({ className }: { className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 380 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Clip everything to the globe circle */}
          <clipPath id="ep-clip">
            <circle cx={CX} cy={CY} r={R} />
          </clipPath>

          {/* Glow filters */}
          <filter id="ep-heavy" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="20" />
          </filter>
          <filter id="ep-mid" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="ep-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <filter id="ep-rim" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>

          {/* Warm interior glow */}
          <radialGradient id="ep-glow" cx="50%" cy="58%" r="46%">
            <stop offset="0%"   stopColor="#FFF8D6" stopOpacity="0.6"  />
            <stop offset="28%"  stopColor="#FFD060" stopOpacity="0.3"  />
            <stop offset="60%"  stopColor="#FF8800" stopOpacity="0.1"  />
            <stop offset="100%" stopColor="#FF5500" stopOpacity="0"    />
          </radialGradient>

          {/* Glass body — barely-there warm tint */}
          <radialGradient id="ep-glassfill" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFF9EE" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#FFE0A0" stopOpacity="0.02" />
          </radialGradient>

          {/* Socket gradient */}
          <linearGradient id="ep-socket" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#0a0a0a" />
            <stop offset="40%"  stopColor="#282828" />
            <stop offset="70%"  stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#070707" />
          </linearGradient>

          {/* Non-uniform rim gradient — bright upper-left, fades clockwise */}
          <linearGradient id="ep-rim" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.9"  />
            <stop offset="40%"  stopColor="#fff4d0" stopOpacity="0.65" />
            <stop offset="75%"  stopColor="#e8c060" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c09040" stopOpacity="0.2"  />
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
        <ellipse cx="190" cy="290" rx="105" ry="115"
          fill="#FFAA00" opacity="0.14" filter="url(#ep-heavy)" />

        {/* ── GLASS GLOBE — fills ── */}
        <circle cx={CX} cy={CY} r={R} fill="url(#ep-glow)" />
        <circle cx={CX} cy={CY} r={R} fill="url(#ep-glassfill)" />

        {/* ── GLASS RIM — non-uniform, gradient stroke, blurred ── */}
        {/* Replaces the old uniform gray circle. Stroke painted with gradient
            so it's bright upper-left, nearly invisible lower-right. */}
        <circle
          cx={CX} cy={CY} r={R}
          stroke="url(#ep-rim)" strokeWidth="7"
          filter="url(#ep-rim)"
        />

        {/* ── GLASS SPECULAR HIGHLIGHTS — clipped inside globe ── */}
        <g clipPath="url(#ep-clip)">
          {/* Primary arc — upper left, inside glass */}
          <path
            d="M 75,145 Q 105,100 158,90"
            stroke="white" strokeWidth="5"
            strokeLinecap="round" opacity="0.40"
          />
          {/* Secondary arc */}
          <path
            d="M 60,198 Q 72,168 94,154"
            stroke="white" strokeWidth="2.5"
            strokeLinecap="round" opacity="0.22"
          />
          {/* Glint dot */}
          <circle cx="88" cy="132" r="5" fill="white" opacity="0.2" />
          {/* Soft inner bloom on highlight */}
          <path
            d="M 75,145 Q 105,100 158,90"
            stroke="white" strokeWidth="14"
            strokeLinecap="round" opacity="0.07"
            filter="url(#ep-soft)"
          />
        </g>

        {/* ── FILAMENT SUPPORT WIRES ── */}
        <line x1="145" y1="130" x2="145" y2="168" stroke="#555" strokeWidth="1.2" opacity="0.5" />
        <line x1="235" y1="130" x2="235" y2="168" stroke="#555" strokeWidth="1.2" opacity="0.5" />
        <line x1="145" y1="130" x2="235" y2="130" stroke="#444" strokeWidth="1"   opacity="0.4" />
        <line x1="145" y1="342" x2="235" y2="342" stroke="#444" strokeWidth="1"   opacity="0.35" />

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

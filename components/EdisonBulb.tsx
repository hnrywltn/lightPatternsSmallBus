"use client";

import { motion } from "framer-motion";

export default function EdisonBulb({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 280 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
    >
      <defs>
        {/* Inner glow gradient */}
        <radialGradient id="bulbGlow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#FFF8E1" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#FFD54F" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FF8F00" stopOpacity="0.1" />
        </radialGradient>

        {/* Glass gradient */}
        <linearGradient id="glassSheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF9C4" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#FFD54F" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FF8F00" stopOpacity="0.3" />
        </linearGradient>

        {/* Base metal gradient */}
        <linearGradient id="baseMetal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B6914" />
          <stop offset="30%" stopColor="#D4A017" />
          <stop offset="60%" stopColor="#8B6914" />
          <stop offset="100%" stopColor="#6B4F0F" />
        </linearGradient>

        {/* Collar gradient */}
        <linearGradient id="collarMetal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6B4F0F" />
          <stop offset="40%" stopColor="#C8960C" />
          <stop offset="70%" stopColor="#8B6914" />
          <stop offset="100%" stopColor="#5A3F0A" />
        </linearGradient>

        {/* Filament glow filter */}
        <filter id="filamentGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Soft outer glow on whole bulb */}
        <filter id="bulbOuter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer ambient glow behind bulb */}
      <ellipse cx="140" cy="155" rx="110" ry="115" fill="#FFD54F" opacity="0.2" />

      {/* === GLASS BULB === */}
      {/* Main glass shape (pear/A19 form) */}
      <path
        d="M 88, 262
           C 42, 248  14, 212  14, 158
           C 14, 72   70, 18  140, 18
           C 210, 18  266, 72  266, 158
           C 266, 212  238, 248  192, 262
           L 185, 272
           C 185, 278  170, 282  140, 282
           C 110, 282  95, 278  95, 272
           Z"
        fill="url(#bulbGlow)"
        stroke="#B8860B"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Inner glow fill */}
      <path
        d="M 92, 258
           C 48, 244  18, 210  18, 158
           C 18, 76   72, 24  140, 24
           C 208, 24  262, 76  262, 158
           C 262, 210  232, 244  188, 258
           L 182, 268
           C 182, 273  165, 277  140, 277
           C 115, 277  98, 273  98, 268
           Z"
        fill="url(#glassSheen)"
      />

      {/* Glass highlight — left side sheen */}
      <path
        d="M 60, 80 C 40, 110  32, 145  40, 180"
        stroke="#FFFDE7"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M 75, 50 C 55, 70  45, 95  50, 120"
        stroke="#FFFDE7"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* === FILAMENT SUPPORT WIRES === */}
      {/* Left wire from base up to filament */}
      <line x1="108" y1="270" x2="108" y2="210" stroke="#B8860B" strokeWidth="1.5" />
      {/* Right wire */}
      <line x1="172" y1="270" x2="172" y2="210" stroke="#B8860B" strokeWidth="1.5" />
      {/* Cross support */}
      <line x1="108" y1="245" x2="172" y2="245" stroke="#B8860B" strokeWidth="1" opacity="0.6" />
      {/* Short support nubs */}
      <line x1="125" y1="245" x2="125" y2="215" stroke="#B8860B" strokeWidth="1" opacity="0.5" />
      <line x1="155" y1="245" x2="155" y2="215" stroke="#B8860B" strokeWidth="1" opacity="0.5" />

      {/* === FILAMENT === */}
      {/* Glow halo under filament */}
      <path
        d="M 100, 200
           L 115, 148
           L 130, 188
           L 140, 138
           L 150, 188
           L 165, 148
           L 180, 200"
        stroke="#FFD54F"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
        filter="url(#filamentGlow)"
      />
      {/* Filament itself */}
      <motion.path
        d="M 100, 200
           L 115, 148
           L 130, 188
           L 140, 138
           L 150, 188
           L 165, 148
           L 180, 200"
        stroke="#FF8C00"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        animate={{ opacity: [1, 0.75, 1, 0.85, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Bright core of filament */}
      <motion.path
        d="M 100, 200
           L 115, 148
           L 130, 188
           L 140, 138
           L 150, 188
           L 165, 148
           L 180, 200"
        stroke="#FFFDE7"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        animate={{ opacity: [0.9, 0.5, 0.9, 0.65, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* === COLLAR / NECK === */}
      <path
        d="M 95, 272
           L 88, 295
           L 192, 295
           L 185, 272
           C 185, 278  170, 282  140, 282
           C 110, 282  95, 278  95, 272
           Z"
        fill="url(#collarMetal)"
      />
      {/* Collar highlight line */}
      <line x1="95" y1="280" x2="185" y2="280" stroke="#E8B400" strokeWidth="0.75" opacity="0.5" />

      {/* === SCREW BASE === */}
      {/* Main base body */}
      <path
        d="M 88, 295  L 84, 400  Q 140, 412  196, 400  L 192, 295  Z"
        fill="url(#baseMetal)"
      />

      {/* Screw thread lines */}
      {[305, 318, 331, 344, 357, 370, 383, 396].map((y, i) => (
        <line
          key={i}
          x1={86 - i * 0.3}
          y1={y}
          x2={194 + i * 0.3}
          y2={y}
          stroke="#6B4F0F"
          strokeWidth="1"
          opacity="0.6"
        />
      ))}

      {/* Thread highlight */}
      {[305, 318, 331, 344, 357, 370, 383, 396].map((y, i) => (
        <line
          key={i}
          x1={87 - i * 0.3}
          y1={y - 1}
          x2={193 + i * 0.3}
          y2={y - 1}
          stroke="#D4A017"
          strokeWidth="0.5"
          opacity="0.4"
        />
      ))}

      {/* Base cap (bottom of bulb) */}
      <ellipse cx="140" cy="406" rx="56" ry="10" fill="#5A3F0A" />
      <ellipse cx="140" cy="403" rx="56" ry="9" fill="#8B6914" />

      {/* Contact point at very bottom */}
      <ellipse cx="140" cy="406" rx="18" ry="6" fill="#C8960C" />
      <ellipse cx="140" cy="404" rx="18" ry="5" fill="#E8C547" />
    </motion.svg>
  );
}

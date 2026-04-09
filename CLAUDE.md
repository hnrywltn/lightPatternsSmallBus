# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build
npm run lint       # ESLint
npx tsc --noEmit   # Type-check without building
```

## Project

**Light Patterns** — a marketing/agency site that sells website-building services to small businesses, with a subscription model for ongoing maintenance.

Stack: **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion**

## Architecture

Single-page layout with section-based routing via anchor links (`#pricing`, `#how-it-works`, etc.).

```
app/
  layout.tsx      # Root layout — fonts, metadata, dark background
  page.tsx        # Composes all sections in order
  globals.css     # Tailwind import, custom scrollbar, base vars

components/
  Navbar.tsx      # Fixed top nav, scroll-aware blur, mobile menu
  Hero.tsx        # Full-screen hero with glow orbs, staggered fadeUp
  HowItWorks.tsx  # 4-step process grid
  Portfolio.tsx   # 6-card mock project showcase
  Pricing.tsx     # 3-tier pricing (Starter / Growth / Pro) with build fee + subscription
  FAQ.tsx         # Accordion, animated open/close
  CTA.tsx         # Bottom call-to-action banner
  Footer.tsx      # Simple footer with nav links
```

## Key Patterns

**Animations:** All scroll-triggered animations use Framer Motion's `whileInView` + `viewport={{ once: true }}`. Staggered lists use a `custom` prop with a variant function `(i: number) => ({ ... delay: i * 0.1 })`. Ease arrays must be cast as tuples: `[0.25, 0.4, 0.25, 1] as [number, number, number, number]`.

**Color system:** Dark background `#05050a`, primary accent `violet-600`, text hierarchy via `text-white`, `text-white/60`, `text-white/40`, `text-white/30`.

**Tailwind v4:** This project uses Tailwind v4 with `@import "tailwindcss"` in globals.css (not `@tailwind` directives). Theme tokens are defined inside `@theme inline {}`.

**"use client":** All components with animations, state, or event handlers need this directive. `Footer` is the only purely server component.

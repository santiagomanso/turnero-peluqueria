# Home Desktop Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the home page on desktop with a full-screen parallax scroll experience while keeping the existing mobile layout 100% unchanged.

**Architecture:** `page.tsx` renders two parallel trees gated by `hidden lg:block` / `lg:hidden`. The desktop tree is a `"use client"` component composed of a splash section (animated rings + logo), a sticky navbar, and four full-viewport parallax sections (one per action link). No server actions or data fetching needed — pure presentation.

**Tech Stack:** Next.js App Router, React 19, TypeScript strict, TailwindCSS v4, Framer Motion 12, `next/image` for logo

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/app/_components/home-desktop/splash.tsx` | Animated rings + logo + title + scroll indicator |
| Create | `src/app/_components/home-desktop/sticky-nav.tsx` | Fixed navbar that appears after splash leaves viewport |
| Create | `src/app/_components/home-desktop/parallax-section.tsx` | Reusable full-viewport section with scroll-reveal content |
| Create | `src/app/_components/home-desktop/index.tsx` | Composes splash + nav + 4 sections |
| Modify | `src/app/page.tsx` | Gate desktop vs mobile with `hidden lg:block` / `lg:hidden` |
| Modify | `src/app/globals.css` | Add `@keyframes` for ring animations |

---

## Task 1 — Ring keyframes in globals.css

Add the CSS animations for the splash rings. These are looping continuous rotations that can't be done cleanly with Framer Motion alone.

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add keyframes** at the end of `globals.css`, inside `@layer utilities`:

```css
@layer utilities {
  /* ...existing utilities... */

  @keyframes ring-rotate-cw {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes ring-rotate-ccw {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }
  @keyframes ring-expand {
    0%   { opacity: 0; width: 60px; height: 60px; }
    15%  { opacity: 1; }
    100% { opacity: 0.22; width: min(70vw, 520px); height: min(70vw, 520px); }
  }
  @keyframes ring-expand-outer {
    0%   { opacity: 0; width: 60px; height: 60px; }
    15%  { opacity: 0.55; }
    100% { opacity: 0.1; width: min(90vw, 700px); height: min(90vw, 700px); }
  }
  @keyframes scroll-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.25; }
  }
}
```

- [ ] **Step 2: Verify** — run `pnpm dev`, open `/`, no visual breakage on mobile.

---

## Task 2 — SplashSection component

**Files:**
- Create: `src/app/_components/home-desktop/splash.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function SplashSection() {
  return (
    <section className="relative h-svh bg-surface flex flex-col items-center justify-center overflow-hidden">

      {/* Animated rings — CSS keyframes, positioned absolute centered */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer dashed ring */}
        <span
          className="absolute rounded-full border border-dashed border-gold/30"
          style={{
            animation:
              "ring-expand-outer 2.4s cubic-bezier(0.16,1,0.3,1) 0.1s forwards, ring-rotate-ccw 12s linear infinite",
            width: 60,
            height: 60,
          }}
        />
        {/* Inner solid ring */}
        <span
          className="absolute rounded-full border border-gold/60"
          style={{
            animation:
              "ring-expand 2.2s cubic-bezier(0.16,1,0.3,1) forwards, ring-rotate-cw 8s linear infinite",
            width: 60,
            height: 60,
          }}
        />
      </div>

      {/* Content — fades in after rings start */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-2 text-center"
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
      >
        <Image
          src="/logo.png"
          alt="Luckete Colorista"
          width={44}
          height={44}
          className="mb-2 object-contain dark:brightness-0 dark:invert"
          priority
        />
        <h1 className="font-heebo font-light text-4xl lg:text-5xl tracking-[0.06em] text-content dark:text-zinc-100">
          Luckete Colorista
        </h1>
        <p className="font-archivo text-[9.5px] tracking-[0.24em] uppercase text-gold mt-1">
          Donde el color se vuelve arte
        </p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        onClick={() => {
          document.getElementById("section-01")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span className="font-archivo text-[8.5px] tracking-[0.22em] uppercase text-content-quaternary dark:text-zinc-600">
          Scroll
        </span>
        <span
          className="w-px h-9 bg-linear-to-b from-gold to-transparent"
          style={{ animation: "scroll-pulse 2s ease 2.2s infinite" }}
        />
      </motion.div>

    </section>
  );
}
```

- [ ] **Step 2: Verify** — `pnpm dev`, visit `/` on desktop (≥1024px), confirm: rings animate and expand, logo + title fade in, scroll indicator pulses.

---

## Task 3 — StickyNav component

Appears after the splash section scrolls out of view.

**Files:**
- Create: `src/app/_components/home-desktop/sticky-nav.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  { label: "Agendar turno", href: "/appointments/new" },
  { label: "Consultar turno", href: "/appointments/get" },
  { label: "Tienda", href: "/shop" },
  { label: "WhatsApp", href: "https://wa.me/+5493794619887", external: true },
] as const;

export function StickyNav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.85);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-border-subtle dark:border-zinc-800"
          style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Blurred bg layer (Tailwind can't do bg-surface/85 with backdrop without a wrapper) */}
          <div className="absolute inset-0 bg-surface/85 dark:bg-zinc-950/85 -z-10" />

          <span className="font-heebo font-light text-sm tracking-[0.06em] text-content dark:text-zinc-100">
            Luckete Colorista
          </span>

          <div className="flex items-center gap-1">
            {LINKS.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg text-xs font-medium text-content-secondary dark:text-zinc-400 hover:bg-gold/10 hover:text-gold transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-content-secondary dark:text-zinc-400 hover:bg-gold/10 hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verify** — scroll past the splash, nav slides in. Scroll back to top, nav disappears.

---

## Task 4 — ParallaxSection component

Reusable full-viewport section with: decorative number (parallax), counter label, clip-reveal title, expanding divider, fading description, and CTA button.

**Files:**
- Create: `src/app/_components/home-desktop/parallax-section.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  counter: string;          // "01 — 04"
  titleLine1: string;
  titleLine2: string;
  accentLine?: 1 | 2;       // which line gets gold color
  description: string;
  ctaLabel: string;
  ctaHref: string;
  ctaVariant: "gold" | "outline" | "whatsapp";
  dark?: boolean;
  external?: boolean;
  decoNumber: string;       // "01", "02", etc.
};

const titleVariants = {
  hidden: { y: "105%" },
  visible: (delay: number) => ({
    y: "0%",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

export function ParallaxSection({
  id, counter, titleLine1, titleLine2, accentLine = 2,
  description, ctaLabel, ctaHref, ctaVariant, dark = false,
  external = false, decoNumber,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const decoY = useTransform(scrollYProgress, [0, 1], ["0px", "80px"]);

  const bgClass = dark
    ? "bg-[#1a1714]"
    : id === "section-02"
    ? "bg-[#e5e1db]"
    : "bg-surface";

  const ctaClass = cn(
    "inline-flex items-center gap-2 px-9 py-4 rounded-xl text-sm font-semibold transition-all",
    {
      "bg-gold text-content hover:shadow-[0_8px_32px_rgba(201,169,110,0.45)] hover:scale-[1.04]":
        ctaVariant === "gold",
      "border border-content/20 dark:border-zinc-700 text-content dark:text-zinc-100 hover:border-content/50 hover:bg-black/[0.03]":
        ctaVariant === "outline",
      "bg-[#25D366] text-white hover:shadow-[0_8px_28px_rgba(37,211,102,0.4)] hover:scale-[1.04]":
        ctaVariant === "whatsapp",
    }
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn("relative h-svh flex items-center justify-center overflow-hidden", bgClass)}
    >
      {/* Parallax decorative number */}
      <motion.span
        style={{ y: decoY }}
        className={cn(
          "absolute pointer-events-none select-none font-heebo font-black text-[32vw] leading-none bottom-[-4vw] right-[-2vw] tracking-tighter",
          dark ? "text-white/[0.025]" : "text-gold/[0.055]"
        )}
        aria-hidden
      >
        {decoNumber}
      </motion.span>

      {/* Main content */}
      <div className="relative z-10 max-w-[680px] w-[90%] text-center mx-auto">

        {/* Counter */}
        <motion.span
          className={cn(
            "block text-[9px] tracking-[0.22em] uppercase mb-6",
            dark ? "text-white/30" : "text-content-quaternary"
          )}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          {counter}
        </motion.span>

        {/* Title — clip reveal */}
        <h2 className={cn(
          "font-heebo font-light leading-[1.05] tracking-[0.03em] mb-0",
          "text-[clamp(2.8rem,7vw,5rem)]",
          dark ? "text-white" : "text-content dark:text-zinc-100"
        )}>
          <span className="block overflow-hidden">
            <motion.span
              className={cn("block", accentLine === 1 && "text-gold")}
              variants={titleVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0}
            >
              {titleLine1}
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className={cn("block", accentLine === 2 && "text-gold")}
              variants={titleVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0.08}
            >
              {titleLine2}
            </motion.span>
          </span>
        </h2>

        {/* Expanding divider */}
        <motion.div
          className="h-px bg-linear-to-r from-transparent via-gold to-transparent mx-auto mt-7 mb-7"
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />

        {/* Description */}
        <motion.p
          className={cn(
            "text-sm leading-[1.85] max-w-[400px] mx-auto mb-9",
            dark ? "text-white/38" : "text-content-secondary dark:text-zinc-400"
          )}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        >
          {description}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.55 }}
        >
          {external ? (
            <a href={ctaHref} target="_blank" rel="noreferrer" className={ctaClass}>
              {ctaLabel}
            </a>
          ) : (
            <Link href={ctaHref} className={ctaClass}>
              {ctaLabel}
            </Link>
          )}
        </motion.div>

      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify** — `pnpm dev`, reload. No TS errors in the new file.

---

## Task 5 — HomeDesktop index (compose all parts)

**Files:**
- Create: `src/app/_components/home-desktop/index.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { SplashSection } from "./splash";
import { StickyNav } from "./sticky-nav";
import { ParallaxSection } from "./parallax-section";

export function HomeDesktop() {
  return (
    <div className="w-full">
      <StickyNav />
      <SplashSection />

      <ParallaxSection
        id="section-01"
        counter="01 — 04"
        decoNumber="01"
        titleLine1="Agendá tu"
        titleLine2="próximo turno"
        accentLine={2}
        description="Reservá online en segundos. Elegí día, hora y servicio — sin llamadas, sin esperas."
        ctaLabel="Agendar turno →"
        ctaHref="/appointments/new"
        ctaVariant="gold"
      />

      <ParallaxSection
        id="section-02"
        counter="02 — 04"
        decoNumber="02"
        titleLine1="Consultá"
        titleLine2="tu reserva"
        accentLine={2}
        description="¿Ya tenés turno? Revisá fecha, hora y estado de tu reserva en cualquier momento."
        ctaLabel="Ver mi turno →"
        ctaHref="/appointments/get"
        ctaVariant="outline"
      />

      <ParallaxSection
        id="section-03"
        counter="03 — 04"
        decoNumber="03"
        titleLine1="Tienda de"
        titleLine2="insumos"
        accentLine={2}
        description="Productos profesionales para el cuidado del cabello. Envío a toda la provincia."
        ctaLabel="Ver productos →"
        ctaHref="/shop"
        ctaVariant="outline"
      />

      <ParallaxSection
        id="section-04"
        counter="04 — 04"
        decoNumber="04"
        titleLine1="Hablá con"
        titleLine2="nosotros"
        accentLine={2}
        description="Precios, disponibilidad, dudas. Escribinos por WhatsApp y respondemos rápido."
        ctaLabel="Escribir por WhatsApp →"
        ctaHref="https://wa.me/+5493794619887"
        ctaVariant="whatsapp"
        dark
        external
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify** — `pnpm dev`, no TypeScript errors.

---

## Task 6 — Wire into page.tsx

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update page.tsx**

```tsx
import dynamic from "next/dynamic";
import Header from "@/components/header";
import HomeLink from "@/components/home-link";
import Navbar from "@/components/navbar";
import { Container } from "@/components/ui/container";
import { Plus, SquarePen, ShoppingCart, Phone } from "lucide-react";

// Lazy-load the desktop component to avoid SSR issues with scroll listeners
const HomeDesktop = dynamic(
  () => import("./_components/home-desktop").then((m) => m.HomeDesktop),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      {/* ── Desktop (≥ lg) ── */}
      <div className="hidden lg:block">
        <HomeDesktop />
      </div>

      {/* ── Mobile (< lg) — unchanged ── */}
      <div className="lg:hidden">
        <Container.wrapper>
          <Container.content>
            <Navbar title="Inicio" />
            <div className="space-y-5">
              <Header />
              <ul className="space-y-4">
                <HomeLink path="/appointments/new" label="Agendar turno" icon={Plus} />
                <HomeLink path="/appointments/get" label="Consultar mi turno" icon={SquarePen} />
                <HomeLink path="/shop" label="Tienda online insumos" icon={ShoppingCart} />
                <HomeLink path="/whatsapp" label="WhatsApp consultas" icon={Phone} type="external-link" />
              </ul>
            </div>
          </Container.content>
        </Container.wrapper>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify desktop** — open `localhost:3000` at ≥1024px wide:
  - Splash: rings expand, logo + title fade in, scroll indicator visible
  - Scroll down: sticky nav slides in with links
  - Each section: title clips up from bottom, divider expands, description and button fade in
  - Section 04 has dark background
  - Deco numbers (`01`–`04`) move at different speed than content (parallax)

- [ ] **Step 3: Verify mobile** — DevTools → iPhone SE (375px):
  - Original layout unchanged: navbar, header, 4 HomeLink items

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/app/_components/home-desktop/ src/app/globals.css
git commit -m "feat(home): parallax desktop redesign with animated splash"
```

---

## Known Constraints

- `bg-surface/85` requires Tailwind to know about `--color-surface`. Since it's defined in `globals.css` via `@theme inline`, the `/85` opacity modifier works automatically in TailwindCSS v4.
- The `"use client"` directive goes on each sub-component individually (`splash.tsx`, `sticky-nav.tsx`, `parallax-section.tsx`) — `index.tsx` does NOT need it since it's just re-exporting server-compatible JSX.
- `dynamic(..., { ssr: false })` on `HomeDesktop` prevents hydration mismatches from `window.scrollY` in `StickyNav`.
- Description uses `text-sm` (0.875rem) per CLAUDE.md rules — no arbitrary values.

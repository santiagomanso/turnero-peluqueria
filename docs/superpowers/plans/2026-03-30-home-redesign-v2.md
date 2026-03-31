# Home Redesign v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix homescreen colors, unify mobile/desktop to one full-screen parallax flow, add a persistent navbar with hamburger on mobile, and extend theme to 3 states (system/light/dark).

**Architecture:** Extend the existing cookie-based `PublicThemeProvider` (already handles flash-free SSR theming) to support 3 states. Add dark CSS tokens to `globals.css`. Create a new `home-screen/` folder replacing `home-desktop/`. A single persistent `HomeNavbar` replaces the scroll-triggered `StickyNav`.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript strict, TailwindCSS v4, Framer Motion, lucide-react, existing `PublicThemeProvider` + cookie infrastructure.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/app/globals.css` | Modify | Change `@theme inline` → `@theme`; add dark warm-palette tokens to `.dark {}` |
| `src/app/admin/_actions/set-theme-cookie.ts` | Modify | Accept `"system"` as a valid theme value |
| `src/components/public-theme-provider.tsx` | Modify | 3-state theme (`system`/`light`/`dark`), live matchMedia listener |
| `src/app/layout.tsx` | Modify | Pass `theme` cookie value to provider; handle `"system"` |
| `src/components/theme-toggle.tsx` | Create | 3-button toggle UI (Monitor/Sun/Moon icons) |
| `src/app/_components/home-screen/home-navbar.tsx` | Create | Persistent navbar: transparent on splash, solid on scroll, hamburger on mobile |
| `src/app/_components/home-screen/index.tsx` | Create | `HomeScreen` — replaces `HomeDesktop` |
| `src/app/_components/home-screen/splash.tsx` | Create | Splash section with `pt-14` for navbar clearance |
| `src/app/_components/home-screen/parallax-section.tsx` | Create | Parallax section with `scroll-mt-14`; section-02 dark bg fix |
| `src/app/page.tsx` | Modify | Remove mobile/desktop split; render `<HomeScreen />` |
| `src/app/_components/home-desktop/` | Delete | Entire folder — replaced by `home-screen/` |
| `src/app/_components/home-desktop-wrapper.tsx` | Delete | No longer needed |

---

## Task 1: Fix dark palette in globals.css

**Files:**
- Modify: `src/app/globals.css`

**Root cause:** `globals.css` uses `@theme inline { ... }`. With `inline`, Tailwind compiles utility classes with literal hex values — e.g. `bg-surface` becomes `background-color: #ece9e4` at build time, NOT `background-color: var(--color-surface)`. This means CSS variable overrides in `.dark {}` have no effect on those utilities.

**Fix (two steps):**
1. Change `@theme inline` → `@theme` so utilities use `var(--color-surface)` at runtime
2. Add dark token overrides in `.dark {}` so those vars resolve to dark values

- [ ] **Step 1: Change `@theme inline {` to `@theme {` on line 6 of `src/app/globals.css`**

Before:
```css
@theme inline {
```
After:
```css
@theme {
```

- [ ] **Step 2: Add the warm-dark overrides at the END of the `.dark {}` block (after line ~173, before the closing `}`):**

```css
  /* Custom warm-dark palette — fixes BG + text colors in dark mode */
  --color-base:               #1e1c19;
  --color-surface:            #141210;
  --color-content:            #f0ece6;
  --color-content-secondary:  #9c9189;
  --color-content-tertiary:   #6b6560;
  --color-content-quaternary: #4a4440;
  --color-border-subtle:      oklch(1 0 0 / 7%);
  --color-border-soft:        oklch(1 0 0 / 10%);
```

- [ ] **Step 3: Verify build passes**

```bash
cd /Users/devsanti/Documents/projects/turnero-peluqueria
pnpm build 2>&1 | tail -20
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "fix(theme): add warm-dark palette tokens to .dark {}"
```

---

## Task 2: Extend theme system to 3 states

**Files:**
- Modify: `src/app/admin/_actions/set-theme-cookie.ts`
- Modify: `src/components/public-theme-provider.tsx`
- Modify: `src/app/layout.tsx`

The existing system supports `"dark" | "light"`. We need to add `"system"`.

- [ ] **Step 1: Update `set-theme-cookie.ts` to accept `"system"`**

Replace the entire file content:

```typescript
"use server";

import { cookies } from "next/headers";

export async function setThemeCookie(theme: "dark" | "light" | "system") {
  const cookieStore = await cookies();
  cookieStore.set("admin-theme", theme, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}
```

- [ ] **Step 2: Replace `src/components/public-theme-provider.tsx` with 3-state version**

```typescript
"use client";

import { useState, createContext, useContext, useEffect } from "react";
import { setThemeCookie } from "@/app/admin/_actions/set-theme-cookie";

type ThemeMode = "system" | "light" | "dark";

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
  isDark: false,
});

export function useTheme() {
  return useContext(ThemeContext);
}

function applyDark(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

function systemIsDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function PublicThemeProvider({
  defaultTheme,
  children,
}: {
  defaultTheme: ThemeMode;
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);

  // Resolve whether dark is active given current theme mode
  const resolveIsDark = (t: ThemeMode): boolean => {
    if (t === "dark") return true;
    if (t === "light") return false;
    return systemIsDark();
  };

  const [isDark, setIsDark] = useState(() => resolveIsDark(defaultTheme));

  // On mount: if system mode, sync with actual OS preference
  useEffect(() => {
    if (theme === "system") {
      const dark = systemIsDark();
      setIsDark(dark);
      applyDark(dark);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Live matchMedia listener — only active in "system" mode
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      applyDark(e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    const dark = resolveIsDark(t);
    setIsDark(dark);
    applyDark(dark);
    setThemeCookie(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

- [ ] **Step 3: Update `src/app/layout.tsx` to pass `defaultTheme` instead of `defaultDark`/`hasCookie`**

Read the current `RootLayout` function in `layout.tsx`. Replace only the `RootLayout` function body:

```typescript
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("admin-theme");
  const themeValue = themeCookie?.value as "dark" | "light" | "system" | undefined;
  const validTheme: "dark" | "light" | "system" =
    themeValue === "dark" || themeValue === "light" || themeValue === "system"
      ? themeValue
      : "system";

  return (
    <html
      lang="es"
      className={`
        ${archivo.variable}
        ${archivoBlack.variable}
        ${dancingScript.variable}
        ${heebo.variable}
        ${spaceMono.variable}
        ${validTheme === "dark" ? "dark" : ""}
        antialiased
      `}
    >
      <body>
        <PublicThemeProvider defaultTheme={validTheme}>
          {children}
        </PublicThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify build passes**

```bash
pnpm build 2>&1 | tail -20
```
Expected: no TypeScript errors, no build errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/_actions/set-theme-cookie.ts src/components/public-theme-provider.tsx src/app/layout.tsx
git commit -m "feat(theme): extend PublicThemeProvider to 3-state system/light/dark"
```

---

## Task 3: ThemeToggle component

**Files:**
- Create: `src/components/theme-toggle.tsx`

A 3-button toggle using the `useTheme()` hook. Used in both the desktop navbar and the mobile hamburger menu.

- [ ] **Step 1: Create `src/components/theme-toggle.tsx`**

```typescript
"use client";

import { Monitor, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/public-theme-provider";
import { cn } from "@/lib/utils";

type ThemeMode = "system" | "light" | "dark";

const OPTIONS: { value: ThemeMode; icon: React.ElementType; label: string }[] = [
  { value: "system", icon: Monitor, label: "Sistema" },
  { value: "light",  icon: Sun,     label: "Claro" },
  { value: "dark",   icon: Moon,    label: "Oscuro" },
];

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-lg p-0.5 bg-black/5 dark:bg-white/8",
        className
      )}
    >
      {OPTIONS.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          aria-label={label}
          onClick={() => setTheme(value)}
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-md transition-all",
            theme === value
              ? "bg-white dark:bg-zinc-800 text-gold shadow-sm"
              : "text-content-tertiary dark:text-zinc-500 hover:text-content dark:hover:text-zinc-300"
          )}
        >
          <Icon size={13} strokeWidth={1.8} />
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify build passes**

```bash
pnpm build 2>&1 | tail -20
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/theme-toggle.tsx
git commit -m "feat(theme): add 3-state ThemeToggle component"
```

---

## Task 4: HomeNavbar — persistent navbar

**Files:**
- Create: `src/app/_components/home-screen/home-navbar.tsx`

Persistent fixed navbar. Always visible. Transparent on splash, solid after 60px scroll. Desktop: inline links + ThemeToggle. Mobile: logo + hamburger that opens a menu with links + ThemeToggle.

- [ ] **Step 1: Create the folder and file `src/app/_components/home-screen/home-navbar.tsx`**

```bash
mkdir -p /Users/devsanti/Documents/projects/turnero-peluqueria/src/app/_components/home-screen
```

- [ ] **Step 2: Write the component**

```typescript
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Agendar turno",   href: "/appointments/new",          external: false },
  { label: "Consultar turno", href: "/appointments/get",          external: false },
  { label: "Tienda",          href: "/shop",                       external: false },
  { label: "WhatsApp",        href: "https://wa.me/+5493794619887", external: true  },
] as const;

export function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route navigation
  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-5 lg:px-8 transition-all duration-300",
          scrolled
            ? "bg-surface/90 backdrop-blur-md border-b border-border-subtle dark:border-zinc-800"
            : "bg-transparent backdrop-blur-sm border-b border-transparent"
        )}
      >
        {/* Logo + Name */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/logo.png"
            alt="Luckete Colorista"
            width={28}
            height={28}
            className="object-contain dark:brightness-0 dark:invert"
            priority
          />
          <span className="font-heebo font-light text-sm tracking-[0.06em] text-content dark:text-zinc-100">
            Luckete Colorista
          </span>
        </Link>

        {/* Desktop links + toggle */}
        <div className="hidden lg:flex items-center gap-1 ml-auto">
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
          <div className="ml-3">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden ml-auto flex items-center justify-center w-9 h-9 rounded-lg text-content-secondary dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/8 transition-colors"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 dark:bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
            />
            {/* Panel */}
            <motion.div
              className="fixed top-14 left-0 right-0 z-40 lg:hidden bg-surface dark:bg-[#141210] border-b border-border-subtle dark:border-zinc-800 px-5 pb-6 pt-4"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <ul className="space-y-1 mb-5">
                {LINKS.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center px-3 py-3 rounded-xl text-sm font-medium text-content dark:text-zinc-100 hover:bg-gold/10 hover:text-gold transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="flex items-center px-3 py-3 rounded-xl text-sm font-medium text-content dark:text-zinc-100 hover:bg-gold/10 hover:text-gold transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              <div className="px-3">
                <p className="text-xs text-content-quaternary dark:text-zinc-600 mb-2 tracking-wide">Tema</p>
                <ThemeToggle />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 3: Verify build passes**

```bash
pnpm build 2>&1 | tail -20
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/_components/home-screen/home-navbar.tsx
git commit -m "feat(home): add persistent HomeNavbar with hamburger + ThemeToggle"
```

---

## Task 5: Create home-screen/ components

**Files:**
- Create: `src/app/_components/home-screen/splash.tsx`
- Create: `src/app/_components/home-screen/parallax-section.tsx`
- Create: `src/app/_components/home-screen/index.tsx`

Copy and update the 3 existing components from `home-desktop/`. Key changes:
- `splash.tsx`: add `pt-14` to the section so content clears the fixed navbar
- `parallax-section.tsx`: add `scroll-mt-14` to each section for correct anchor scroll; change section-02's bgClass fallback for dark mode
- `index.tsx`: rename export to `HomeScreen`, import from `home-screen/`, replace `StickyNav` with `HomeNavbar`

- [ ] **Step 1: Create `src/app/_components/home-screen/splash.tsx`**

```typescript
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function SplashSection() {
  return (
    <section className="relative h-svh bg-surface flex flex-col items-center justify-center overflow-hidden pt-14">

      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="absolute rounded-full border border-dashed border-gold/30"
          style={{
            animation:
              "ring-expand-outer 2.4s cubic-bezier(0.16,1,0.3,1) 0.1s forwards, ring-rotate-ccw 12s linear infinite",
            width: 60,
            height: 60,
          }}
        />
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

      {/* Content */}
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
        <p className="font-archivo text-micro tracking-[0.24em] uppercase text-gold mt-1">
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
        <span className="font-archivo text-nano tracking-[0.22em] uppercase text-content-quaternary dark:text-zinc-600">
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

- [ ] **Step 2: Create `src/app/_components/home-screen/parallax-section.tsx`**

```typescript
"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  counter: string;
  titleLine1: string;
  titleLine2: string;
  accentLine?: 1 | 2;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  ctaVariant: "gold" | "outline" | "whatsapp";
  dark?: boolean;
  external?: boolean;
  decoNumber: string;
  bgClass?: string;
};

const titleVariants = {
  hidden: { y: "105%" },
  visible: (delay: number) => ({
    y: "0%",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const, delay },
  }),
};

export function ParallaxSection({
  id, counter, titleLine1, titleLine2, accentLine = 2,
  description, ctaLabel, ctaHref, ctaVariant, dark = false,
  external = false, decoNumber, bgClass,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const decoY = useTransform(scrollYProgress, [0, 1], ["0px", "80px"]);

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
      className={cn(
        "relative h-svh flex items-center justify-center overflow-hidden scroll-mt-14",
        bgClass ?? "bg-surface"
      )}
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
            "block text-tiny tracking-[0.22em] uppercase mb-6",
            dark ? "text-white/30" : "text-content-quaternary dark:text-zinc-600"
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
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.3 }}
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

- [ ] **Step 3: Create `src/app/_components/home-screen/index.tsx`**

```typescript
import { SplashSection } from "./splash";
import { HomeNavbar } from "./home-navbar";
import { ParallaxSection } from "./parallax-section";

export function HomeScreen() {
  return (
    <div className="w-full">
      <HomeNavbar />
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
        bgClass="bg-[#e5e1db] dark:bg-[#1e1c19]"
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
        bgClass="bg-[#1a1714]"
        dark
        external
      />
    </div>
  );
}
```

**Note on section-02 `bgClass`:** the value `"bg-[#e5e1db] dark:bg-[#1e1c19]"` uses TWO Tailwind classes in one string. In TailwindCSS v4, this is fine as long as the `cn()` utility passes the string through — and it does since `cn` uses `clsx` + `twMerge`.

- [ ] **Step 4: Verify build passes**

```bash
pnpm build 2>&1 | tail -20
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/_components/home-screen/
git commit -m "feat(home): create home-screen components (HomeScreen, SplashSection, ParallaxSection, HomeNavbar)"
```

---

## Task 6: Update page.tsx and delete old files

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/app/_components/home-desktop/` (entire folder)
- Delete: `src/app/_components/home-desktop-wrapper.tsx`

- [ ] **Step 1: Replace `src/app/page.tsx` entirely**

```typescript
import { HomeScreen } from "./_components/home-screen";

export default function Home() {
  return <HomeScreen />;
}
```

- [ ] **Step 2: Delete the old home-desktop folder and wrapper**

```bash
rm -rf src/app/_components/home-desktop
rm src/app/_components/home-desktop-wrapper.tsx
```

- [ ] **Step 3: Verify build passes with no broken imports**

```bash
pnpm build 2>&1 | tail -30
```
Expected: no errors, no unresolved imports.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git add -u src/app/_components/home-desktop/ src/app/_components/home-desktop-wrapper.tsx
git commit -m "feat(home): unify home page — remove mobile/desktop split, use HomeScreen"
```

---

## Task 7: Manual QA checklist

No automated tests exist in this project. Verify visually in the browser with `pnpm dev`.

- [ ] **Start dev server**

```bash
pnpm dev
```

Open `http://localhost:3000`

- [ ] **Light mode checks**
  - [ ] Navbar visible immediately (not just after scroll)
  - [ ] Logo + "Luckete Colorista" text visible on splash
  - [ ] Subtitle "Donde el color se vuelve arte" in gold visible on beige background
  - [ ] Animated rings visible
  - [ ] "Scroll" indicator visible at bottom
  - [ ] Scrolling past 60px makes navbar background solid/blurred
  - [ ] Each section's title, counter, description and CTA button all readable
  - [ ] ThemeToggle visible in navbar (desktop) — 3 buttons: Monitor, Sun, Moon
  - [ ] Active theme button highlighted in gold

- [ ] **Dark mode checks (click Moon button)**
  - [ ] Navbar background dark (`#141210`)
  - [ ] Splash background dark
  - [ ] All text legible (warm light colors on dark bg)
  - [ ] Rings still visible (gold/30, gold/60)
  - [ ] Section-02 background changes to `#1e1c19` (not the light warm beige)
  - [ ] Section-04 (dark by design) still looks right
  - [ ] ThemeToggle Moon button highlighted

- [ ] **System mode (click Monitor button)**
  - [ ] Follows OS preference
  - [ ] If OS is dark → page is dark; if light → page is light

- [ ] **Mobile checks (resize to 375px)**
  - [ ] Navbar shows logo + hamburger only (no inline links)
  - [ ] Hamburger opens panel with 4 links + ThemeToggle
  - [ ] Tapping a link closes the menu and navigates
  - [ ] Splash full-screen, rings scale correctly
  - [ ] Each parallax section full-screen
  - [ ] Scroll-reveal animations trigger on scroll
  - [ ] ThemeToggle in hamburger menu works

- [ ] **Anchor navigation**
  - [ ] On desktop: clicking "Agendar turno" in navbar scrolls to section-01 correctly (not hidden behind navbar)
  - [ ] `scroll-mt-14` is doing its job

- [ ] **Theme persistence**
  - [ ] Set to Dark, refresh page → stays Dark (cookie persists)
  - [ ] Set to Light, refresh → stays Light
  - [ ] Set to System, refresh → follows OS

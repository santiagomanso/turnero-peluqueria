# Home Page Desktop Redesign

**Date:** 2026-03-23
**Status:** Approved

---

## Overview

Full redesign of the home page (`/`) to be visually impressive on desktop, while keeping the existing mobile layout unchanged. The new desktop experience is a full-page parallax scroll with a minimalist splash screen and animated section reveals.

---

## Design

### Splash Screen (100vh)
- Background: `bg-surface` (`#ece9e4`)
- Two concentric animated rings centered on screen:
  - Inner ring: thin solid `1px` border in gold (`rgba(201,169,110,0.7)`), starts small (~60px), expands to ~500px, rotates continuously
  - Outer ring: thin dashed gold, slightly larger, rotates in reverse
- Content fades in after rings start expanding (delay ~0.6s):
  - Logo (`/logo.png`) — `dark:brightness-0 dark:invert` — centered, ~44px
  - Title: `"Luckete Colorista"` in `font-heebo font-light text-4xl tracking-wide`
  - Tagline: `"DONDE EL COLOR SE VUELVE ARTE"` in `font-archivo text-gold text-[9.5px] tracking-[0.24em] uppercase`
- Scroll indicator at bottom: "SCROLL" label + animated gold line, fades in at 1.8s

### Sticky Navbar (appears after leaving splash)
- Fixed top, blurred background (`backdrop-blur`, `bg-surface/85`)
- Logo name left, nav links right (desktop only)
- Nav links: Agendar turno / Consultar turno / Tienda / WhatsApp
- On mobile: logo name only, no links
- Transition: `opacity` + `translateY(-8px)` → visible when splash leaves viewport

### Parallax Sections (4 × 100vh)
Each section is full viewport height. Sections alternate background: `#ece9e4` / `#e5e1db`. Section 4 is dark (`#1a1714`).

**Per-section layout** (centered, `max-width: 680px`):
1. Section counter label — `"01 — 04"` small uppercase tracking
2. Title — `font-heebo font-light` ~5rem, 2 lines, clip reveal (slides up from `translateY(100%)`)
3. Thin gold divider line — expands from 0 to 80px on reveal
4. Description — body text, fades + slides up
5. CTA button — fades + scales up last

**Scroll reveal timing** (staggered, triggered by IntersectionObserver at 25% visibility):
- Title lines: `0s`, `0.08s` delay
- Divider: `0.3s`
- Description: `0.4s`
- Button: `0.55s`

**Decorative large numbers** (`01`–`04`) in background, very low opacity, parallax on scroll.

**Sections:**
| # | Title | Accent | Button |
|---|-------|--------|--------|
| 01 | Agendá tu | próximo turno | Gold — `/appointments/new` |
| 02 | Consultá | tu reserva | Outline — `/appointments/get` |
| 03 | Tienda de | insumos | Outline — `/shop` |
| 04 | Hablá con | nosotros | WhatsApp green — `wa.me/...` |

---

## Architecture

### Responsive strategy
- **Mobile** (`< lg`): existing layout unchanged — `Container.wrapper` + `Container.content` + `Header` + `HomeLink` list
- **Desktop** (`≥ lg`): new full-screen parallax component, completely replaces mobile layout

```tsx
// page.tsx (non-async, no changes to mobile behavior)
export default function Home() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <HomeDesktop />
      </div>
      {/* Mobile — unchanged */}
      <div className="lg:hidden">
        <Container.wrapper>
          <Container.content>
            ...existing mobile layout...
          </Container.content>
        </Container.wrapper>
      </div>
    </>
  );
}
```

### New files
- `src/app/_components/home-desktop.tsx` — `"use client"`, full parallax page
  - `SplashSection` — rings + content
  - `StickyNav` — fixed nav with scroll-driven visibility
  - `ParallaxSection` — reusable section component
- Animations: Framer Motion `whileInView` + `variants` for scroll reveals; CSS `@keyframes` for splash rings

### Constraints
- `max-width: 1600px` on the content wrapper inside each section (centered on 2K/4K)
- Mobile (`< lg`): zero changes to existing code
- Logo uses `<Image>` from `next/image` with `priority`
- WhatsApp link uses `target="_blank"` with hardcoded number (same as `home-link.tsx`)
- Dark mode: rings use gold with opacity; dark section (04) naturally handles it

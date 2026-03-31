# Home Redesign v2 — Design Spec
_Date: 2026-03-30_

## Goal

Fix the broken homescreen and deliver a unified, responsive, light/dark-aware experience across all breakpoints with:

1. Proper light/dark/system theming
2. A persistent minimalist navbar with immediate access to all actions
3. Full-screen parallax + scroll-reveal on ALL screen sizes (no mobile/desktop split)

---

## 1. Color System — Dark Mode Tokens

Add dark counterparts to the custom palette in `globals.css`. The existing `.dark {}` block only overrides shadcn tokens; we need to add the custom warm-dark palette:

```css
.dark {
  /* existing shadcn overrides stay */

  /* Custom warm-dark overrides */
  --color-base:               #1e1c19;
  --color-surface:            #141210;
  --color-content:            #f0ece6;
  --color-content-secondary:  #9c9189;
  --color-content-tertiary:   #6b6560;
  --color-content-quaternary: #4a4440;
  --color-border-subtle:      oklch(1 0 0 / 7%);
  --color-border-soft:        oklch(1 0 0 / 10%);
}
```

Gold (`#c9a96e`) stays unchanged in both modes. This single addition fixes both background colors and text colors everywhere these tokens are used.

---

## 2. Theme System — 3-State Toggle

### ThemeProvider (`src/components/theme-provider.tsx`)
- Client component wrapping the app in `layout.tsx`
- Reads/writes `localStorage` key `"theme"` with values `"system" | "light" | "dark"`
- Applies/removes `.dark` class on `<html>` element
- In "system" mode: listens to `window.matchMedia("(prefers-color-scheme: dark)")` changes
- Provides context: `{ theme, setTheme }`

### Flash prevention
Inline `<script>` in `<head>` (before any React hydration) that reads localStorage and applies `.dark` immediately if needed. Prevents white flash on dark mode users.

### ThemeToggle (`src/components/theme-toggle.tsx`)
- 3 icon buttons: Monitor / Sun / Moon (lucide-react)
- Active state highlighted with gold accent
- Used inside both the desktop navbar and the mobile hamburger menu

---

## 3. Persistent Navbar (`src/app/_components/home-navbar.tsx`)

Replaces `StickyNav` entirely. Fixed top, always visible, `z-50`.

### Layout

**Desktop (`lg+`):**
```
[Logo img + "Luckete Colorista"]  ·  [Agendar · Consultar · Tienda · WhatsApp]  ·  [ThemeToggle]
```

**Mobile (`< lg`):**
```
[Logo img + "Luckete Colorista"]  ·  [HamburgerButton]
```
Hamburger opens a dropdown/sheet with:
- 4 nav links stacked vertically
- ThemeToggle at the bottom

### Visual behavior
- **On splash section**: background fully transparent, only subtle blur (`backdrop-blur-sm`). Border hidden.
- **After scrolling**: background `bg-surface/90 dark:bg-[#141210]/90` + `backdrop-blur-md` + bottom border `border-border-subtle`. Transition via CSS `transition-all`.
- Scroll threshold: `scrollY > 60px` toggles the solid state.

### Height: `56px` (`h-14`). Sections must account for this with `scroll-mt-14`.

---

## 4. Unified Responsive Page (`src/app/page.tsx`)

Remove the `hidden lg:block` / `lg:hidden` split entirely. Render one unified flow for all breakpoints:

```tsx
export default function Home() {
  return <HomeScreen />;
}
```

`HomeScreen` (`src/app/_components/home-screen/index.tsx`) renders:
1. `HomeNavbar` (replaces `StickyNav`)
2. `SplashSection`
3. 4× `ParallaxSection`

---

## 5. SplashSection Adjustments

- Add `pt-14` to account for the fixed navbar height
- The animated rings already use `min(70vw, 520px)` — scale fine on mobile
- Title already uses `text-4xl lg:text-5xl` — no change needed
- Dark mode: `bg-surface` now correctly resolves to `#141210` in dark

---

## 6. ParallaxSection Adjustments

- Add `scroll-mt-14` to each section `<section>` element so anchor links from the navbar scroll to the right position
- All existing responsive sizing (`clamp`, `w-[90%]`, `max-w-[680px]`) works across breakpoints unchanged
- Dark mode: `bg-surface` resolves correctly; sections with explicit `bgClass` (e.g. `bg-[#e5e1db]`, `bg-[#1a1714]`) keep their hardcoded colors

### Dark mode for section 02 (currently `bg-[#e5e1db]`)
In dark mode this warm-beige-on-dark would look odd. Change to use a token: `dark:bg-[#1e1c19]` override or move to a CSS variable.

---

## 7. Files Changed

| File | Change |
|---|---|
| `src/app/globals.css` | Add dark palette tokens |
| `src/app/layout.tsx` | Add ThemeProvider + flash-prevention script |
| `src/components/theme-provider.tsx` | New: 3-state theme context |
| `src/components/theme-toggle.tsx` | New: 3-button toggle UI |
| `src/app/_components/home-screen/home-navbar.tsx` | New: persistent navbar (replaces StickyNav) |
| `src/app/_components/home-screen/index.tsx` | New (renamed from home-desktop): use HomeNavbar |
| `src/app/_components/home-screen/splash.tsx` | New (renamed from home-desktop): add pt-14 |
| `src/app/_components/home-screen/parallax-section.tsx` | New (renamed from home-desktop): scroll-mt-14; fix section-02 dark bg |
| `src/app/_components/home-desktop/` | Delete entire folder |
| `src/app/_components/home-desktop-wrapper.tsx` | Delete |
| `src/app/page.tsx` | Remove mobile/desktop split; use HomeScreen |

---

## Out of Scope

- Admin pages theming (separate concern)
- Changing the 4-section content/copy
- Animation timing adjustments

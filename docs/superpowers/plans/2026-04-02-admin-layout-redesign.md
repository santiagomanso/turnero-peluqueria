# Admin Layout Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the centered card admin shell with a full-viewport `bg-surface` layout matching the visual language of the public "Agendar turno" page.

**Architecture:** Remove the `md:rounded-2xl md:shadow-xl md:w-5/6` card wrapper from `layout.tsx` and replace the outer slate gradient with `bg-surface`. Sidebar loses its `bg-gray-50` so it inherits the beige surface. Page headers switch from `bg-white`/`bg-gray-100` to `bg-surface`. All card components (stat cards, config panels, etc.) keep their `bg-white` — they are intentionally elevated white cards floating on the beige surface.

**Tech Stack:** Next.js 16 App Router, TailwindCSS v4, TypeScript

---

## Files modified

| File | What changes |
|------|-------------|
| `src/app/admin/(protected)/layout.tsx` | Remove card wrapper div, outer bg → `bg-surface dark:bg-zinc-950` |
| `src/app/admin/_components/admin-sidebar.tsx` | Remove `bg-gray-50` |
| `src/app/admin/_components/admin-page-header.tsx` | Both header bars: `bg-white`/`bg-gray-100` → `bg-surface` |
| `src/app/admin/(protected)/config/_components/config-view.tsx` | Sticky footer `bg-white` → `bg-surface` |
| `src/app/admin/(protected)/config/loading.tsx` | Sticky header + footer `bg-white` → `bg-surface` |

---

## Task 1: Layout shell

**Files:**
- Modify: `src/app/admin/(protected)/layout.tsx`

- [ ] **Step 1: Read current file**

```bash
# Confirm current content before editing
```

Current file (`src/app/admin/(protected)/layout.tsx`):
```tsx
import { ReactNode } from "react";
import { cookies } from "next/headers";
import AdminSidebar from "../_components/admin-sidebar";
import AdminThemeProvider from "../_components/admin-theme-provider";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const isDark = cookieStore.get("admin-theme")?.value === "dark";

  return (
    <AdminThemeProvider defaultDark={isDark}>
      <main className="h-svh w-screen flex items-start justify-center font-archivo md:py-5 md:items-center overflow-hidden pt-safe bg-white dark:bg-zinc-900 md:bg-linear-to-br md:from-slate-500 md:via-slate-400 md:to-slate-400 md:dark:bg-none md:dark:bg-zinc-950">
        <div className="flex w-full h-full bg-white dark:bg-zinc-900 md:border md:border-white/20 md:dark:border-zinc-800 md:shadow-xl md:w-5/6 md:rounded-2xl md:max-w-7xl md:h-[85vh] relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-gold-gradient z-10 max-md:hidden" />
          <AdminSidebar />
          <main className="flex-1 min-w-0 max-lg:pt-14 bg-white dark:bg-zinc-900 h-full overflow-hidden flex flex-col">
            {children}
          </main>
        </div>
      </main>
    </AdminThemeProvider>
  );
}
```

- [ ] **Step 2: Replace the entire file content**

Replace with:
```tsx
import { ReactNode } from "react";
import { cookies } from "next/headers";
import AdminSidebar from "../_components/admin-sidebar";
import AdminThemeProvider from "../_components/admin-theme-provider";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const isDark = cookieStore.get("admin-theme")?.value === "dark";

  return (
    <AdminThemeProvider defaultDark={isDark}>
      <main className="relative h-svh w-screen flex font-archivo bg-surface dark:bg-zinc-950 overflow-hidden pt-safe">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-gold-gradient z-10 max-lg:hidden" />
        <AdminSidebar />
        <main className="flex-1 min-w-0 max-lg:pt-14 h-full overflow-hidden flex flex-col">
          {children}
        </main>
      </main>
    </AdminThemeProvider>
  );
}
```

Key changes:
- Outer `<main>`: removed slate gradient + card centering + `bg-white`; added `relative bg-surface dark:bg-zinc-950`
- Removed inner card `<div>` entirely (was `md:w-5/6 md:rounded-2xl md:shadow-xl`)
- Gold accent line: moved from inside the card div directly into outer `<main>` (still `absolute` — works because outer `<main>` is now `relative`)
- Inner content `<main>`: removed `bg-white dark:bg-zinc-900`

- [ ] **Step 3: Type-check**

```bash
cd /Users/devsanti/Documents/projects/turnero-peluqueria && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors related to this file.

- [ ] **Step 4: Verify visually**

Open `http://localhost:3000/admin/appointments` in the browser. Expected:
- Full-viewport warm beige background (no gray gradient, no card frame)
- Sidebar visible on the left on desktop
- Content area to the right

---

## Task 2: Sidebar background

**Files:**
- Modify: `src/app/admin/_components/admin-sidebar.tsx:41`

- [ ] **Step 1: Edit the aside className**

Find:
```tsx
<aside className="w-55 bg-gray-50 dark:bg-zinc-900 border-r border-border-subtle dark:border-zinc-800 sticky top-0 h-full shrink-0 flex flex-col max-lg:hidden">
```

Replace with:
```tsx
<aside className="w-55 dark:bg-zinc-900/40 border-r border-border-subtle dark:border-zinc-800 sticky top-0 h-full shrink-0 flex flex-col max-lg:hidden">
```

Note: light mode — no bg (inherits `bg-surface` from parent, making sidebar and content the same beige). Dark mode — `dark:bg-zinc-900/40` gives the sidebar a very subtle distinction from the `zinc-950` content area.

- [ ] **Step 2: Verify visually**

On desktop, sidebar should now be the same warm beige as the content area — no grey tint. The border-right separates them.

---

## Task 3: Page header bars

**Files:**
- Modify: `src/app/admin/_components/admin-page-header.tsx:38,56`

- [ ] **Step 1: Edit mobile topbar bg**

Find on line ~38:
```tsx
<div className="hidden max-lg:flex fixed top-0 left-0 right-0 z-30 bg-gray-100 dark:bg-zinc-900 border-b border-border-subtle dark:border-zinc-800 h-14 items-center justify-between px-4">
```

Replace with:
```tsx
<div className="hidden max-lg:flex fixed top-0 left-0 right-0 z-30 bg-surface dark:bg-zinc-900 border-b border-border-subtle dark:border-zinc-800 h-14 items-center justify-between px-4">
```

- [ ] **Step 2: Edit desktop header bg**

Find on line ~56:
```tsx
<div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-border-subtle dark:border-zinc-800 px-7 h-19 flex items-center max-lg:hidden">
```

Replace with:
```tsx
<div className="sticky top-0 z-10 bg-surface dark:bg-zinc-900 border-b border-border-subtle dark:border-zinc-800 px-7 h-19 flex items-center max-lg:hidden">
```

- [ ] **Step 3: Verify visually**

- Desktop: the sticky page header (showing "Turnos", "Pagos", etc.) should be the same beige as the background — it blends in rather than standing out as a white bar
- Mobile: the fixed topbar should be beige instead of gray

---

## Task 4: Config sticky bars

**Files:**
- Modify: `src/app/admin/(protected)/config/_components/config-view.tsx:253`
- Modify: `src/app/admin/(protected)/config/loading.tsx:139,160`

- [ ] **Step 1: Edit config-view.tsx sticky footer**

Find on line ~253:
```tsx
<div className="sticky bottom-0 z-10 border-t border-border-subtle dark:border-zinc-800 bg-white dark:bg-zinc-900 px-7 max-lg:px-4 h-17 flex items-center justify-between gap-3">
```

Replace with:
```tsx
<div className="sticky bottom-0 z-10 border-t border-border-subtle dark:border-zinc-800 bg-surface dark:bg-zinc-900 px-7 max-lg:px-4 h-17 flex items-center justify-between gap-3">
```

- [ ] **Step 2: Edit config/loading.tsx sticky header**

Find on line ~139:
```tsx
<div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-border-subtle dark:border-zinc-800 px-7 h-19 flex items-center max-lg:hidden">
```

Replace with:
```tsx
<div className="sticky top-0 z-10 bg-surface dark:bg-zinc-900 border-b border-border-subtle dark:border-zinc-800 px-7 h-19 flex items-center max-lg:hidden">
```

- [ ] **Step 3: Edit config/loading.tsx sticky footer**

Find on line ~160:
```tsx
<div className="sticky bottom-0 z-10 border-t border-border-subtle dark:border-zinc-800 bg-white dark:bg-zinc-900 px-7 max-lg:px-4 h-17 flex items-center justify-between gap-3">
```

Replace with:
```tsx
<div className="sticky bottom-0 z-10 border-t border-border-subtle dark:border-zinc-800 bg-surface dark:bg-zinc-900 px-7 max-lg:px-4 h-17 flex items-center justify-between gap-3">
```

- [ ] **Step 4: Verify visually**

Navigate to `/admin/config`. The sticky header and footer save bar should be beige — not a white band floating over the content.

---

## Task 5: Final type-check and commit

- [ ] **Step 1: Run type-check**

```bash
cd /Users/devsanti/Documents/projects/turnero-peluqueria && npx tsc --noEmit 2>&1
```

Expected: 0 errors.

- [ ] **Step 2: Quick visual tour**

Check each admin route looks correct:
- `/admin/appointments` — beige full-page, sidebar left, content right
- `/admin/payments` — same
- `/admin/metrics` — same (white stat cards should float nicely on beige)
- `/admin/shop` — same
- `/admin/config` — same + sticky header/footer are beige

- [ ] **Step 3: Check mobile**

In browser devtools, switch to mobile viewport (375px). Verify:
- Beige background fills screen
- Fixed topbar visible at top with beige bg
- Hamburger menu opens Sheet from left
- Content scrolls correctly below topbar

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/(protected)/layout.tsx \
        src/app/admin/_components/admin-sidebar.tsx \
        src/app/admin/_components/admin-page-header.tsx \
        src/app/admin/(protected)/config/_components/config-view.tsx \
        src/app/admin/(protected)/config/loading.tsx
git commit -m "redesign: admin layout full-page bg-surface, remove centered card"
```

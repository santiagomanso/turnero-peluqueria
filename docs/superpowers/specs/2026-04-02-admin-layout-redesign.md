# Admin Layout Redesign — Spec

> **For agentic workers:** Use superpowers:writing-plans to implement this spec.

**Goal:** Replace the centered card admin shell with a full-viewport layout using `bg-surface` throughout — matching the visual language of the public "Agendar turno" page.

**Reference:** `src/app/appointments/new/_components/create-appointment-form.tsx` — sidebar on left, content on right, same `bg-surface` background everywhere, no card wrapper.

---

## What changes

### 1. Layout shell — `src/app/admin/(protected)/layout.tsx`

**Before:**
- Outer `<main>`: slate gradient bg on desktop, white on mobile, centered with padding
- Inner `<div>`: centered card `md:w-5/6 md:max-w-7xl md:h-[85vh] md:rounded-2xl md:shadow-xl md:border`
- Content `<main>`: `bg-white`

**After:**
- Single `<main>`: `h-svh w-screen flex font-archivo bg-surface dark:bg-zinc-950 overflow-hidden pt-safe`
- No inner card wrapper — just `flex w-full h-full`
- Content `<main>`: transparent / inherits `bg-surface`
- Keep the thin gold accent line at the top (`.absolute top-0 left-1/2 ... bg-gold-gradient`)

### 2. Sidebar — `src/app/admin/_components/admin-sidebar.tsx`

- Remove `bg-gray-50` → no explicit bg (inherits `bg-surface` from parent)
- Everything else stays identical

### 3. Page header — `src/app/admin/_components/admin-page-header.tsx`

- Mobile topbar: `bg-gray-100` → `bg-surface`
- Desktop header: `bg-white` → `bg-surface`

### 4. Config sticky footer — `src/app/admin/(protected)/config/_components/config-view.tsx`

- Sticky save-button bar: `bg-white` → `bg-surface`

### 5. Config loading skeleton — `src/app/admin/(protected)/config/loading.tsx`

- Sticky header skeleton: `bg-white` → `bg-surface`
- Sticky footer skeleton: `bg-white` → `bg-surface`

---

## What does NOT change

- All card components (`bg-white dark:bg-zinc-900 rounded-2xl border`) keep their white bg — they are elevated cards floating on the beige surface, which is intentional
- Mobile Sheet navigation (`admin-mobile-sheet.tsx`) keeps `bg-white` — it's an overlay panel
- Login page — untouched
- All per-page dropdowns (`mobileControls`, `desktopControls`) — untouched
- Dark mode zinc scale — all `dark:bg-zinc-*` values stay as-is

---

## Responsive

- Mobile (`< lg`): full-screen `bg-surface`, fixed topbar at top, sidebar hidden (Sheet), content scrolls below topbar (`pt-14`)
- Desktop (`lg+`): full-viewport, sidebar `w-55` always visible on left, content takes remaining space

---

## Files touched

| File | Change |
|------|--------|
| `src/app/admin/(protected)/layout.tsx` | Remove card wrapper, `bg-surface` shell |
| `src/app/admin/_components/admin-sidebar.tsx` | Remove `bg-gray-50` |
| `src/app/admin/_components/admin-page-header.tsx` | Both headers `bg-surface` |
| `src/app/admin/(protected)/config/_components/config-view.tsx` | Sticky footer `bg-surface` |
| `src/app/admin/(protected)/config/loading.tsx` | Sticky header + footer `bg-surface` |

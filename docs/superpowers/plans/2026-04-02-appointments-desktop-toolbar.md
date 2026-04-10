# Appointments Desktop Toolbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-width desktop toolbar to the appointments page with search, date picker, cancelled toggle, view mode buttons, create/refresh actions, and the existing settings dropdown — desktop (lg+) only.

**Architecture:** A new `AppointmentsDesktopToolbar` component receives `viewMode`, `onViewModeChange`, `searchQuery`, and `onSearchChange` as props. It's wired into `appointments-view.tsx` which holds the `searchQuery` state and filters appointments client-side before rendering. `AdminPageHeader` gets a new `desktopControlsExpand` prop so the toolbar container stretches to fill the full header width.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, TailwindCSS v4, shadcn/ui (Button, Popover), Lucide icons, Zustand (via `useAdminAppointments`)

---

## File Map

| Action | Path |
|---|---|
| **Create** | `src/app/admin/(protected)/appointments/_components/appointments-desktop-toolbar.tsx` |
| **Modify** | `src/app/admin/_components/admin-page-header.tsx` |
| **Modify** | `src/app/admin/(protected)/appointments/_components/appointments-view.tsx` |

---

## Task 1: Add `desktopControlsExpand` prop to `AdminPageHeader`

**Files:**
- Modify: `src/app/admin/_components/admin-page-header.tsx`

The desktop header currently puts `desktopControls` in an `ml-auto` container. When the toolbar needs to fill the remaining width, we need `flex-1` instead. A new optional boolean prop switches between the two behaviors — `false` by default so no other pages are affected.

- [ ] **Step 1: Read the file**

```bash
# Confirm current content before editing
```

Read `src/app/admin/_components/admin-page-header.tsx` with the Read tool.

- [ ] **Step 2: Add the prop to the interface and JSX**

In `AdminPageHeaderProps`, add:
```ts
/** When true, desktopControls container stretches to fill remaining header width */
desktopControlsExpand?: boolean;
```

In the function signature:
```ts
export function AdminPageHeader({
  title,
  subtitle,
  badge,
  desktopControls,
  desktopControlsExpand = false,
  mobileControls,
}: AdminPageHeaderProps) {
```

Change the `desktopControls` wrapper div from:
```tsx
{desktopControls && (
  <div className="ml-auto flex items-center gap-2">
    {desktopControls}
  </div>
)}
```
to:
```tsx
{desktopControls && (
  <div
    className={
      desktopControlsExpand
        ? "flex-1 ml-4 flex items-center gap-2"
        : "ml-auto flex items-center gap-2"
    }
  >
    {desktopControls}
  </div>
)}
```

- [ ] **Step 3: Type-check**

```bash
cd /Users/devsanti/Documents/projects/turnero-peluqueria && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors related to `admin-page-header.tsx`.

---

## Task 2: Create `AppointmentsDesktopToolbar`

**Files:**
- Create: `src/app/admin/(protected)/appointments/_components/appointments-desktop-toolbar.tsx`

This component renders the full toolbar row. It is `desktop-only` (the `AdminPageHeader` `desktopControls` slot is already `max-lg:hidden`). It uses `useAdminAppointments` directly for date/cancelled state, and receives view mode + search as props.

- [ ] **Step 1: Create the file**

```tsx
"use client";

import { useState } from "react";
import {
  Search,
  RefreshCw,
  LayoutGrid,
  LayoutList,
  List,
  CalendarDays,
  Eye,
  EyeOff,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAdminAppointments } from "../_hooks/use-appointments";
import { AppointmentCalendarBody } from "./appointment-calendar";
import AdminCreateAppointment from "./create-appointment-modal";
import { AppointmentsMobileDropdown } from "./appointments-mobile-dropdown";
import { formatDateFromISO, isTodayFromISO } from "@/lib/format-date";

type ViewMode = "cards-square" | "cards-flat" | "table";

interface Props {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const VIEW_BUTTONS: { mode: ViewMode; icon: React.ReactNode; label: string }[] =
  [
    { mode: "cards-square", icon: <LayoutGrid className="w-3.5 h-3.5" />, label: "Cuadradas" },
    { mode: "cards-flat", icon: <LayoutList className="w-3.5 h-3.5" />, label: "Planas" },
    { mode: "table", icon: <List className="w-3.5 h-3.5" />, label: "Tabla" },
  ];

export function AppointmentsDesktopToolbar({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
}: Props) {
  const vm = useAdminAppointments();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const dateLabel = isTodayFromISO(vm.selectedDate)
    ? "Hoy"
    : formatDateFromISO(vm.selectedDate);

  return (
    <>
      <AdminCreateAppointment open={createOpen} onOpenChange={setCreateOpen} />

      {/* Search */}
      <div className="relative flex-1 max-w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-tertiary dark:text-zinc-500 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por teléfono, email o #ID..."
          className="w-full h-8 pl-9 pr-3 text-xs bg-transparent border border-border-subtle dark:border-zinc-700 rounded-lg text-content dark:text-zinc-100 placeholder:text-content-tertiary dark:placeholder:text-zinc-500 focus:outline-none focus:border-gold/40 dark:focus:border-gold/40 transition-colors"
        />
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-border-subtle dark:bg-zinc-700 shrink-0" />

      {/* Date chip */}
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 gap-1.5 text-xs font-medium border-border-subtle dark:border-zinc-700 dark:bg-zinc-800/50",
              calendarOpen && "border-gold/40 bg-gold/5",
            )}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            {dateLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-auto p-0 bg-white dark:bg-zinc-900 border border-border-subtle dark:border-zinc-700 shadow-lg rounded-xl"
        >
          <AppointmentCalendarBody
            cellSize="2.75rem"
            onAfterSelect={() => setCalendarOpen(false)}
          />
        </PopoverContent>
      </Popover>

      {/* Cancelled toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={vm.toggleShowCancelled}
        className={cn(
          "h-8 gap-1.5 text-xs font-medium border-border-subtle dark:border-zinc-700 dark:bg-zinc-800/50",
          vm.showCancelled &&
            "bg-gold/10 border-gold/25 text-gold hover:bg-gold/15 dark:hover:bg-gold/15",
        )}
      >
        {vm.showCancelled ? (
          <EyeOff className="w-3.5 h-3.5" />
        ) : (
          <Eye className="w-3.5 h-3.5" />
        )}
        Cancelados
      </Button>

      {/* Divider */}
      <div className="w-px h-6 bg-border-subtle dark:bg-zinc-700 shrink-0" />

      {/* View mode buttons */}
      <div className="flex items-center gap-1">
        {VIEW_BUTTONS.map(({ mode, icon }) => (
          <Button
            key={mode}
            variant="outline"
            size="icon"
            onClick={() => onViewModeChange(mode)}
            className={cn(
              "h-8 w-8 border-border-subtle dark:border-zinc-700 dark:bg-zinc-800/50",
              viewMode === mode &&
                "bg-zinc-100 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600",
            )}
          >
            {icon}
          </Button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-border-subtle dark:bg-zinc-700 shrink-0" />

      {/* New appointment */}
      <Button
        size="sm"
        onClick={() => setCreateOpen(true)}
        className="h-8 gap-1.5 text-xs font-medium bg-gold text-white hover:bg-gold/90 shadow-sm"
      >
        <Plus className="w-3.5 h-3.5" />
        Nuevo turno
      </Button>

      {/* Refresh */}
      <Button
        variant="outline"
        size="icon"
        onClick={vm.handleRefresh}
        disabled={vm.isLoading}
        className="h-8 w-8 border-border-subtle dark:border-zinc-700 dark:bg-zinc-800/50"
      >
        <RefreshCw
          className={cn("w-3.5 h-3.5", vm.isLoading && "animate-spin")}
        />
      </Button>

      {/* Settings dropdown */}
      <AppointmentsMobileDropdown
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />
    </>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
cd /Users/devsanti/Documents/projects/turnero-peluqueria && npx tsc --noEmit 2>&1 | head -30
```

Expected: no new errors.

---

## Task 3: Wire toolbar into `appointments-view.tsx`

**Files:**
- Modify: `src/app/admin/(protected)/appointments/_components/appointments-view.tsx`

Add `searchQuery` state, compute `filteredAppointments`, dynamically import `AppointmentsDesktopToolbar`, pass it as `desktopControls` with `desktopControlsExpand`, and use `filteredAppointments` in all three render branches.

- [ ] **Step 1: Read the file before editing**

Read `src/app/admin/(protected)/appointments/_components/appointments-view.tsx` with the Read tool.

- [ ] **Step 2: Add the dynamic import for `AppointmentsDesktopToolbar`**

After the existing `AppointmentsMobileDropdown` dynamic import (line ~28), add:

```tsx
const AppointmentsDesktopToolbar = dynamic(
  () =>
    import("./appointments-desktop-toolbar").then((m) => ({
      default: m.AppointmentsDesktopToolbar,
    })),
  { ssr: false },
);
```

- [ ] **Step 3: Add `searchQuery` state and `filteredAppointments` computation**

Inside `AdminAppointments()`, after the `handleViewMode` function, add:

```tsx
const [searchQuery, setSearchQuery] = useState("");

const filteredAppointments = searchQuery.trim()
  ? vm.appointments.filter((a) => {
      const q = searchQuery.trim().toLowerCase();
      const clean = q.replace(/^#/, "");
      const phone = a.telephone.slice(-10);
      const shortId = a.id.slice(-6).toUpperCase();
      const name = (a.payerName ?? "").toLowerCase();
      const email = (a.payerEmail ?? "").toLowerCase();
      return (
        phone.includes(clean) ||
        shortId.includes(clean.toUpperCase()) ||
        name.includes(q) ||
        email.includes(q)
      );
    })
  : vm.appointments;
```

- [ ] **Step 4: Update the `badge` to reflect filtered count**

Change the existing `badge` computation from:
```tsx
const badge =
  vm.hasFetched && !vm.isLoading && vm.appointments.length > 0
    ? vm.appointments.length
    : undefined;
```
to:
```tsx
const badge =
  vm.hasFetched && !vm.isLoading && filteredAppointments.length > 0
    ? filteredAppointments.length
    : undefined;
```

- [ ] **Step 5: Replace the `controls` block and update `AdminPageHeader`**

Remove:
```tsx
const controls = (
  <AppointmentsMobileDropdown
    viewMode={viewMode}
    onViewModeChange={handleViewMode}
  />
);
```

And update `AdminPageHeader` usage to:
```tsx
<AdminPageHeader
  title="Turnos"
  subtitle={formatDateLongFromISO(vm.selectedDate)}
  badge={badge}
  desktopControlsExpand
  desktopControls={
    <AppointmentsDesktopToolbar
      viewMode={viewMode}
      onViewModeChange={handleViewMode}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    />
  }
  mobileControls={
    <AppointmentsMobileDropdown
      viewMode={viewMode}
      onViewModeChange={handleViewMode}
    />
  }
/>
```

- [ ] **Step 6: Replace `vm.appointments` with `filteredAppointments` in all three render branches**

The three render branches are the table, cards-square, and cards-flat sections. Each one iterates `vm.appointments` — replace all three occurrences with `filteredAppointments`.

Also update the empty state check from `vm.appointments.length > 0` to `filteredAppointments.length > 0`.

For the table branch (around line 162):
```tsx
{filteredAppointments.map((appointment) => {
```
(remove the `Array.from({ length: 30 }).flatMap` test wrapper too — this is the right moment to clean that up since we're touching all three branches)

For the cards-square branch (around line 225):
```tsx
{filteredAppointments.map((appointment) => (
```

For the cards-flat branch (around line 242):
```tsx
{filteredAppointments.map((appointment) => (
```

Also the outer check:
```tsx
{filteredAppointments.length > 0 ? (
```

- [ ] **Step 7: Add a "no results" message when search returns nothing but appointments exist**

After the existing empty-state div (`Sin turnos`), we need a different message when there are appointments but none match the search. Replace the single empty state with:

```tsx
) : searchQuery.trim() ? (
  <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-border-subtle dark:border-zinc-800 shadow-sm text-center max-w-sm mt-4">
    <p className="text-content dark:text-zinc-100 font-medium">
      Sin resultados
    </p>
    <p className="text-xs text-content-quaternary dark:text-zinc-500 mt-2 leading-relaxed">
      No hay turnos que coincidan con &ldquo;{searchQuery}&rdquo;.
    </p>
  </div>
) : (
  <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-border-subtle dark:border-zinc-800 shadow-sm text-center max-w-sm mt-4">
    <p className="text-content dark:text-zinc-100 font-medium">
      Sin turnos
    </p>
    <p className="text-xs text-content-quaternary dark:text-zinc-500 mt-2 leading-relaxed">
      No hay turnos agendados para este día.
    </p>
  </div>
)}
```

- [ ] **Step 8: Type-check**

```bash
cd /Users/devsanti/Documents/projects/turnero-peluqueria && npx tsc --noEmit 2>&1 | head -40
```

Expected: no errors.

- [ ] **Step 9: ESLint check**

```bash
cd /Users/devsanti/Documents/projects/turnero-peluqueria && npx eslint src/app/admin/_components/admin-page-header.tsx src/app/admin/\(protected\)/appointments/_components/appointments-view.tsx src/app/admin/\(protected\)/appointments/_components/appointments-desktop-toolbar.tsx --quiet 2>&1 | head -30
```

Expected: no errors.

---

## Self-Review Checklist

**Spec coverage:**
- ✅ Search input (phone, email, name, #ID) → Task 3, Step 3
- ✅ Date chip with calendar popover → Task 2, Step 1
- ✅ Cancelled toggle → Task 2, Step 1
- ✅ View mode buttons (⊞☰≡) → Task 2, Step 1
- ✅ + Nuevo turno button → Task 2, Step 1
- ✅ ↺ Refresh button → Task 2, Step 1
- ✅ ⚙️ Settings dropdown at end → Task 2, Step 1
- ✅ Desktop-only → `desktopControls` slot is `max-lg:hidden` in header
- ✅ Mobile unchanged → `mobileControls` still uses `AppointmentsMobileDropdown`
- ✅ `desktopControlsExpand` prop → Task 1

**Placeholder scan:** None found.

**Type consistency:** `ViewMode` is `"cards-square" | "cards-flat" | "table"` throughout all three files. Props `viewMode`, `onViewModeChange`, `searchQuery`, `onSearchChange` match between Task 2 and Task 3.

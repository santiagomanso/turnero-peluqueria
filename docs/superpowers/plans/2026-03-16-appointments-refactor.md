# Appointments Refactor + Admin Dashboard — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Colocate all appointment-specific admin files into `(protected)/appointments/`, delete dead code, clean up unused hook properties, and replace the admin root redirect with a dashboard summary page.

**Architecture:** Move files into domain-colocated folders matching the pattern already used by shop/payments/metrics. Create a new server-rendered dashboard page with a service function that queries today's appointments, pending orders, and daily revenue in parallel.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Prisma 7, TailwindCSS v4, Zustand v5

**Spec:** `docs/superpowers/specs/2026-03-16-appointments-refactor-design.md`

---

## Chunk 1: File Relocation + Cleanup

All paths below are relative to `src/app/admin/`.

### Task 1: Create destination directories

**Files:**
- Create: `(protected)/appointments/_components/` (directory)
- Create: `(protected)/appointments/_hooks/` (directory)
- Create: `(protected)/appointments/_actions/` (directory)

- [ ] **Step 1: Create the three directories**

```bash
mkdir -p "src/app/admin/(protected)/appointments/_components"
mkdir -p "src/app/admin/(protected)/appointments/_hooks"
mkdir -p "src/app/admin/(protected)/appointments/_actions"
```

- [ ] **Step 2: Commit**

```bash
git add "src/app/admin/(protected)/appointments"
git commit -m "chore: create appointments domain directories"
```

---

### Task 2: Move hooks

**Files:**
- Move: `_hooks/use-admin-appointments.ts` → `(protected)/appointments/_hooks/use-appointments.ts`
- Move: `_hooks/use-admin-create-form.ts` → `(protected)/appointments/_hooks/use-create-form.ts`

- [ ] **Step 1: Move and rename hooks**

```bash
git mv "src/app/admin/_hooks/use-admin-appointments.ts" "src/app/admin/(protected)/appointments/_hooks/use-appointments.ts"
git mv "src/app/admin/_hooks/use-admin-create-form.ts" "src/app/admin/(protected)/appointments/_hooks/use-create-form.ts"
```

- [ ] **Step 2: Update internal import in `use-create-form.ts`**

In `use-create-form.ts`, update the import of the appointments hook:

Old: `import { useAdminAppointments } from "../_hooks/use-admin-appointments";`
New: `import { useAdminAppointments } from "./use-appointments";`

Also update the action import:

Old: `import { createAdminAppointmentAction } from "../_actions/create-admin-appointment";`
New: `import { createAdminAppointmentAction } from "../_actions/create-appointment";`

(This will resolve after Task 3 moves the actions.)

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "refactor: move appointment hooks to domain directory"
```

---

### Task 3: Move actions

**Files:**
- Move: `_actions/get-by-date.ts` → `(protected)/appointments/_actions/get-by-date.ts`
- Move: `_actions/create-admin-appointment.ts` → `(protected)/appointments/_actions/create-appointment.ts`

- [ ] **Step 1: Move and rename actions**

```bash
git mv "src/app/admin/_actions/get-by-date.ts" "src/app/admin/(protected)/appointments/_actions/get-by-date.ts"
git mv "src/app/admin/_actions/create-admin-appointment.ts" "src/app/admin/(protected)/appointments/_actions/create-appointment.ts"
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "refactor: move appointment actions to domain directory"
```

---

### Task 4: Move components

**Files:**
- Move: `_components/admin-appointments.tsx` → `(protected)/appointments/_components/appointments-view.tsx`
- Move: `_components/admin-create-appointment.tsx` → `(protected)/appointments/_components/create-appointment-modal.tsx`
- Move: `_components/appointment-calendar.tsx` → `(protected)/appointments/_components/appointment-calendar.tsx`
- Move: `_components/appointments-mobile-dropdown.tsx` → `(protected)/appointments/_components/appointments-mobile-dropdown.tsx`

- [ ] **Step 1: Move and rename components**

```bash
git mv "src/app/admin/_components/admin-appointments.tsx" "src/app/admin/(protected)/appointments/_components/appointments-view.tsx"
git mv "src/app/admin/_components/admin-create-appointment.tsx" "src/app/admin/(protected)/appointments/_components/create-appointment-modal.tsx"
git mv "src/app/admin/_components/appointment-calendar.tsx" "src/app/admin/(protected)/appointments/_components/appointment-calendar.tsx"
git mv "src/app/admin/_components/appointments-mobile-dropdown.tsx" "src/app/admin/(protected)/appointments/_components/appointments-mobile-dropdown.tsx"
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "refactor: move appointment components to domain directory"
```

---

### Task 5: Update all imports

After moving, every import path between these files must be updated. All shared admin imports (`@/app/admin/_components/...`) stay absolute.

**Files to update:**
- Modify: `(protected)/appointments/page.tsx`
- Modify: `(protected)/appointments/_components/appointments-view.tsx`
- Modify: `(protected)/appointments/_components/create-appointment-modal.tsx`
- Modify: `(protected)/appointments/_components/appointment-calendar.tsx`
- Modify: `(protected)/appointments/_components/appointments-mobile-dropdown.tsx`
- Modify: `(protected)/appointments/_hooks/use-create-form.ts`
- Modify: `(protected)/appointments/_hooks/use-appointments.ts`

- [ ] **Step 1: Update `appointments/page.tsx`**

Old: `import AdminAppointments from "../../_components/admin-appointments";`
New: `import AdminAppointments from "./_components/appointments-view";`

- [ ] **Step 2: Update `appointments-view.tsx` imports**

Update hook import:
Old: `import { useAdminAppointments } from "../_hooks/use-admin-appointments";`
New: `import { useAdminAppointments } from "../_hooks/use-appointments";`

Update mobile dropdown dynamic import path:
Old: `import("./appointments-mobile-dropdown")`
New: stays the same (relative, same directory)

Update shared admin imports — these use `@/app/admin/_components/...` absolute paths and stay unchanged.

- [ ] **Step 3: Update `create-appointment-modal.tsx` imports**

Old: `import useAdminCreateForm from "../_hooks/use-admin-create-form";`
New: `import useAdminCreateForm from "../_hooks/use-create-form";`

- [ ] **Step 4: Update `appointment-calendar.tsx` imports**

Old: `import { useAdminAppointments } from "../_hooks/use-admin-appointments";`
New: `import { useAdminAppointments } from "../_hooks/use-appointments";`

- [ ] **Step 5: Update `appointments-mobile-dropdown.tsx` imports**

Update hook import:
Old: `import { useAdminAppointments } from "../_hooks/use-admin-appointments";` (or similar path)
New: `import { useAdminAppointments } from "../_hooks/use-appointments";`

Update calendar body import:
Old: `import { AppointmentCalendarBody } from "./appointment-calendar";`
New: stays the same (relative, same directory)

Update create appointment import:
Old: `import AdminCreateAppointment from "./admin-create-appointment";` (or similar)
New: `import AdminCreateAppointment from "./create-appointment-modal";`

Update shared admin imports (`ThemeMenuItem`, etc.) — absolute paths stay unchanged.

- [ ] **Step 6: Update `use-appointments.ts` imports**

Old: `import { getAppointmentsByDateAction } from "../_actions/get-by-date";`
New: `import { getAppointmentsByDateAction } from "../_actions/get-by-date";`

This path is already relative within the domain — verify it resolves correctly from the new location. The action import from `@/app/appointments/_actions/get-monthly-counts` is an absolute path to the public appointments module and stays unchanged.

- [ ] **Step 7: Update `use-create-form.ts` imports**

Old: `import { createAdminAppointmentAction } from "../_actions/create-admin-appointment";`
New: `import { createAdminAppointmentAction } from "../_actions/create-appointment";`

Old: `import { useAdminAppointments } from "../_hooks/use-admin-appointments";`
New: `import { useAdminAppointments } from "./use-appointments";`

- [ ] **Step 8: TypeScript verification**

```bash
npx tsc --noEmit --pretty 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "refactor: update all appointment import paths after relocation"
```

---

### Task 6: Delete dead code

**Files:**
- Delete: `_components/appointments-desktop-controls.tsx`

- [ ] **Step 1: Delete the file**

```bash
git rm "src/app/admin/_components/appointments-desktop-controls.tsx"
```

- [ ] **Step 2: Verify no broken imports**

```bash
npx tsc --noEmit --pretty 2>&1 | head -10
```

Expected: no errors (file was never imported).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: delete unused appointments-desktop-controls.tsx"
```

---

### Task 7: Clean up unused hook properties

**Files:**
- Modify: `(protected)/appointments/_hooks/use-create-form.ts`

- [ ] **Step 1: Remove unused properties from return object**

Remove these 9 properties from the return statement of `useAdminCreateForm`:

```typescript
// DELETE these lines:
isEditing: false,
isRedirecting: false,
appliedDiscount: null,
isValidatingDiscount: false,
applyDiscount: async (_code: string) => {},
removeDiscount: () => {},
fullDates: [] as Date[],
isLoadingHours: false,
daysConfig: null,
```

- [ ] **Step 2: TypeScript verification**

```bash
npx tsc --noEmit --pretty 2>&1 | head -30
```

Expected: no errors. If any consumer expects these properties, TypeScript will catch it. If errors appear, it means a shared type interface requires them — in that case, keep the properties and skip this task.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove unused placeholder properties from use-create-form"
```

---

## Chunk 2: Admin Dashboard

### Task 8: Create dashboard service

**Files:**
- Create: `src/services/dashboard.ts`

- [ ] **Step 1: Create the service function**

```typescript
import { db } from "@/lib/db";
import { formatInTimeZone } from "date-fns-tz";

const TZ = "America/Argentina/Buenos_Aires";

export interface DashboardSummary {
  todayAppointments: number;
  nextAppointment: { time: string; clientName: string } | null;
  pendingOrders: number;
  todayRevenue: number;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const todayISO = formatInTimeZone(new Date(), TZ, "yyyy-MM-dd");
  const todayStart = new Date(todayISO + "T00:00:00.000Z");
  const todayEnd = new Date(todayISO + "T23:59:59.999Z");

  const [appointments, pendingOrders, payments] = await Promise.all([
    db.appointment.findMany({
      where: {
        date: { gte: todayStart, lte: todayEnd },
        status: { in: ["PENDING", "PAID"] },
      },
      select: { time: true, payerName: true },
      orderBy: { time: "asc" },
    }),
    db.order.count({
      where: { status: { in: ["PENDING", "PROCESSING"] } },
    }),
    db.payment.findMany({
      where: { paidAt: { gte: todayStart, lte: todayEnd } },
      select: { amount: true },
    }),
  ]);

  const nowTime = formatInTimeZone(new Date(), TZ, "HH:mm");
  const upcoming = appointments.find((a) => a.time >= nowTime);

  return {
    todayAppointments: appointments.length,
    nextAppointment: upcoming
      ? { time: upcoming.time, clientName: upcoming.payerName ?? "Cliente" }
      : null,
    pendingOrders,
    todayRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/services/dashboard.ts
git commit -m "feat: add getDashboardSummary service function"
```

---

### Task 9: Create dashboard action

**Files:**
- Create: `src/app/admin/_actions/get-dashboard.ts`

- [ ] **Step 1: Create the action (thin wrapper)**

```typescript
"use server";

import { getDashboardSummary, type DashboardSummary } from "@/services/dashboard";

export async function getDashboardAction(): Promise<DashboardSummary> {
  return getDashboardSummary();
}
```

- [ ] **Step 2: Commit**

```bash
git add "src/app/admin/_actions/get-dashboard.ts"
git commit -m "feat: add getDashboardAction server action"
```

---

### Task 10: Create dashboard data component + update page

**Files:**
- Create: `src/app/admin/(protected)/_components/dashboard-data.tsx`
- Modify: `src/app/admin/(protected)/page.tsx`

- [ ] **Step 1: Create the async server component `dashboard-data.tsx`**

This component fetches data and renders 3 stat cards directly (no client component needed).

```tsx
import { CalendarDays, ShoppingBag, DollarSign, Clock } from "lucide-react";
import { getDashboardAction } from "@/app/admin/_actions/get-dashboard";

export default async function DashboardData() {
  const data = await getDashboardAction();

  const cards = [
    {
      icon: CalendarDays,
      label: "Turnos hoy",
      value: String(data.todayAppointments),
      detail: data.nextAppointment
        ? `Próximo: ${data.nextAppointment.time} hs — ${data.nextAppointment.clientName}`
        : "Sin turnos próximos",
      detailIcon: Clock,
    },
    {
      icon: ShoppingBag,
      label: "Pedidos pendientes",
      value: String(data.pendingOrders),
      detail: data.pendingOrders === 0
        ? "Todo al día"
        : `${data.pendingOrders} ${data.pendingOrders === 1 ? "pedido requiere" : "pedidos requieren"} atención`,
    },
    {
      icon: DollarSign,
      label: "Ingresos del día",
      value: `$${data.todayRevenue.toLocaleString("es-AR")}`,
      detail: "Turnos + tienda",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-border-subtle dark:border-zinc-800 shadow-sm p-5 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-[0.65rem] uppercase tracking-[0.12em] text-content-tertiary dark:text-zinc-500">
              {card.label}
            </p>
            <card.icon className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          </div>
          <p className="font-heebo text-2xl font-semibold text-content dark:text-zinc-100 leading-none">
            {card.value}
          </p>
          <p className="text-xs text-content-tertiary dark:text-zinc-500">
            {card.detail}
          </p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Update `page.tsx` — replace redirect with Suspense + dashboard**

```tsx
import { Suspense } from "react";
import DashboardData from "./_components/dashboard-data";

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-border-subtle dark:border-zinc-800 shadow-sm p-5 h-32 animate-pulse"
        />
      ))}
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-7 py-6 max-md:px-4">
        <h1 className="font-heebo text-xl font-semibold text-content dark:text-zinc-100">
          Panel de control
        </h1>
        <p className="text-sm text-content-tertiary dark:text-zinc-500 mt-1">
          Resumen del día
        </p>
      </div>

      <div className="px-7 max-md:px-4 pb-6">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardData />
        </Suspense>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: TypeScript verification**

```bash
npx tsc --noEmit --pretty 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add "src/app/admin/(protected)/_components/dashboard-data.tsx" "src/app/admin/(protected)/page.tsx"
git commit -m "feat: replace admin redirect with dashboard summary page"
```

---

### Task 11: Final verification

- [ ] **Step 1: Full TypeScript check**

```bash
npx tsc --noEmit --pretty
```

Expected: no errors.

- [ ] **Step 2: Verify no orphaned files remain**

```bash
# Should return NO results — all appointment-specific files should be gone from admin/_components
ls src/app/admin/_components/admin-appointments.tsx src/app/admin/_components/admin-create-appointment.tsx src/app/admin/_components/appointment-calendar.tsx src/app/admin/_components/appointments-desktop-controls.tsx src/app/admin/_components/appointments-mobile-dropdown.tsx 2>&1
```

Expected: "No such file or directory" for all 5.

```bash
# Should return NO results — all appointment-specific hooks/actions should be gone
ls src/app/admin/_hooks/use-admin-appointments.ts src/app/admin/_hooks/use-admin-create-form.ts src/app/admin/_actions/get-by-date.ts src/app/admin/_actions/create-admin-appointment.ts 2>&1
```

Expected: "No such file or directory" for all 4.

- [ ] **Step 3: Dev server smoke test**

```bash
pnpm dev
```

Navigate to:
- `/admin` → should show dashboard with 3 stat cards (not redirect)
- `/admin/appointments` → should show appointments list as before
- Create appointment via the options dropdown → should work

- [ ] **Step 4: Final commit if any fixes needed**

Only if previous steps revealed issues that required fixes.

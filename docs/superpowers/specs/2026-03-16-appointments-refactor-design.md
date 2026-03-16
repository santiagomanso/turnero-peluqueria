# Appointments Refactor + Admin Dashboard

**Date:** 2026-03-16
**Status:** Draft

## Problem

Appointment-specific components, hooks, and actions live in shared admin directories (`admin/_components/`, `admin/_hooks/`, `admin/_actions/`) instead of inside `(protected)/appointments/`. This breaks the colocation principle used by every other admin module (shop, payments, metrics, config). Additionally, `(protected)/page.tsx` is a redirect to `/admin/appointments` instead of serving useful content.

## Scope

1. **File relocation** — Move all appointment-specific files into `(protected)/appointments/`
2. **Admin dashboard** — Replace the redirect in `(protected)/page.tsx` with a summary view
3. **Minor cleanup** — Remove unused return properties from `use-create-form.ts`

---

## Part 1: File Relocation

### Files to move

| Origin | Destination | Rename rationale |
|--------|-------------|------------------|
| `admin/_components/admin-appointments.tsx` | `appointments/_components/appointments-view.tsx` | Drop `admin-` prefix, match convention (`*-view.tsx`) |
| `admin/_components/admin-create-appointment.tsx` | `appointments/_components/create-appointment-modal.tsx` | Clarify it's a modal |
| `admin/_components/appointment-calendar.tsx` | `appointments/_components/appointment-calendar.tsx` | Same name |
| `admin/_components/appointments-mobile-dropdown.tsx` | `appointments/_components/appointments-mobile-dropdown.tsx` | Same name |

### Files to delete

| File | Reason |
|------|--------|
| `admin/_components/appointments-desktop-controls.tsx` | Dead code — never imported. `appointments-view.tsx` uses `AppointmentsMobileDropdown` for both mobile and desktop controls (per CLAUDE.md rule #4). |
| `admin/_hooks/use-admin-appointments.ts` | `appointments/_hooks/use-appointments.ts` | Drop `admin-` prefix |
| `admin/_hooks/use-admin-create-form.ts` | `appointments/_hooks/use-create-form.ts` | Drop `admin-` prefix |
| `admin/_actions/get-by-date.ts` | `appointments/_actions/get-by-date.ts` | Same name |
| `admin/_actions/create-admin-appointment.ts` | `appointments/_actions/create-appointment.ts` | Drop `admin-` prefix |

### Files that stay in `admin/` (truly shared)

- `_components/`: `admin-page-header.tsx`, `admin-sidebar.tsx`, `admin-mobile-sheet.tsx`, `admin-theme-provider.tsx`, `theme-toggle-button.tsx`, `theme-menu-item.tsx`, `period-tabs.tsx`, `shop-mobile-controls.tsx`
- `_hooks/`: `use-period.ts`
- `_actions/`: `set-theme-cookie.ts`

### Import updates

All moved files reference each other. Imports must be updated:
- Components importing hooks: `../_hooks/use-appointments` (relative within appointments)
- Components importing actions: `../_actions/get-by-date` (relative within appointments)
- Components importing shared admin components: `@/app/admin/_components/...` (absolute, unchanged)
- `appointments/page.tsx`: update import to local `_components/appointments-view`

### Verification

No external references to any moved file exist outside the appointments domain (confirmed via grep). Note: moved components do import from `@/components/` (shared UI like `appointment-card`, `appointment-skeleton`) — those stay in place and imports remain unchanged. No barrel/index files are needed.

---

## Part 2: Admin Dashboard

### Location

`src/app/admin/(protected)/page.tsx` — replace redirect with Suspense + async data component.

### Data

New service function `getDashboardSummary()` in `src/services/dashboard.ts` that queries in parallel:

1. **Today's appointments** — count + next upcoming (time, client name)
2. **Pending orders** — count of orders with status PENDING or PROCESSING
3. **Today's revenue** — sum of payments with `paidAt` today

### Architecture

The dashboard has no interactivity (no state, no event handlers), so it can be fully server-rendered:

```
page.tsx (sync, Suspense + skeleton)
  └── dashboard-data.tsx (async server component, calls action, renders cards directly)
```

Action: `getDashboardAction()` in `admin/_actions/get-dashboard.ts` (page-level, not appointment-specific).

Service: `src/services/dashboard.ts` — `getDashboardSummary()`.

### UI

Three stat cards in a row, similar to the existing `StatCard` pattern but without delta/period (it's "right now" data):

- **Turnos hoy** — count, next appointment time if any
- **Pedidos pendientes** — count of PENDING + PROCESSING orders
- **Ingresos del día** — formatted ARS amount

Simple, no charts, no complexity. The page serves as a landing that gives the owner a quick glance before navigating deeper.

---

## Part 3: Minor Cleanup

Remove unused properties from `use-create-form.ts` return object:

```typescript
// REMOVE these from the return:
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

These are placeholder properties that match a shared interface with the public booking form but are never consumed by the admin create appointment component.

---

## Out of scope

- Refactoring the components themselves (they're already clean with logic in hooks)
- Changing business logic
- Modifying the public appointments flow

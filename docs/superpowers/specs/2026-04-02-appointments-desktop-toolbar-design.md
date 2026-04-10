# Appointments Desktop Toolbar Design

## Goal

Replace the empty whitespace in the appointments desktop header with a full-width toolbar containing search, date, filters, view mode controls, and quick actions — desktop only (lg+).

## Layout

```
[Title block] | [Search input] ─────────── spacer ─────── | [Date][Cancelled] | [⊞][☰][≡] | [+New][↺][⚙️]
```

All in a single `h-19` row, consistent with the existing desktop header height.

## Controls

| Control | Type | Behaviour |
|---|---|---|
| Search input | `<input>` with magnifier icon | Client-side filter on already-fetched appointments. Matches: `telephone.endsWith(query.slice(-10))`, `payerEmail.includes(query)`, `payerName.includes(query)`, `id.endsWith(query.replace('#','').toUpperCase())` |
| Date chip | Button (opens Popover) | Shows current selected date label (`Hoy` / `dd MMM`). Opens `AppointmentCalendarBody` popover — same calendar already used in the dropdown |
| Cancelados chip | Toggle button | Calls `vm.toggleShowCancelled()`. Active state when `vm.showCancelled === true` |
| View mode (3 icon buttons) | Icon toggle group | `⊞` cards-square · `☰` cards-flat · `≡` table. Active button has filled/highlighted style. Calls `onViewModeChange` — same prop as the dropdown |
| + Nuevo turno | Primary button | Opens `AdminCreateAppointment` modal |
| ↺ Refresh | Icon button | Calls `vm.handleRefresh()`. Spins icon while `vm.isLoading` |
| ⚙️ Settings | `AppointmentsMobileDropdown` | Existing component, unchanged. Still controls theme, show/hide cancelled (redundant but kept for consistency), and view mode radio group |

## Architecture

### New file
`src/app/admin/(protected)/appointments/_components/appointments-desktop-toolbar.tsx`
- Client component
- Uses `useAdminAppointments` for `vm.selectedDate`, `vm.showCancelled`, `vm.handleRefresh`, `vm.toggleShowCancelled`, `vm.isLoading`
- Props: `viewMode`, `onViewModeChange`, `searchQuery`, `onSearchChange`
- The date picker reuses `AppointmentCalendarBody` inside a `Popover` (already exists, not duplicated)
- The create modal reuses `AdminCreateAppointment` (already exists)

### Modified files
- `appointments-view.tsx`:
  - Add `searchQuery: string` state (default `""`)
  - Compute `filteredAppointments` from `vm.appointments` filtered by `searchQuery`
  - Render `AppointmentsDesktopToolbar` as `desktopControls` prop (passing viewMode, onViewModeChange, searchQuery, onSearchChange)
  - Render `AppointmentsMobileDropdown` as `mobileControls` only
  - All card/table renders use `filteredAppointments` instead of `vm.appointments`

### Unchanged files
- `admin-page-header.tsx` — no changes
- `appointments-mobile-dropdown.tsx` — no changes
- `use-appointments.ts` — no changes

## Search logic (client-side only, no new server actions)

```ts
const q = searchQuery.trim().toLowerCase();
const filteredAppointments = q
  ? vm.appointments.filter((a) => {
      const phone = a.telephone.slice(-10);
      const id = a.id.slice(-6).toUpperCase();
      const name = (a.payerName ?? "").toLowerCase();
      const email = (a.payerEmail ?? "").toLowerCase();
      const clean = q.replace(/^#/, "");
      return (
        phone.includes(clean) ||
        id.includes(clean.toUpperCase()) ||
        name.includes(q) ||
        email.includes(q)
      );
    })
  : vm.appointments;
```

## Styling notes

- Toolbar controls use the existing design tokens: `bg-white dark:bg-zinc-900`, `border-border-subtle dark:border-zinc-700`, `text-gold` for active states
- Active date/cancelled chips: `bg-gold/10 border-gold/25 text-gold`
- Active view button: `bg-zinc-100 dark:bg-zinc-800`
- Search input: same style as other inputs in the admin panel
- Vertical dividers between groups: `w-px h-6 bg-border-subtle dark:bg-zinc-700`
- All controls `h-8` for vertical consistency

## Desktop-only constraint

`AppointmentsDesktopToolbar` renders with `hidden lg:flex` wrapper — never visible on mobile/tablet. The mobile topbar continues to use `AppointmentsMobileDropdown` unchanged.

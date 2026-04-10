# Global Appointment Search — Spec

**Date:** 2026-04-10
**Status:** Approved

## Summary

Replace the current client-side, single-day search with a global search that queries all appointments across all dates. Results appear in a dropdown anchored below the search input, grouped by date, with real-time DB queries.

---

## Problem

The current search in `/admin/appointments` filters only the appointments loaded for the selected day (Zustand state). If the user searches for a phone number that has appointments on other days, they get "Sin resultados" even though matching records exist in the DB.

---

## Design

### UX Behaviour

- **Trigger:** Dropdown appears when the input has ≥ 5 characters. Disappears when empty or on ESC / click-outside.
- **Debounce:** 300ms after last keystroke before firing the server request (avoids a DB hit on every character).
- **Input stays connected:** The top border of the input merges visually with the dropdown (border-radius 8px 8px 0 0 on input, 0 0 10px 10px on dropdown).
- **Result structure (per group):**
  ```
  Fecha en dorado (e.g. "Mié 2 de abr")
    ├── [teléfono | email | nombre]  ·  hora  ·  [badge estado]
    └── ...
  ```
  - Identity priority: teléfono → email → nombre (first non-null)
  - Results ordered chronologically (date asc, time asc within date)
  - Maximum 20 results total; if truncated, show "Mostrando los primeros 20 resultados"
- **Click on result:** Navigates to that day (`vm.handleDateSelect(date)`) and closes the dropdown.
- **ESC or click outside:** Closes the dropdown, preserves the typed query in the input.
- **Loading state:** Small spinner inside the input (replacing the search icon) during the debounce + fetch.
- **Empty state:** "Sin resultados para «query»" inside the dropdown.
- **Light/dark:** Fully themed (zinc scale for dark, warm neutrals for light, gold accents for dates and Pending badge).

### Responsive

- **Desktop (toolbar):** Dropdown is anchored to the search input in `AppointmentsDesktopToolbar`. Max-width matches the input (currently `max-w-100`).
- **Mobile:** The search input lives inside `AppointmentsMobileDropdown` — the dropdown appears below it, full-width within the sheet/popover.

---

## Architecture

### New service function — `src/services/get.ts`

```typescript
export async function searchAppointments(
  query: string,
  limit = 20,
): Promise<Appointment[]>
```

Prisma query using `OR` across:
- `telephone`: `contains: query` (last-10-digits approach: `endsWith: query.slice(-10)`)
- `payerEmail`: `contains: query, mode: "insensitive"`
- `payerName`: `contains: query, mode: "insensitive"`
- `id`: `endsWith: query.replace(/^#/, "").toUpperCase()` (short ID match)

Results ordered by `date asc`, `time asc`. Limit 20.

### New server action — `src/app/admin/(protected)/appointments/_actions/search-appointments.ts`

Thin wrapper around `searchAppointments`.

### New hook — `src/app/admin/(protected)/appointments/_hooks/use-appointment-search.ts`

```typescript
function useAppointmentSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Appointment[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // debounced fetch, ≥5 chars to trigger
  // returns { query, results, isSearching, isOpen, setQuery, close }
}
```

### UI component — `src/app/admin/(protected)/appointments/_components/global-search-input.tsx`

Self-contained component that renders:
- The `<input>` (replaces the raw input currently in `AppointmentsDesktopToolbar`)
- The dropdown (using `useAppointmentSearch` hook)

Props:
```typescript
interface GlobalSearchInputProps {
  className?: string
}
```

No `searchQuery`/`onSearchChange` props needed — the component is self-contained. The current-day filter in `appointments-view.tsx` (line 86–101) is removed; local filtering is replaced by this global search.

### Changes to existing files

| File | Change |
|---|---|
| `appointments-desktop-toolbar.tsx` | Remove `searchQuery`/`onSearchChange` props; render `<GlobalSearchInput />` instead of the raw input |
| `appointments-view.tsx` | Remove `searchQuery` state + `filteredAppointments` local filter; pass `vm.appointments` directly to the view; remove `searchQuery`/`onSearchChange` from toolbar props |
| `appointments-mobile-dropdown.tsx` | Add `<GlobalSearchInput />` inside the mobile sheet |
| `src/services/get.ts` | Add `searchAppointments()` |

---

## Edge Cases

- Query with `#` prefix → strip `#` for ID matching
- Phone with country code → match on last 10 digits (`endsWith`)
- No results → show empty state message inside dropdown (not "Sin turnos" in the main area)
- Cancelled appointments → included in search results (admin needs to find them)
- Very fast typing → debounce ensures only one in-flight request at a time; abort previous if new fires

---

## Out of Scope

- Keyboard navigation within dropdown (arrow keys) — nice to have, not now
- Highlighting matched text in results — not now
- Saving search history — not now

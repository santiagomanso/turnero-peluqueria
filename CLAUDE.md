# CLAUDE.md — Coding Conventions for Turnero Peluquería

This file contains the development conventions for this project. Read it before making any changes.

---

## STACK

- **Next.js 16** (App Router), **React 19**, **TypeScript strict**
- **Prisma 7** + **PostgreSQL (Neon)**
- **TailwindCSS v4** — see Tailwind rules below
- **shadcn/ui** + **Radix UI** primitives
- **Framer Motion** for animations
- **Zustand v5** for client state
- **pnpm** as package manager

---

## ARCHITECTURE RULES

### 1. Server Actions are thin wrappers — business logic lives in `/services`

Actions (`src/app/**/_actions/*.ts`) must only:
- Call a function from `src/services/`
- Optionally wrap in try/catch

```typescript
// ✅ CORRECT — action is a thin wrapper
"use server";
import { getPayments } from "@/services/payments";

export async function getPaymentsAction(specificDate: string) {
  return await getPayments(specificDate);
}

// ❌ WRONG — DB logic inside action
"use server";
import { db } from "@/lib/prisma";

export async function getPaymentsAction(specificDate: string) {
  return await db.payment.findMany({ where: { ... } }); // No
}
```

All Prisma/DB queries go in `src/services/`. New service files follow the domain name (e.g., `payments.ts`, `shop.ts`, `appointments.ts`).

### 2. Never make `page.tsx` async — use Suspense + async server component

```tsx
// ✅ CORRECT
// page.tsx — non-async
export default function ShopPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopData />
    </Suspense>
  );
}

// shop-data.tsx — async server component
export default async function ShopData() {
  const data = await someAction();
  return <ShopView data={data} />;
}

// ❌ WRONG
export default async function ShopPage() {
  const data = await someAction(); // never in page.tsx
  return <ShopView data={data} />;
}
```

### 3. No Prisma imports in components or hooks

Components never import from `@prisma/client` or `@/lib/prisma`. The chain is always:
`Component → Action (server action) → Service (Prisma query)`

### 4. Desktop controls use the same component as mobile

All admin pages pass the same dropdown component to both `desktopControls` and `mobileControls` props in `Navbar`. There are no separate icon buttons for desktop.

```tsx
// ✅ CORRECT — same dropdown for both
<AdminLayout
  desktopControls={<PaymentsMobileDropdown {...props} />}
  mobileControls={<PaymentsMobileDropdown {...props} />}
/>
```

---

## COMPONENT CONVENTIONS

### Break large components into smaller focused ones

- If a component is > ~150 lines, consider extracting sub-components
- Name sub-components by their role: `ProductCard`, `CategorySwitcher`, `PaymentsCalendarBody`
- Keep client/server boundary clear: server components fetch data, client components handle interaction

### Extract business logic to custom hooks

```typescript
// ✅ Extract to hook
function usePayments(specificDate: string) {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // ...fetch logic
  return { payments, isLoading, refresh };
}

// ❌ Keep in component
function PaymentsView() {
  const [payments, setPayments] = useState([]);
  // ...50 lines of fetch logic inline
}
```

### Check for existing shadcn components before using native HTML

Always prefer shadcn/ui primitives: `Button`, `Dialog`, `DropdownMenu`, `Popover`, `Select`, `Switch`, `Badge`, etc. Only use native elements (`<button>`, `<select>`) when shadcn has no equivalent.

---

## TAILWIND V4 RULES

### 1. Gradient classes renamed

```
❌ bg-gradient-to-br
✅ bg-linear-to-br
```

### 2. `text-base` is ambiguous

In this project `--color-base` is defined in the theme, making `text-base` a color utility (not font-size). Use explicit size tokens:
```
❌ text-base (resolves to color, not 1rem)
✅ text-sm / text-lg / text-xl / etc.
```

### 3. `hidden` + `flex` conflict

```
❌ flex hidden lg:flex   (both set display — conflict)
✅ hidden lg:flex        (hidden by default, flex at lg+)
```

### 4. No arbitrary values if a scale value exists

```
❌ text-[0.875rem]
✅ text-sm
```

### 5. Dark mode uses `dark:` prefix with zinc scale

```typescript
// Pattern for admin components:
className="bg-white dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800"
```

---

## TYPESCRIPT CONVENTIONS

### `as const` for string literal types in framer-motion

```typescript
// ❌ type: "spring" — inferred as string, not AnimationGeneratorType
const variants: Variants = {
  animate: { transition: { type: "spring" } }
}

// ✅
const variants: Variants = {
  animate: { transition: { type: "spring" as const } }
}
```

### Avoid `any` — use proper types

- Import types from `src/types/` first
- Use Prisma-generated types for DB results
- Use `Record<K, V>` instead of `{ [key: string]: V }` for readability

---

## TIMEZONE — CRITICAL

**Always use Argentina timezone (UTC-3, no DST).**

```typescript
import { formatInTimeZone } from "date-fns-tz";

const TZ = "America/Argentina/Buenos_Aires";

// Display a date in Argentina time
formatInTimeZone(date, TZ, "dd/MM/yyyy HH:mm")

// Check if a YYYY-MM-DD string is today in Argentina
import { isTodayFromISO } from "@/lib/format-date";
isTodayFromISO("2025-12-25") // → true/false
```

**Never use `new Date().toLocaleDateString()` or `new Date().toISOString().slice(0,10)`** — they use the server's timezone (UTC), not Argentina's.

---

## FORMS

- Use **React Hook Form + Zod + @hookform/resolvers**
- Define schema with `z.object(...)` before the component
- Use `useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })`

---

## WHATSAPP INTEGRATION

### Owner notification functions (`src/services/whatsapp.ts`)

Always use template functions for notifying the owner (not `sendTextMessage`):

```typescript
sendOwnerClientContact(clientPhone)        // client wants to talk (no message)
sendOwnerClientMessage(clientPhone, msg)   // client left a message
sendOwnerAppointmentModified(clientPhone)  // appointment modified successfully
```

`sendTextMessage` only works within Meta's 24h conversation window. Templates work anytime.

### Phone number lookup

Phones are stored with international prefix (e.g., `5493794800756`). Match via `endsWith`:
```typescript
telephone: { endsWith: telephone.slice(-10) }
```

---

## DATE PATTERNS

```typescript
// Store dates in DB as UTC with T12:00:00.000Z to avoid timezone shift
const day = new Date(dateString + "T12:00:00.000Z");

// Format for display in Argentina
import { format } from "date-fns";
import { es } from "date-fns/locale";
format(date, "EEEE dd 'de' MMMM", { locale: es })

// YYYY-MM-DD string of today in Argentina
import { formatInTimeZone } from "date-fns-tz";
formatInTimeZone(new Date(), "America/Argentina/Buenos_Aires", "yyyy-MM-dd")
```

---

## NAMING CONVENTIONS

| Pattern | Convention |
| --- | --- |
| Server action files | `src/app/**/_actions/verb-noun.ts` |
| Service files | `src/services/domain.ts` |
| Client components | `component-name.tsx` (kebab-case) |
| Skeleton components | `component-name-skeleton.tsx` |
| Data-fetching wrappers | `component-name-data.tsx` |
| Zustand stores | `src/app/**/_store/use-noun.ts` or `src/store/use-noun.ts` |
| Types | `src/types/domain.ts`, exported as named types |

---

## HYDRATION MISMATCH PREVENTION

Radix UI components with portals (DropdownMenu, Dialog, Popover) that depend on client-only state must be wrapped in `dynamic(..., { ssr: false })`:

```typescript
const MyDropdown = dynamic(() => import("./my-dropdown"), { ssr: false });
```

---

## FILE TREE HIGHLIGHTS

```
src/
├── app/
│   ├── admin/
│   │   ├── _actions/          — server actions (thin wrappers)
│   │   ├── _components/       — shared admin components (sidebar, navbar, etc.)
│   │   └── (protected)/
│   │       ├── payments/      — historial de pagos por día
│   │       ├── shop/          — gestión de productos y pedidos
│   │       ├── metrics/       — métricas y gráficos
│   │       └── config/        — configuración horarios/descuentos
│   ├── shop/                  — tienda pública (bento grid + sub-páginas por categoría)
│   └── api/
│       └── webhooks/
│           ├── mercadopago/   — webhook MP (pagos)
│           └── whatsapp-chatbot/ — chatbot WA (turnos)
├── services/                  — TODA la lógica de DB aquí
│   ├── appointments.ts
│   ├── payments.ts
│   ├── shop.ts
│   └── whatsapp.ts
├── types/
│   ├── shop.ts                — Product, Order, SHOP_CATEGORIES
│   └── config.ts              — HoursConfig, DayKey, ALL_HOURS
└── lib/
    ├── shop-utils.ts          — categoryToSlug / slugToCategory
    ├── format-date.ts         — isTodayFromISO, formatDate
    └── format-phone.ts        — phone display utilities
```

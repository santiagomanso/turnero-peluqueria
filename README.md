# AI CONTEXT — Turnero Peluquería (Luckete Colorista)

## PROJECT OVERVIEW

A Next.js appointment booking web app for a hair salon called **Luckete Colorista**.
Users book appointments, pay via MercadoPago, and receive WhatsApp notifications.
The admin panel allows the salon owner to manage, create, and update appointments.

- **Production URL:** https://turnero-peluqueria.vercel.app
- **Stack:** Next.js 16, TypeScript, Prisma, PostgreSQL (Neon), TailwindCSS v4, Vercel
- **Package manager:** pnpm
- **Repo:** GitHub (deployed via Vercel)

---

## DATABASE (Neon PostgreSQL + Prisma)

### Appointment Schema

```prisma
model Appointment {
  id         String            @id @default(cuid())
  date       DateTime
  time       String
  telephone  String
  paymentId  String?
  status     AppointmentStatus @default(PENDING)
  createdAt  DateTime          @default(now())
  updatedAt  DateTime          @updatedAt
}

enum AppointmentStatus {
  PENDING
  PAID
}
```

### Key Notes

- `date` is stored as UTC midnight (e.g., `2026-02-27 00:00:00`). Always use `formatInTimeZone` from `date-fns-tz` with `"America/Argentina/Buenos_Aires"` to display correctly.
- `telephone` is stored in full Argentine format: `549XXXXXXXXXX`
- `status` starts as `PENDING` on creation, becomes `PAID` when webhook fires
- `paymentId` is the MercadoPago payment ID, set by webhook
- Admin-created appointments are `PENDING` by default and skip the payment flow

---

## PHONE NUMBER FORMATTING

### Utility: `src/lib/format-phone.ts`

```typescript
export function formatArgentinianPhone(telephone: string): string {
  const digits = telephone.replace(/\D/g, "");
  if (digits.startsWith("54")) return digits;
  return `549${digits}`;
}
```

### Usage

- **On creation:** Applied in `src/services/create.ts` before saving to DB
- **On update:** Applied in `src/services/update.ts` before saving to DB
- **On search:** Applied in `use-get-appointments.ts` hook before querying
- **On display:** Strip `549` prefix with `.replace(/^549/, "")` for user-facing inputs

---

## APPOINTMENT FLOW

### User Creation (Public)

1. User fills form (date → time → telephone → confirmation)
2. Hook calls `createPaymentPreferenceAction`
3. Action creates `PENDING` appointment in DB with `cuid` ID
4. Action creates MercadoPago preference with `external_reference = appointment.id`
5. User is redirected to MercadoPago checkout (`init_point`)
6. After payment, MP webhook fires → marks appointment as `PAID` + sends WhatsApp confirmation

### Admin Creation (Panel)

1. Admin fills dialog form (date → time → telephone — no payment step)
2. `createAdminAppointmentAction` creates `PENDING` appointment directly in DB
3. No MercadoPago preference is created
4. List refreshes automatically via zustand store

### Update Flow

- User goes to `/appointments/update/[id]`
- Same form as creation but in edit mode
- `updateAppointmentAction` → `updateAppointment` service
- Only updates `date`, `time`, `telephone` — never touches `status` or `paymentId`

### Status Update (Admin)

- Admin can change status from the appointment card dropdown (Pagado / Pendiente)
- `updateAppointmentStatusAction` in `src/app/admin/_actions/update-status.ts`
- Updates optimistically in UI, reverts on error

---

## ADMIN PANEL

### Auth

- JWT-based via `jose`, stored as cookie `admin_token`
- Middleware protects `/admin` routes (except `/admin/login`)
- `verifyAdminAction` / `logoutAdminAction` in `verify-admin-password.ts`

### State Management

- `useAdminAppointments` is a **zustand store** (singleton, shared across all components)
- Avoids duplicate fetches: `hasFetched` flag prevents re-fetching on page navigation
- Refresh button and post-creation both call `handleRefresh()` on the store

### Admin Components

| File                           | Purpose                                                              |
| ------------------------------ | -------------------------------------------------------------------- |
| `admin-dashboard.tsx`          | Layout shell, page switcher                                          |
| `admin-sidebar.tsx`            | Desktop sidebar + mobile topbar                                      |
| `admin-mobile-sheet.tsx`       | Mobile nav drawer (dynamic, ssr:false to prevent hydration mismatch) |
| `admin-appointments.tsx`       | Appointments grid + AppointmentControls                              |
| `admin-create-appointment.tsx` | Dialog form (3 steps: date → time → telephone)                       |
| `admin-metrics.tsx`            | Metrics page (charts, stat cards)                                    |
| `period-tabs.tsx`              | Period switcher for metrics                                          |

### Hydration Mismatch Prevention

Radix UI components (Sheet, Popover, Dialog) generate `aria-controls` IDs that differ between server and client. All such components are imported with `dynamic(..., { ssr: false })`:

- `AppointmentControls` — has `Popover` calendar
- `PeriodTabs` — has animated tabs
- `AdminMobileSheet` — has `Sheet` drawer
- `AdminCreateAppointment` — has `Dialog`

### Appointment Card (`src/components/appointment-card.tsx`)

- `InfoRowLeft` — icon + label on same line, value below (left column)
- `InfoRowRight` — label + icon reversed, value right-aligned (right column)
- `StatusBadge` — floats `absolute` top-right with `rotate-12`, only shown when `PENDING`
- Status dropdown — ghost button, optimistic update via `updateAppointmentStatusAction`
- Delete — `AlertDialog` confirmation before calling `deleteAppointmentAction`
- Animation — `framer-motion` slide-out on delete

---

## MERCADOPAGO INTEGRATION

### Credentials (Vercel env vars)

```
MP_ACCESS_TOKEN=...
MP_PUBLIC_KEY=...
MP_WEBHOOK_SECRET=...
```

### Preference config

```typescript
{
  items: [{ title: "Turno en Luckete Colorista", quantity: 1, unit_price: 1000 }],
  external_reference: appointmentId,
  statement_descriptor: "LUCKETE COLORISTA",
  back_urls: { success, failure, pending },
  notification_url: `${APP_URL}/api/webhooks/mercadopago`,
}
```

### Webhook endpoint: `/api/webhooks/mercadopago`

- POST handler, verifies `x-signature` HMAC SHA256
- On `approved`: updates DB status to `PAID` + sends WhatsApp confirmation

---

## WHATSAPP INTEGRATION

### Credentials (Vercel env vars)

```
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_PHONE_ID=976682535533891
```

### Templates (Meta approved, language: `es`)

1. **`appointment_confirmation_1`** — sent after payment approved
2. **`appointment_reminder_2`** — sent by cron the morning of the appointment

### IMPORTANT: Button URL Variables

- Button URL variables use `{{1}}` independently of body variables
- In API call: `{ type: "button", sub_type: "url", index: "0", parameters: [{ type: "text", text: appointmentId }] }`

---

## CRON JOB (Daily Reminders)

Runs at `0 10 * * *` UTC = 7:00 AM Argentina. Finds all `PAID` appointments for today and sends WhatsApp reminders.

- Endpoint: `/api/cron/reminder`
- Auth: `Authorization: Bearer ${CRON_SECRET}`

---

## TAILWIND v4 RULES

- `!important` modifier: `clase!` (not `!clase`)
- **Siempre usar clases canónicas en vez de valores arbitrarios** cuando exista equivalente. La escala base es 1 unidad = 4px. Ejemplos correctos: `h-17` en vez de `h-17`, `min-w-15` en vez de `min-w-[60px]`, `py-4.5` en vez de `py-[18px]`, `min-h-85` en vez de `min-h-[340px]`, `rotate-12` en vez de `rotate-[28deg]`. Solo usar `[valor]` si no existe equivalente canónico exacto.
- Design tokens: `text-gold`, `bg-gold`, `border-border-subtle`, `text-content`, `text-content-secondary`, `text-content-tertiary`, `text-content-quaternary`
- **`bg-gradient-to-br` se escribe `bg-linear-to-br` en Tailwind v4**

---

## FONTS

Configuradas globalmente en `src/app/layout.tsx` con `next/font/google`:

| Variable CSS            | Clase Tailwind       | Fuente         | Pesos           |
| ----------------------- | -------------------- | -------------- | --------------- |
| `--font-archivo`        | `font-archivo`       | Archivo        | 400,500,600,700 |
| `--font-archivo-black`  | `font-archivo-black` | Archivo        | 700,800,900     |
| `--font-dancing-script` | `font-dancingScript` | Dancing Script | 400,500,600,700 |
| `--font-heebo`          | `font-heebo`         | Heebo          | 400–900         |
| `--font-space-mono`     | `font-space-mono`    | Space Mono     | 400,700         |

Todas registradas en `globals.css` dentro de `@theme inline` como `--font-*: var(--font-*)`.

---

## ADMIN PANEL — DESIGN SYSTEM (Dark Mode)

### Color palette dark mode

| Elemento                 | Color             |
| ------------------------ | ----------------- |
| Outer background         | `bg-zinc-950`     |
| Card container / sidebar | `bg-zinc-900`     |
| Active cards / elevated  | `bg-zinc-800`     |
| Borders                  | `border-zinc-800` |
| Text primary             | `text-zinc-100`   |
| Text secondary           | `text-zinc-400`   |
| Text tertiary / muted    | `text-zinc-500`   |

### Layout structure (`src/app/admin/(protected)/layout.tsx`)

```
main (outer) — bg-white / dark:bg-zinc-900 en mobile; gradiente en md+
  └── div (container) — bg-white / dark:bg-zinc-900; border+shadow+rounded solo en md+
        ├── AdminSidebar (w-55, max-lg:hidden)
        └── main (content) — flex-1, overflow-y-auto, max-lg:pt-14
```

- Desktop: `md:h-[85vh]`, `md:max-w-5xl`, `md:rounded-2xl`
- Mobile/tablet: full screen, no outer padding, full-bleed cards

### Breakpoints admin

- **`lg`** = límite entre sidebar desktop y topbar mobile/tablet
  - `< lg` → topbar fija (`h-14`) + contenido `pt-14`
  - `>= lg` → sidebar izquierdo (`w-55`)
- Antes este límite era `md`, fue cambiado a `lg` en esta sesión

### Admin pages with sticky headers (desktop only, `max-lg:hidden`)

Todas las páginas (config, metrics, appointments) tienen un header sticky `h-19` (76px) alineado con la altura del logo en el sidebar.

---

## ADMIN PANEL — FILES DELIVERED THIS SESSION

Todos en `src/app/admin/_components/` salvo donde se indica:

| Archivo                            | Destino                      | Cambios clave                                                                                        |
| ---------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| `admin-sidebar.tsx`                | `src/app/admin/_components/` | Breakpoint `md→lg`, quitado toggle tema, `h-full`, Inicio movido al nav, solo Cerrar sesión abajo    |
| `admin-config.tsx`                 | `src/app/admin/_components/` | Cards mobile descuentos (Space Mono, pill status), tabla lg+, footer responsive, breakpoints `md→lg` |
| `admin-metrics.tsx`                | `src/app/admin/_components/` | Breakpoints mobile                                                                                   |
| `(protected)/layout.tsx`           | `src/app/admin/(protected)/` | Breakpoints `md→lg`, bg mobile unificado                                                             |
| `layout-root.tsx` (→ `layout.tsx`) | `src/app/layout.tsx`         | Agrega `Space_Mono` font                                                                             |
| `globals.css` (diff manual)        | `src/app/globals.css`        | Agrega `--font-space-mono: var(--font-space-mono)` en `@theme inline`                                |

---

## SEEDER

```bash
pnpm seed   # Creates 20 PENDING/PAID appointments for today
pnpm drop   # Deletes all appointments
```

File: `src/seeder.ts`. Uses `PrismaNeon` adapter directly with `dotenv/config`.

---

## KEY FILE STRUCTURE

```
src/
├── app/
│   ├── admin/
│   │   ├── _actions/
│   │   │   ├── create-admin-appointment.ts
│   │   │   ├── get-by-date.ts
│   │   │   ├── update-status.ts
│   │   │   └── verify-admin-password.ts
│   │   ├── _components/
│   │   │   ├── admin-appointments.tsx
│   │   │   ├── admin-config.tsx          ← modificado esta sesión
│   │   │   ├── admin-create-appointment.tsx
│   │   │   ├── admin-dashboard.tsx
│   │   │   ├── admin-metrics.tsx         ← modificado esta sesión
│   │   │   ├── admin-mobile-sheet.tsx
│   │   │   ├── admin-sidebar.tsx         ← modificado esta sesión
│   │   │   ├── admin-theme-provider.tsx
│   │   │   └── period-tabs.tsx
│   │   ├── _hooks/
│   │   │   ├── use-admin-appointments.ts
│   │   │   ├── use-admin-create-form.ts
│   │   │   └── use-period.ts
│   │   └── (protected)/
│   │       └── layout.tsx                ← modificado esta sesión
│   ├── layout.tsx                        ← modificado esta sesión (Space Mono)
│   └── globals.css                       ← modificado esta sesión (font var)
```

---

## ENVIRONMENT VARIABLES

```
DATABASE_URL=...
MP_ACCESS_TOKEN=...
MP_PUBLIC_KEY=...
MP_WEBHOOK_SECRET=...
NEXT_PUBLIC_APP_URL=https://turnero-peluqueria.vercel.app
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_PHONE_ID=976682535533891
CRON_SECRET=...
```

---

## TIMEZONE

- Argentina: **UTC-3**, no daylight saving
- Timezone: `"America/Argentina/Buenos_Aires"`
- DB stores dates as UTC midnight
- Always use `formatInTimeZone(date, "America/Argentina/Buenos_Aires", "dd/MM/yyyy")` from `date-fns-tz`
- Cron: `0 10 * * *` UTC = 7:00 AM Argentina

---

## KNOWN ISSUES / DECISIONS

1. **Phone normalization:** Old appointments may have `3794XXXXXX` instead of `549...`. `formatArgentinianPhone` handles both.
2. **Webhook is primary:** `auto_return` doesn't work on iOS/Android native apps. Webhook is the reliable mechanism; `back_url` is fallback only.
3. **Dead code:** `src/app/appointments/_actions/create.ts` (`createAppointmentAction`) is unused.
4. **Hydration mismatch:** All Radix UI components with portals must be wrapped in `dynamic(..., { ssr: false })`.
5. **Calendar state:** `isCalendarOpen` was removed from zustand store — lives in local `useState` inside `AppointmentControls`.
6. **hasFetched flag:** Prevents re-fetching on every page navigation. Only `handleRefresh()` bypasses it.
7. **Theme toggle removed from sidebar:** El botón de modo claro/oscuro fue quitado del sidebar — el toggle de tema vive únicamente en la sección "Apariencia" de `admin-config.tsx`.

---

---

# ✅ RESUELTO — Alineación de bordes sidebar / footer

## Descripción

En la vista desktop (`>= lg`), el sidebar bottom section ("Cerrar sesión") y el footer de `admin-config` tienen su borde superior alineado horizontalmente.

## Solución aplicada

Se le dio `h-17` fijo con `flex items-center` a **ambos** elementos:

```tsx
// admin-sidebar.tsx — sección inferior
<div className="px-3 h-17 border-t border-border-subtle dark:border-zinc-800 flex items-center shrink-0">

// admin-config.tsx — footer
<div className="sticky bottom-0 ... h-17 flex items-center justify-between gap-3">
```

`68px` = `py-4` (16+16) + botón `size="sm"` (`h-9` = 36px). Ambos elementos tienen la misma altura fija, por lo que los bordes superiores coinciden exactamente independientemente del contenido interior.

---

---

# 🔜 PRÓXIMAS TAREAS

## 1. Tema oscuro/claro en `admin-metrics.tsx` y `admin-appointments.tsx`

### Contexto

El toggle de tema (claro / oscuro / sistema) ya existe y funciona en `admin-config.tsx`, dentro de la sección "Apariencia". Está implementado via `admin-theme-provider.tsx` que lee/escribe la cookie `admin-theme` y aplica la clase `.dark` en el `<html>`.

Lo que falta es que `admin-metrics.tsx` y `admin-appointments.tsx` usen correctamente los tokens dark mode (`dark:bg-zinc-900`, `dark:text-zinc-100`, etc.) de forma consistente con `admin-config.tsx`.

### Lo que hay que revisar

- Que todos los colores hardcodeados en esos componentes usen tokens semánticos (`dark:` variants) igual que en `admin-config`
- Que los cards, tablas, gráficos y badges respondan al tema
- Referencia de paleta dark: ver sección **ADMIN PANEL — DESIGN SYSTEM (Dark Mode)** de este README

### Archivos involucrados

- `src/app/admin/_components/admin-metrics.tsx`
- `src/app/admin/_components/admin-appointments.tsx`
- Posiblemente: `src/components/appointment-card.tsx`

---

## 2. Persistir configuración en base de datos (nueva tabla)

### Contexto

Actualmente `admin-config.tsx` maneja el estado de configuración (días disponibles, horarios, precio de reserva, códigos de descuento, tema) de forma local en React state. Los cambios **no se persisten** en ninguna tabla de la BD.

### Lo que hay que hacer

1. **Definir schema Prisma** — nueva(s) tabla(s) para guardar la configuración del salón. Propuesta inicial:

```prisma
model SalonConfig {
  id           String   @id @default(cuid())
  availableDays    Int[]    // días activos (0=Dom, 1=Lun, ..., 6=Sab)
  availableHours   Json     // array de { time: string, enabled: bool, concurrent: number }
  reservationPrice Int      // precio en ARS
  updatedAt    DateTime @updatedAt
}

model DiscountCode {
  id          String   @id @default(cuid())
  code        String   @unique
  discount    Int      // porcentaje
  validFrom   DateTime
  validUntil  DateTime
  createdAt   DateTime @default(now())
}
```

2. **Crear server actions** para leer y guardar config
3. **Conectar `admin-config.tsx`** — cargar estado inicial desde BD, guardar al presionar "Guardar Cambios"
4. **Migración Neon** — `npx prisma migrate dev`

### Consideraciones

- El modelo `SalonConfig` debería ser un singleton (un solo registro, siempre el mismo `id`, upsert en save)
- Los `DiscountCode` ya tienen su propia tabla con CRUD independiente
- La acción de guardado debe ser una Server Action con revalidación de cache si se usa en SSR

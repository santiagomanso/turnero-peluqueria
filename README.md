# AI CONTEXT — Turnero Peluquería (Luckete Colorista)

## PROJECT OVERVIEW

A Next.js appointment booking web app for a hair salon called **Luckete Colorista**.
Users book appointments, pay via MercadoPago, and receive WhatsApp notifications.
The admin panel allows the salon owner to manage, create, and update appointments.

- **Production URL:** https://turnero-peluqueria.vercel.app
- **Stack:** Next.js 16, TypeScript, Prisma, PostgreSQL (Neon), TailwindCSS v4, Vercel
- **Package manager:** pnpm
- **Repo:** GitHub (deployed via Vercel)

### Admin Panel Features

- Ver, crear, modificar y cancelar turnos
- Cambiar estado de turnos (PENDING → PAID → CANCELLED)
- Enviar mensajes WhatsApp a clientes via templates aprobados (sobre el turno, desde Luckete, general)
- Configurar días disponibles para reservas (por día de semana)
- Configurar horarios disponibles por día, con slots de media hora y máximo de reservas simultáneas
- Gestionar códigos de descuento (crear, activar/desactivar, eliminar)
- Configurar precio base del turno
- Cambiar tema visual (light/dark)
- Ver métricas: ingresos, conversión, crecimiento, top horas, distribución por día

A Next.js appointment booking web app for a hair salon called **Luckete Colorista**.
Users book appointments, pay via MercadoPago, and receive WhatsApp notifications.
The admin panel allows the salon owner to manage, create, and update appointments.

- **Production URL:** https://turnero-peluqueria.vercel.app
- **Stack:** Next.js 16, React 19, TypeScript, Prisma 7, PostgreSQL (Neon), TailwindCSS v4, Vercel
- **UI:** Radix UI, shadcn/ui, Lucide React, Framer Motion, Recharts, Vaul, Sonner
- **Forms:** React Hook Form + Zod + @hookform/resolvers
- **Date/Time:** date-fns, date-fns-tz, react-day-picker
- **Auth:** jose (JWT)
- **Payments:** mercadopago SDK v2
- **Phone:** libphonenumber-js
- **State:** Zustand v5
- **Package manager:** pnpm
- **Repo:** GitHub (deployed via Vercel)

---

## FILE TREE

```
├── .env
├── .gitignore
├── .prettierrc
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── prisma
│   └── schema.prisma
├── prisma.config.ts
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── logo.png
│   ├── logo2.jpg
│   ├── mercadopago.png
│   ├── MP_RGB_HANDSHAKE_pluma_horizontal.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── README.md
├── src
│   ├── .DS_Store
│   ├── app
│   │   ├── .DS_Store
│   │   ├── admin
│   │   │   ├── _actions
│   │   │   │   ├── create-admin-appointment.ts
│   │   │   │   ├── get-by-date.ts
│   │   │   │   ├── get-config.ts
│   │   │   │   ├── get-metrics.ts
│   │   │   │   ├── save-config.ts
│   │   │   │   ├── set-theme-cookie.ts
│   │   │   │   ├── update-status.ts
│   │   │   │   └── verify-admin-password.ts
│   │   │   ├── _components
│   │   │   │   ├── admin-appointments-controls.tsx
│   │   │   │   ├── admin-appointments.tsx
│   │   │   │   ├── admin-create-appointment.tsx
│   │   │   │   ├── admin-mobile-sheet.tsx
│   │   │   │   ├── admin-sidebar.tsx
│   │   │   │   ├── admin-theme-provider.tsx
│   │   │   │   ├── appointments-mobile-controls.tsx
│   │   │   │   ├── period-tabs.tsx
│   │   │   │   └── sidebar-metrics-mobile-controls.tsx.tsx
│   │   │   ├── _hooks
│   │   │   │   ├── use-admin-appointments.ts
│   │   │   │   ├── use-admin-create-form.ts
│   │   │   │   └── use-period.ts
│   │   │   ├── .DS_Store
│   │   │   ├── (protected)
│   │   │   │   ├── appointments
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── config
│   │   │   │   │   ├── _components
│   │   │   │   │   │   ├── available-days.tsx
│   │   │   │   │   │   ├── available-hours.tsx
│   │   │   │   │   │   ├── booking-price.tsx
│   │   │   │   │   │   ├── config-view.tsx
│   │   │   │   │   │   ├── discount-codes.tsx
│   │   │   │   │   │   └── theme-switcher.tsx
│   │   │   │   │   ├── _hooks
│   │   │   │   │   │   └── use-config-store.ts
│   │   │   │   │   ├── .DS_Store
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── metrics
│   │   │   │   │   ├── _components
│   │   │   │   │   │   ├── conversion.tsx
│   │   │   │   │   │   ├── day-chart.tsx
│   │   │   │   │   │   ├── growth.tsx
│   │   │   │   │   │   ├── metrics-view.tsx
│   │   │   │   │   │   ├── stat-card.tsx
│   │   │   │   │   │   └── top-hours.tsx
│   │   │   │   │   ├── _hooks
│   │   │   │   │   │   └── use-metrics-store.ts
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── login
│   │   │       ├── _components
│   │   │       │   └── login-form.tsx
│   │   │       └── page.tsx
│   │   ├── api
│   │   │   ├── cron
│   │   │   │   └── reminder
│   │   │   │       └── route.ts
│   │   │   └── webhooks
│   │   │       └── mercadopago
│   │   │           └── route.ts
│   │   ├── appointments
│   │   │   ├── _actions
│   │   │   │   ├── delete.ts
│   │   │   │   ├── get-availability.ts
│   │   │   │   ├── get-by-id.ts
│   │   │   │   ├── get-by-phone.ts
│   │   │   │   ├── mercadopago.ts
│   │   │   │   ├── update.ts
│   │   │   │   └── validate-discount.ts
│   │   │   ├── _hooks
│   │   │   │   ├── use-create-appointment-form.ts
│   │   │   │   └── use-get-appointment.ts
│   │   │   ├── .DS_Store
│   │   │   ├── [id]
│   │   │   │   └── page.tsx
│   │   │   ├── get
│   │   │   │   ├── _components
│   │   │   │   │   └── get-appointments.tsx
│   │   │   │   ├── .DS_Store
│   │   │   │   └── page.tsx
│   │   │   ├── new
│   │   │   │   ├── _components
│   │   │   │   │   ├── bottom-navigation-buttons.tsx
│   │   │   │   │   ├── confirmation-step.tsx
│   │   │   │   │   ├── create-appointment-form.tsx
│   │   │   │   │   ├── create-appointment-view.tsx
│   │   │   │   │   ├── date-step.tsx
│   │   │   │   │   ├── hour-step.tsx
│   │   │   │   │   ├── progress-bar.tsx
│   │   │   │   │   └── telephone-step.tsx
│   │   │   │   ├── .DS_Store
│   │   │   │   ├── page.tsx
│   │   │   │   └── success
│   │   │   │       └── page.tsx
│   │   │   └── update
│   │   │       ├── _components
│   │   │       │   └── update-appointment-view.tsx
│   │   │       ├── .DS_Store
│   │   │       └── [id]
│   │   │           └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── shop
│   │       ├── _components
│   │       │   └── shop-content.tsx
│   │       └── page.tsx
│   ├── components
│   │   ├── appointment-card.tsx
│   │   ├── appointment-skeleton.tsx
│   │   ├── header.tsx
│   │   ├── home-link.tsx
│   │   ├── navbar.tsx
│   │   ├── public-theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   └── ui
│   │       ├── alert-dialog.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── collapsible.tsx
│   │       ├── container.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── field.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── popover.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sonner.tsx
│   │       ├── switch.tsx
│   │       └── table.tsx
│   ├── hooks
│   │   └── use-media-query.ts
│   ├── lib
│   │   ├── db.ts
│   │   ├── format-date.ts
│   │   ├── format-phone.ts
│   │   └── utils.ts
│   ├── middleware.ts
│   ├── seeder.ts
│   ├── services
│   │   ├── config.ts
│   │   ├── create.ts
│   │   ├── delete.ts
│   │   ├── get.ts
│   │   ├── metrics.ts
│   │   ├── update.ts
│   │   └── whatsapp.ts
│   └── types
│       ├── appointment.ts
│       ├── config.ts
│       ├── css.d.ts
│       └── metrics.ts
├── tsconfig.json
└── vercel.json
```

---

## DATABASE (Neon PostgreSQL + Prisma)

### Schema Prisma (estado actual)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

enum AppointmentStatus {
  PENDING
  PAID
  CANCELLED
}

model Appointment {
  id         String            @id @default(cuid())
  date       DateTime
  time       String
  telephone  String
  price      Int               @default(0)
  status     AppointmentStatus @default(PENDING)
  payerName  String?
  payerEmail String?
  payment    Payment?
  createdAt  DateTime          @default(now())
  updatedAt  DateTime          @updatedAt
  @@map("appointments")
}

model Payment {
  id            String      @id @default(cuid())
  appointmentId String      @unique
  appointment   Appointment @relation(fields: [appointmentId], references: [id])
  mercadopagoId String
  amount        Int
  status        String
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  @@map("payments")
}

model Config {
  id            String   @id @default("singleton")
  days          Json
  hours         Json
  bookingCost   Int
  discountCodes Json     @default("[]")
  updatedAt     DateTime @updatedAt
  @@map("config")
}
```

### Key Notes

- `date` stored as UTC midnight. Always use `formatInTimeZone` from `date-fns-tz` with `"America/Argentina/Buenos_Aires"`.
- `telephone` stored as `549XXXXXXXXXX`. Strip prefix for display.
- `status` enum: `PENDING` | `PAID` | `CANCELLED`
- `price` field (Int, default 0) — set from `bookingCost` in Config at creation time.
- `Payment` table linked 1:1 with Appointment.
- `Config` is a singleton (`id = "singleton"`), saved via upsert.

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

### Display Rules

- **Store:** `549XXXXXXXXXX`
- **Card display nombre:** `appointment.payerName ?? appointment.payerEmail ?? "Sin nombre"`
- **Card display teléfono:** `appointment.telephone.slice(-10)` → últimos 10 dígitos (e.g. `3794800756`)
- **AlertDialog confirm:** muestra teléfono completo
- **WhatsApp links:** usa `appointment.telephone` completo

---

## APPOINTMENT FLOW

### User Creation (Public)

1. User fills form (date → time → telephone → confirmation)
2. Hook calls `createPaymentPreferenceAction`
3. Action reads `bookingCost` from Config, creates `PENDING` appointment with `price: bookingCost`
4. Action creates MercadoPago preference with `external_reference = appointment.id`
5. User redirected to MP checkout (`init_point`)
6. After payment, MP webhook → marks `PAID`, creates `Payment` record, saves `payerName`/`payerEmail`, sends WhatsApp

### Admin Creation (Panel)

1. Admin fills dialog (date → time → telephone)
2. `createAdminAppointmentAction` → `PENDING` appointment, no MP preference
3. List refreshes via zustand store

### Status Update (Admin)

- Admin changes status from card dropdown
- `updateAppointmentStatusAction` in `src/app/admin/_actions/update-status.ts`
- Optimistic update, reverts on error

---

## ADMIN PANEL

### Auth

- JWT via `jose`, cookie `admin_token`
- Middleware protects `/admin` routes (except `/admin/login`)

### State Management

- **`useAdminAppointments`** — zustand singleton, `hasFetched` previene re-fetch, `handleRefresh()` lo bypasea
- **`useConfigStore`** — `fetch()` solo si `!hasFetched`, `update(data)` para sincronizar localmente
- **`useMetricsStore`** — cachea por período (`Partial<Record<Period, PeriodData>>`), `fetch(period)` condicional, `refresh(period)` siempre fetcha

### Admin Components

| File                                  | Purpose                                                                    |
| ------------------------------------- | -------------------------------------------------------------------------- |
| `admin-sidebar.tsx`                   | Desktop sidebar + mobile topbar (breakpoint `lg`)                          |
| `admin-mobile-sheet.tsx`              | Mobile nav drawer (`dynamic ssr:false`)                                    |
| `appointments-mobile-controls.tsx`    | Controls del topbar mobile en página Turnos                                |
| `sidebar-metrics-mobile-controls.tsx` | Controls del topbar mobile en página Métricas (dropdown período + refresh) |
| `admin-appointments.tsx`              | Grid de turnos                                                             |
| `admin-appointments-controls.tsx`     | Controls desktop: `[+] [↻] [🌙] [📅]`                                      |
| `admin-create-appointment.tsx`        | Dialog 3 pasos (date → time → telephone)                                   |
| `period-tabs.tsx`                     | Selector período métricas desktop (`h-9` fijo)                             |
| `admin-theme-provider.tsx`            | Lee/escribe cookie `admin-theme`, aplica `.dark` en `<html>`               |

### Layout Structure (`src/app/admin/(protected)/layout.tsx`)

```
main (outer) — bg-white / dark:bg-zinc-900 mobile; gradiente md+
  └── div (container) — border+shadow+rounded solo md+
        ├── AdminSidebar (w-55, max-lg:hidden)
        └── main (content) — flex-1, overflow-y-auto, max-lg:pt-14
```

- Desktop: `md:h-[85vh]`, `md:max-w-5xl`, `md:rounded-2xl`
- Mobile: full screen, no outer padding

### Breakpoints Admin

- **`lg`** = límite sidebar/topbar
  - `< lg` → topbar fija `h-14` + contenido `pt-14`
  - `>= lg` → sidebar izquierdo `w-55`

### Sticky Headers (desktop only)

Todas las páginas tienen header sticky `h-19` (76px) alineado con el logo del sidebar. Solo visible `max-lg:hidden`.

### Desktop Controls Layout

**Appointments:** `[título+subtítulo] [ml-auto] [+] [↻] [🌙] [📅 Hoy/fecha]`

- Botón `+` usa `createOpen` state local + `open/onOpenChange` props en `AdminCreateAppointment`

**Metrics:** `[Métricas/subtítulo] [ml-auto] [↻] [Semana Mes Año]`

- `PeriodTabs` con `h-9` fijo + `py-1` interno para igualar altura con botón refresh

### Hydration Mismatch Prevention

Todos los componentes Radix con portales usan `dynamic(..., { ssr: false })`:
`AppointmentControls`, `PeriodTabs`, `AdminMobileSheet`, `AdminCreateAppointment`, `MetricsMobileControls`

---

## APPOINTMENT CARD (`src/components/appointment-card.tsx`)

### Mobile (`sm:hidden`)

- **Top bar** (`bg-black/20 dark:bg-black/30`): nombre del cliente (`payerName ?? payerEmail ?? "Sin nombre"`) centrado + circulito amber si PENDING + botón `...`
- **Barra lateral izquierda**: `w-[3px] bg-amber-500` solo si PENDING, todo el alto sin rounded
- **Body**: cajita hora (`w-8 h-8 rounded-lg bg-gold/10 border-gold/20`, texto `font-heebo text-gold`) + grid 2×2
- **Grid 2×2**: Fecha (izq) | Turno `#shortId` gold (der) / Teléfono (izq) | Monto (der)
- Teléfono muestra `shortPhone` = `telephone.slice(-10)`
- Nombre muestra `payerName ?? payerEmail ?? "Sin nombre"` (truncado a 20 chars en top bar)

### Desktop (`sm+`, `hidden sm:flex`)

- Fila horizontal `overflow-hidden items-stretch`
- **Barra lateral izquierda**: `w-[3px] self-stretch bg-amber-500` solo si PENDING
- Avatar hora (`ml-3` si PENDING, `ml-4` si no) | nombre + fecha·hora debajo | monto | botón `...`

### Dropdown Acciones (`ActionsMenu`, compartido mobile/desktop)

```
Estado (sub-menú)           ← ✓ Pagado / 🕐 Pendiente
────────────────────────────
Enviar WhatsApp (sub-menú)  ← ✂️ Sobre el turno
                               🏪 Desde Luckete
                               💬 General
────────────────────────────
✏️ Modificar turno
🗑️ Cancelar turno
```

### publicView prop

Cuando `publicView={true}` (usado en `get-appointments.tsx`): oculta Estado, WhatsApp y Cancelar. Solo muestra ✏️ Modificar turno.

### WhatsApp Links

- **Sobre el turno** (Scissors): `Hola! Te contactamos por tu turno del ${formatDateShort(date)} a las ${time} hs.`
- **Desde Luckete** (Store): `Hola! Nos comunicamos desde Luckete 👋`
- **General** (MessageCircle): `https://wa.me/${telephone}` sin texto

### Lucide Imports

```ts
(Calendar,
  Clock,
  Phone,
  Edit,
  Trash2,
  DollarSign,
  Check,
  MoreHorizontal,
  MessageCircle,
  Scissors,
  Store);
```

### Lucide Imports

```ts
(Calendar,
  Clock,
  Phone,
  Edit,
  Trash2,
  DollarSign,
  Check,
  MoreHorizontal,
  MessageCircle,
  Scissors,
  Store);
```

---

## DESIGN SYSTEM

### Light Mode Tokens

| Token                     | Valor     |
| ------------------------- | --------- |
| `text-content`            | `#1a1714` |
| `text-content-secondary`  | `#6b6560` |
| `text-content-tertiary`   | `#9c9189` |
| `text-content-quaternary` | `#b8a898` |
| `bg-base`                 | `#f9fafb` |
| `bg-surface`              | `#ece9e4` |
| `text-gold` / `bg-gold`   | `#c9a96e` |

### Dark Mode (zinc scale)

| Elemento          | Clase                                           |
| ----------------- | ----------------------------------------------- |
| Outer background  | `dark:bg-zinc-950`                              |
| Card / sidebar    | `dark:bg-zinc-900`                              |
| Elevated / inputs | `dark:bg-zinc-800`                              |
| Borders           | `dark:border-zinc-700` / `dark:border-zinc-800` |
| Text primary      | `dark:text-zinc-100`                            |
| Text secondary    | `dark:text-zinc-400`                            |
| Text tertiary     | `dark:text-zinc-500`                            |

---

## FONTS

Configuradas en `src/app/layout.tsx` con `next/font/google`. Registradas en `globals.css` dentro de `@theme inline`.

| Variable CSS            | Clase Tailwind       | Fuente         | Pesos           |
| ----------------------- | -------------------- | -------------- | --------------- |
| `--font-archivo`        | `font-archivo`       | Archivo        | 400,500,600,700 |
| `--font-archivo-black`  | `font-archivo-black` | Archivo        | 700,800,900     |
| `--font-dancing-script` | `font-dancingScript` | Dancing Script | 400,500,600,700 |
| `--font-heebo`          | `font-heebo`         | Heebo          | 400–900         |
| `--font-space-mono`     | `font-space-mono`    | Space Mono     | 400,700         |

---

## TAILWIND v4 RULES

- `!important`: `clase!` (no `!clase`)
- Clases canónicas: `h-17`, `min-w-15`, `py-4.5`, `rotate-12`. Solo `[valor]` si no existe equivalente.
- Gradientes: `bg-linear-to-br` (no `bg-gradient-to-br`)
- Tokens: `text-gold`, `bg-gold`, `border-border-subtle`, `text-content`, `text-content-secondary`, `text-content-tertiary`, `text-content-quaternary`

---

## MERCADOPAGO INTEGRATION

### Env vars

```
MP_ACCESS_TOKEN=...   MP_PUBLIC_KEY=...   MP_WEBHOOK_SECRET=...
```

### Preference config

```typescript
{
  items: [{ title: "Turno en Luckete Colorista", quantity: 1, unit_price: bookingCost }],
  external_reference: appointmentId,
  statement_descriptor: "LUCKETE COLORISTA",
  back_urls: { success, failure, pending },
  notification_url: `${APP_URL}/api/webhooks/mercadopago`,
}
```

### Webhook (`/api/webhooks/mercadopago`)

- Verifica `x-signature` HMAC SHA256
- On `approved`: update → `PAID` + crea `Payment` + guarda `payerName`/`payerEmail` + envía WhatsApp
- `payerName` = `payer.first_name + payer.last_name` si existen, sino fallback a `payer.email`
- Nota: cuentas AR que pagan con saldo MP no devuelven nombre, solo email

---

## WHATSAPP INTEGRATION

### Env vars

```
WHATSAPP_ACCESS_TOKEN=...   WHATSAPP_PHONE_ID=976682535533891
```

### Templates (Meta approved, language: `es`)

1. `appointment_confirmation_1` — tras pago aprobado
2. `appointment_reminder_2` — cron mañana del turno

### Button URL Variable

```json
{
  "type": "button",
  "sub_type": "url",
  "index": "0",
  "parameters": [{ "type": "text", "text": "appointmentId" }]
}
```

---

## CRON JOB (Daily Reminders)

- Schedule: `0 10 * * *` UTC = 7:00 AM Argentina
- Endpoint: `/api/cron/reminder`
- Auth: `Authorization: Bearer ${CRON_SECRET}`
- Busca turnos `PAID` de hoy y envía WhatsApp reminder

---

## ALINEACIÓN SIDEBAR / FOOTER (desktop)

Sidebar bottom section y config footer usan `h-17` fijo para que los bordes superiores coincidan:

```tsx
// admin-sidebar.tsx
<div className="px-3 h-17 border-t border-border-subtle dark:border-zinc-800 flex items-center shrink-0">

// config-view.tsx footer
<div className="sticky bottom-0 h-17 flex items-center justify-between gap-3 ...">
```

---

## SEEDER

```bash
pnpm seed   # Crea 20 appointments PENDING/PAID para hoy
pnpm drop   # Borra todos los appointments
```

`src/seeder.ts` — usa `PrismaNeon` adapter con `dotenv/config`.

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

- Argentina: **UTC-3**, sin daylight saving — `"America/Argentina/Buenos_Aires"`
- DB guarda fechas como UTC midnight
- Siempre: `formatInTimeZone(date, "America/Argentina/Buenos_Aires", "dd/MM/yyyy")` de `date-fns-tz`
- Cron: `0 10 * * *` UTC = 7:00 AM Argentina

---

## KNOWN ISSUES / DECISIONS

1. **Phone normalization:** Turnos viejos con `3794XXXXXX`. `formatArgentinianPhone` maneja ambos formatos.
2. **Webhook is primary:** `auto_return` no funciona en iOS/Android nativo. Webhook es el mecanismo confiable.
3. **Dead code:** `src/app/appointments/_actions/create.ts` (`createAppointmentAction`) sin uso.
4. **Hydration mismatch:** Todos los componentes Radix con portales deben usar `dynamic(..., { ssr: false })`.
5. **hasFetched flag:** Previene re-fetch en cada navegación. Solo `handleRefresh()` lo bypasea.
6. **Theme toggle:** Solo en sección "Apariencia" de `config-view.tsx`. Removido del sidebar.
7. **Config singleton:** `id = "singleton"` siempre, guardado via upsert.
8. **Nombre de archivo:** `sidebar-metrics-mobile-controls.tsx.tsx` tiene doble extensión en disco — pendiente renombrar a `.tsx`.
9. **Fechas en admin-appointments:** Las fechas se guardan como UTC midnight en DB. Al mostrar en el panel admin, NO usar `new Date(date)` directamente — genera off-by-one en Argentina (UTC-3) mostrando el día anterior. Siempre usar `formatInTimeZone(date, "America/Argentina/Buenos_Aires", "dd/MM/yyyy")` de `date-fns-tz`.

---

## ITEMS COMPLETADOS (todas las sesiones)

- [x] Dark mode en todos los componentes admin
- [x] Zustand stores: `useConfigStore` + `useMetricsStore` con cache por período
- [x] Schema Prisma: campo `price`, tabla `Payment`, enum `CANCELLED`
- [x] Config persistida en BD (modelo `Config` singleton, actions `get-config` / `save-config`)
- [x] Metrics service: delta calculations, `Promise.all`, filtro `createdAt→date`
- [x] Double fetch resuelto con `hasFetched`
- [x] `AppointmentsMobileControls` con dropdown
- [x] `MetricsMobileControls` (`sidebar-metrics-mobile-controls.tsx`) con dropdown período + refresh
- [x] `AppointmentCard` mobile: top bar + cajita hora + barra lateral amber PENDING + grid 2×2
- [x] `AppointmentCard` desktop: barra lateral amber PENDING + layout horizontal
- [x] Dropdown acciones: Estado → WhatsApp sub-menú (3 templates) → Modificar / Cancelar
- [x] Teléfono truncado a últimos 10 dígitos en card
- [x] Desktop appointments controls: `[ml-auto] [+] [↻] [📅]` + fix `open/onOpenChange`
- [x] Metrics header desktop: `[ml-auto] [↻] [PeriodTabs h-9]`
- [x] Breakpoints admin `md → lg`
- [x] Space Mono font agregada al proyecto
- [x] Sidebar: sección Público, Inicio en nav, solo Cerrar sesión abajo
- [x] Admin config: cards mobile descuentos (Space Mono, pill status), tabla `lg+`
- [x] Alineación `h-17` sidebar bottom / config footer
- [x] Schema Prisma: campos `payerName String?` y `payerEmail String?` en Appointment
- [x] Webhook MP: guarda `payerName`/`payerEmail` desde payer object, fallback a email
- [x] `AppointmentCard`: prop `publicView` oculta acciones admin, solo muestra Modificar turno
- [x] `AppointmentCard`: muestra `payerName ?? payerEmail ?? "Sin nombre"` en top bar y desktop
- [x] `types/config.ts`: `ALL_HOURS` con medias horas (08:00–19:30, 24 slots)
- [x] `types/config.ts`: `HoursConfig` reestructurado a `Record<DayKey, Record<string, HourConfig>>`
- [x] `available-days.tsx`: prop `selectedDay` + `onSelectDay`, ring dorado en día seleccionado
- [x] `available-hours.tsx`: recibe `selectedDay` desde config-view, sin tabs internos, subtítulo dorado
- [x] `config-view.tsx`: estado `selectedDay: DayKey` compartido entre AvailableDays y AvailableHours
- [x] `ThemeToggle`: refactorizado a shadcn Button variant outline, alineado con botones admin
- [x] Desktop appointments controls: orden `[+] [↻] [🌙] [📅]`, íconos `dark:text-zinc-400`
- [x] Sombras dark mode: `dark:shadow-black/30` en botones gold y hora seleccionada
- [x] **Config horarios:** fix interacción días/horas — click en cajita día = seleccionar, switch = toggle habilitado, sin conflicto entre ambos. Horarios deben reflejar el día seleccionado correctamente
- [x] **Config horarios:** migración de datos — config.hours en DB tiene estructura plana vieja, al guardar desde nueva UI se sobreescribe con estructura por día
- [x] **Config horarios:** `get-availability` action — actualizar para leer nueva `HoursConfig` por día
- [x] **Descuentos:** códigos no se están guardando en DB — investigar `save-config` action
- [x] **Admin calendario:** agregar color de BG en días según cantidad de turnos — verde (1–4), amarillo (5–10), rojo (11–15+)
- [x] Renombrar `sidebar-metrics-mobile-controls.tsx.tsx` → `sidebar-metrics-mobile-controls.tsx`
- [x] Verificar métricas en producción muestran datos correctos
- [x] `admin-mobile-sheet.tsx` — agregar `prefetch={false}` a todos los links de `NAV_ITEMS`
- [x] Verificar card en producción mobile y desktop

## ITEMS PENDIENTES

- [ ] Establecer como lograr que los usuarios modifiquen sus turnos (enviar OTP por meta whatsapp, sin poner template de OTP porque no nos permiten, envaluar si poner UTILITY y fijgir un OTP sin decir OTP para que no sea flagueado OTP y no nos permitan) o que se desate un chat con el chatbot de whatsapp business para que el chatbot le cambie el turno (ya es único al cliente ese número)
- [ ] hacer funcional el shop online (en panel de control: 1. crear página para crear productos y stock) 2. crear página para listado de pedidos para que la dueña de la peluqueria vea pedidos y vaya empaquetando y marcando la orden de compra como "recogido" u otro
- [ ] agregar seguridad al FRONT y BACK end respecto de la creación de turnos (para que no nos colmen la DB con bots) captcha y alguna otra forma de restringir

# Race Condition — Verificación de disponibilidad en tiempo real

## El problema

En un sistema de turnos con múltiples usuarios simultáneos existe una **race condition**: dos personas pueden llegar al paso 4 (confirmación de pago) con el mismo día y hora seleccionados. Sin verificación, ambas crearían un appointment para el mismo slot, superando el `maxBookings` configurado.

### Flujo original (sin fix)

```
Step 1 (fecha) → Step 2 (hora) → Step 3 (teléfono) → Step 4 (confirmación)
  → "Pagar con MP" → crea appointment PENDING → redirige a MercadoPago
```

El problema: la disponibilidad solo se chequeaba al **cargar las horas en el paso 2**, pero ese dato podía estar desactualizado para cuando el usuario llegaba al paso 4 minutos después.

---

## Archivos involucrados

| Archivo                                                      | Rol                                                |
| ------------------------------------------------------------ | -------------------------------------------------- |
| `src/app/appointments/_actions/mercadopago.ts`               | Verificación server-side + creación de appointment |
| `src/app/appointments/_hooks/use-create-appointment-form.ts` | Manejo del error `hourFull` en el cliente          |
| `src/app/appointments/new/_components/date-step.tsx`         | Deshabilita días llenos en el calendario           |
| `src/app/appointments/_actions/get-availability.ts`          | Recarga disponibilidad del día en tiempo real      |

---

## La solución

### 1. Verificación server-side — `mercadopago.ts`

**Antes** de crear el appointment y la preferencia de MercadoPago, se verifica en tiempo real:

```typescript
// 1. Obtener maxBookings del slot desde config
const hourConfig = config.hours[dayKey][data.hour];
if (!hourConfig?.enabled)
  return { success: false, error: "Horario no disponible" };

// 2. Contar appointments activos (no CANCELLED) para esa fecha/hora
const activeBookings = await countActiveBookingsForSlot(date, hour);

// 3. Si está lleno → retornar error con flag hourFull
if (activeBookings >= hourConfig.maxBookings) {
  return {
    success: false,
    error: "Este horario se acaba de completar. Por favor elegí otro.",
    hourFull: true,
  };
}

// 4. Solo si hay lugar → crear appointment PENDING + preferencia MP
```

La clave es que esto ocurre **en el momento exacto del intento de pago**, garantizando datos frescos de la DB.

---

### 2. Manejo del error en el cliente — `use-create-appointment-form.ts`

Cuando la action retorna `hourFull: true`, el hook ejecuta el siguiente flujo:

```typescript
if ("hourFull" in response && response.hourFull) {
  // Recargar disponibilidad real del día
  const availability = await getAvailabilityAction(data.date);

  if (availability.success && availability.hours) {
    setAvailableHours(availability.hours);
    const anyAvailable = availability.hours.some((h) => h.available);

    if (!anyAvailable) {
      // El día entero está lleno → agregar a fullDates
      const newFullDates = [...fullDates, data.date];
      setFullDates(newFullDates);
      // Calcular próxima fecha disponible saltando fullDates
      const nextDate = getNextAvailableDate(options?.daysConfig, newFullDates);
      form.setValue("date", nextDate);
      form.setValue("time", "");
      setCurrentStep(1); // → volver al calendario
    } else {
      // Quedan otros horarios en el mismo día
      form.setValue("time", "");
      setCurrentStep(2); // → volver a elegir hora
    }
  }
}
```

#### Estado `fullDates: Date[]`

Array de fechas que el usuario intentó reservar y que se detectaron como **completamente llenas** durante la sesión. Se acumula a medida que el usuario intenta y falla.

#### Función `getNextAvailableDate`

```typescript
function getNextAvailableDate(
  daysConfig: DaysConfig | null | undefined,
  fullDates: Date[] = [],
): Date {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);

  for (let i = 0; i < 60; i++) {
    const key = dayKeyMap[date.getUTCDay()];
    const isFull = fullDates.some(
      (d) => d.toDateString() === date.toDateString(),
    );
    if (daysConfig[key] && !isFull) return date;
    date.setDate(date.getDate() + 1);
  }

  return date;
}
```

Itera desde mañana buscando un día que:

- Esté habilitado en `daysConfig`
- No esté en `fullDates`

---

### 3. Deshabilitar días llenos en el calendario — `date-step.tsx`

```typescript
const isDayDisabled = (date: Date) => {
  // ... otras validaciones

  // Deshabilitar días detectados como llenos en esta sesión
  if (fullDates.some((d) => d.toDateString() === date.toDateString()))
    return true;

  // ...
};
```

`fullDates` viene del hook via `appointmentForm.fullDates` y se usa para pintar esos días como disabled en el calendario, evitando que el usuario vuelva a intentar reservar ahí.

---

## Flujo completo con fix

```
Step 4 → "Pagar con MP"
  ↓
mercadopago.ts verifica DB en tiempo real
  ↓
┌─ Hay lugar ──────────────────────────────────────────────┐
│  → Crea appointment PENDING                               │
│  → Crea preferencia MP                                    │
│  → Redirige a MercadoPago                                 │
└──────────────────────────────────────────────────────────┘
  ↓
┌─ hourFull: true ─────────────────────────────────────────┐
│  → Recarga disponibilidad del día (getAvailabilityAction) │
│                                                           │
│  ┌─ anyAvailable === false (día entero lleno) ──────────┐ │
│  │  → fullDates.push(fecha)                             │ │
│  │  → getNextAvailableDate(daysConfig, fullDates)       │ │
│  │  → form.setValue("date", nextDate)                   │ │
│  │  → form.setValue("time", "")                         │ │
│  │  → setCurrentStep(1) → calendario                    │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─ anyAvailable === true (quedan horarios) ────────────┐ │
│  │  → form.setValue("time", "")                         │ │
│  │  → setCurrentStep(2) → elegir hora                   │ │
│  └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## Por qué esta implementación y no otra

- **No se bloquea el slot al agregar al paso 2**: un slot "reservado" sin pagar generaría slots fantasma si el usuario abandona.
- **La verificación es server-side**: el cliente no puede falsificar disponibilidad.
- **`fullDates` es client-side y temporal**: solo persiste durante la sesión del usuario, no necesita DB.
- **Se reusan acciones existentes**: `getAvailabilityAction` ya existía, no se duplicó lógica.

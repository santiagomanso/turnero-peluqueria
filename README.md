# AI CONTEXT — Turnero Peluquería (Luckete Colorista)

## PROJECT OVERVIEW

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

### Admin Panel Features

- Ver, crear, modificar y cancelar turnos (vistas: tarjetas planas, tarjetas, tabla, calendario)
- Cambiar estado de turnos (PENDING → PAID → CANCELLED)
- Buscar turnos por nombre, teléfono o #ID (CUID)
- Enviar mensajes WhatsApp a clientes via templates aprobados (sobre el turno, desde Luckete, general)
- Configurar días disponibles para reservas (por día de semana)
- Configurar horarios disponibles por día, con slots de media hora y máximo de reservas simultáneas
- Gestionar códigos de descuento (crear, activar/desactivar, eliminar)
- Configurar precio base del turno
- Cambiar tema visual (light/dark)
- Ver métricas: ingresos, conversión, crecimiento, top horas, distribución por día
- **Gestionar productos de tienda** (crear, editar, activar/desactivar, stock, imagen vía Cloudinary con prompt AI; filtro por categoría, estado, orden)
- **Ver pedidos de tienda** (órdenes con estado, detalles de productos, marcar como recogido/enviado; búsqueda y filtro de estado)
- **Ver historial de pagos** (filtrado por día, con calendario coloreado por volumen)

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
│   │   │   │   └── sidebar-metrics-mobile-controls.tsx
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
│   │   │       ├── mercadopago
│   │   │       │   └── route.ts
│   │   │       └── whatsapp-chatbot
│   │   │           ├── handler.ts
│   │   │           ├── parse-input.ts
│   │   │           ├── route.ts
│   │   │           ├── send.ts
│   │   │           └── steps.ts
│   │   ├── appointments
│   │   │   ├── _actions
│   │   │   │   ├── delete.ts
│   │   │   │   ├── get-availability.ts
│   │   │   │   ├── get-by-id.ts
│   │   │   │   ├── get-by-phone.ts
│   │   │   │   ├── get-monthly-counts.ts
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
│   │       │   ├── cart-button.tsx
│   │       │   └── shop-content.tsx
│   │       ├── _store
│   │       │   └── use-cart.ts
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

| File                                                      | Purpose                                                                      |
| --------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `admin-sidebar.tsx`                                       | Desktop sidebar (nav order: Turnos→Métricas→Pagos→Tienda→Configuración)      |
| `admin-mobile-sheet.tsx`                                  | Mobile nav drawer (`dynamic ssr:false`)                                      |
| `admin-appointments.tsx`                                  | Grid de turnos; usa `AppointmentsMobileDropdown` para ambos desktop y mobile |
| `appointments-mobile-dropdown.tsx`                        | Dropdown unificado Turnos: `[+] [↻] [🌙] [📅 Hoy/fecha]`                     |
| `metrics-mobile-dropdown.tsx`                             | Dropdown unificado Métricas: período (Semana/Mes/Año) + refresh + theme      |
| `payments-mobile-dropdown.tsx`                            | Dropdown unificado Pagos: `[↻] [🌙] [📅]` + calendario con días coloreados   |
| `admin-create-appointment.tsx`                            | Dialog 3 pasos (date → time → telephone)                                     |
| `admin-theme-provider.tsx`                                | Lee/escribe cookie `admin-theme`, aplica `.dark` en `<html>`                 |
| `(protected)/payments/_components/payments-view.tsx`      | Vista pagos: `specificDate` siempre seteado (default hoy), sin period pills  |
| `(protected)/shop/_components/shop-view.tsx`              | Tab switcher Órdenes/Productos; pasa ShopDesktopToolbar a desktopControls    |
| `(protected)/shop/_components/shop-desktop-toolbar.tsx`   | Toolbar desktop completo: search, filtros, nuevo producto, tabs, ⚙           |
| `(protected)/shop/_components/products-tab.tsx`           | Cards/tabla de productos con filtros de categoría, estado y sort order       |
| `(protected)/shop/_components/orders-tab.tsx`             | Lista de órdenes con search y filtro de estado                               |
| `(protected)/shop/_components/product-modal.tsx`          | Dialog shadcn para crear/editar producto; upload imagen vía Cloudinary       |
| `_components/shop-mobile-controls.tsx`                    | Dropdown ⚙ mobile+tablet para shop: categoría, estado, sort, theme           |

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

**Patrón unificado:** todas las páginas admin usan el mismo componente dropdown mobile para desktop también. No hay botones de ícono separados en desktop. Los controles se pasan vía props `desktopControls` y `mobileControls` al componente `Navbar`.

**Appointments:** `[título+subtítulo] [ml-auto] [AppointmentsMobileDropdown]`
**Metrics:** `[Métricas/subtítulo] [ml-auto] [MetricsMobileDropdown]`
**Pagos:** `[Pagos/subtítulo] [ml-auto] [PaymentsMobileDropdown]`
**Shop (desktop lg+):** `ShopDesktopToolbar` full-width con search | dropdown de categoría/estado (contextual) | Nuevo producto | tab switcher Órdenes/Productos | ⚙ gear. Responsive: 3 niveles de labels (xl:hidden icono-only / xl-2xl texto corto / 2xl+ texto completo). Sin theme switcher (espacio limitado).
**Shop (mobile/tablet <lg):** `ShopMobileControls` — mismo gear ⚙ dropdown con categoría, filtros, sort order y theme toggle.

El dropdown contiene: refresh, theme toggle, y calendario. En Pagos el orden es `refresh | theme | calendar`.

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
WHATSAPP_CHATBOT_VERIFY_TOKEN=...
OWNER_PHONE=...
NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER=...
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
- [x] Establecer como lograr que los usuarios modifiquen sus turnos (enviar OTP por meta whatsapp, sin poner template de OTP porque no nos permiten, envaluar si poner UTILITY y fijgir un OTP sin decir OTP para que no sea flagueado OTP y no nos permitan) o que se desate un chat con el chatbot de whatsapp business para que el chatbot le cambie el turno (ya es único al cliente ese número)
- [x] Chatbot WhatsApp para modificación de turnos ✅
- [x] **Chatbot fix:** `sendOwnerClientContact` / `sendOwnerClientMessage` usan templates aprobados en lugar de `sendTextMessage` (texto libre que solo funciona en ventana 24hs)
- [x] **Admin: Gestión de productos** — `ProductsTab` + `ProductModal` con shadcn Dialog; upload imagen vía Cloudinary con prompt AI generativo; activar/desactivar, stock, precio, categoría
- [x] **Admin: Listado de pedidos** — `OrdersView` con detalle de productos, datos del comprador, estado (PENDING → PAID → SHIPPED → DELIVERED → CANCELLED); tabla desktop + cards mobile
- [x] **Admin: Página Pagos** — historial de pagos filtrado por día; `PaymentsMobileDropdown` con calendario coloreado (verde 1–4, amber 5–10, rojo 11+); `specificDate` siempre seteado (default hoy); `isTodayFromISO` para label
- [x] **Shop público** — `/shop` con bento grid de 7 categorías animado (framer-motion), conteo real de productos desde DB, mock names por card; `/shop/[category]` con grid de productos + category switcher horizontal; carrito vía Zustand
- [x] **Desktop controls unificados** — Turnos, Métricas y Pagos usan el mismo dropdown component en desktop y mobile; no más botones de ícono separados en desktop
- [x] **Sidebar: Configuración último** — reordenado a Turnos → Métricas → Pagos → Tienda online → Configuración
- [x] **MercadoPago webhook P2025 fix** — manejo de error Prisma `P2025` (appointment no encontrado) sin romper el webhook; responde 200 para evitar reintentos de MP
- [x] **`services/` pattern** — todas las actions son wrappers delgados; lógica de BD en `src/services/*.ts`; `src/services/payments.ts` y `src/services/shop.ts` creados
- [x] Hacer funcional el checkout del shop online MercadoPago para productos
- [x] **Appointments admin:** #ID visible en tarjeta plana y tabla; búsqueda por ID funcional (CUID lowercase, `contains + toLowerCase`)
- [x] **Appointments admin:** tarjetas planas `lg:grid-cols-3`; card "Sin turnos" full-width mobile, centrado tablet, left-aligned desktop
- [x] **Appointments admin:** botón "Ver cancelados" dark-mode active color unificado; calendar hover ring-inset dorado; fondos de color calendario corregidos con `dark:!bg-*`
- [x] **Shop admin toolbar desktop:** `ShopDesktopToolbar` con search, dropdown categoría/estado, nuevo producto, tab switcher 3 niveles responsive, gear ⚙
- [x] **Shop admin:** sort order filter (más nuevos / más viejos) en toolbar desktop y ⚙ mobile
- [x] **Shop admin products-tab:** labels Edit/Delete visibles en `sm+`; descripción `text-xs`; grid `xl:grid-cols-4`
- [x] **Shop público:** imágenes `object-contain` en category-view, product-view y cart-drawer
- [x] **`admin-page-header.tsx`:** `subtitle` acepta `React.ReactNode` para subtítulos responsive
- [x] **Payments calendar:** fondos de color (verde/amber/rojo) visibles en dark mode con `dark:!bg-*`

## ITEMS PENDIENTES

- [ ] agregar seguridad al FRONT y BACK end respecto de la creación de turnos (para que no nos colmen la DB con bots) captcha y alguna otra forma de restringir
- [ ] nichos personalizados (agrupar personas de la misma edad y mismo tratamiento, marketing dirigido)
- [ ] implementar notificaciones a la dueña para nuevos pedidos de tienda
- [ ] Orden de compra confirmada => Enviar whatsapp de confirmación de compra en tienda online
- [ ] orden de compra luego de pagar arranco en estado procesando => revisar, debería empezar en pendiente de preparación

---

# ADMIN — PAGOS (`/admin/payments`)

## Propósito

Vista del historial de pagos filtrada por día. Permite ver todos los pagos recibidos en una fecha específica.

## Archivos

```
src/app/admin/(protected)/payments/
├── page.tsx                          — Non-async, Suspense wrapper
└── _components/
    ├── payments-view.tsx             — Estado: specificDate (default hoy), usa PaymentsMobileDropdown
    └── payments-mobile-dropdown.tsx  — Dropdown unificado desktop+mobile
```

`src/services/payments.ts` — lógica de BD:

- `getPayments(specificDate: string)` — pagos del día filtrando por `createdAt`
- `getPaymentMonthlyCounts(year, month)` — conteo por día para el calendario

`src/app/admin/_actions/get-payments.ts` — action wrapper delgado.

## Detalles clave

- `specificDate` siempre tiene valor (default: `format(new Date(), "yyyy-MM-dd")`). No hay "sin fecha seleccionada".
- `isTodayFromISO(specificDate)` → si es hoy muestra "Pagos de hoy", si no "Mostrando: DD/MM/YYYY"
- Calendario en dropdown con días coloreados por volumen: verde (1–4 pagos), amber (5–10), rojo (11+)
- Dropdown usa `Popover` anidado dentro de `DropdownMenu`; el `DropdownMenuItem` del calendario usa `onSelect={(e) => e.preventDefault()}` para no cerrar el menú al abrir el popover

---

# ADMIN — TIENDA ONLINE (`/admin/shop`)

## Propósito

Panel de gestión de productos y órdenes de la tienda online.

## Archivos

```
src/app/admin/(protected)/shop/
├── page.tsx                         — Non-async, Suspense wrapper
└── _components/
    ├── shop-view.tsx                — Estado del tab activo; pasa ShopDesktopToolbar a desktopControls
    ├── shop-desktop-toolbar.tsx     — Toolbar full-width desktop (lg+): search, categoría, filtros, nuevo producto, tab switcher, gear
    ├── products-tab.tsx             — Cards/tabla de productos; escucha eventos window para search/sort/categoría/estado
    └── orders-tab.tsx               — Lista de pedidos; escucha eventos window para search/estado
```

`src/app/admin/_components/shop-mobile-controls.tsx` — Dropdown ⚙ mobile+tablet: categoría, estado, sort order, theme toggle. Emite window events que `products-tab` y `orders-tab` escuchan.

**Window events (shop):**
| Evento | Emisor | Receptor |
|--------|--------|----------|
| `shop:open-create` | toolbar/mobile | products-tab (abre modal) |
| `shop:refresh` | toolbar/mobile | products-tab/orders-tab |
| `shop:active-category` | products-tab | mobile controls (sync state) |
| `shop:select-category` | mobile controls | products-tab |
| `shop:filter-status` | toolbar/mobile | products-tab |
| `shop:orders-search` | toolbar | orders-tab |
| `shop:orders-status` | toolbar/mobile | orders-tab |
| `shop:products-search` | toolbar | products-tab |
| `shop:sort-order` | toolbar/mobile | products-tab |

`src/services/shop.ts` — lógica de BD:

- `getProducts()` — todos los productos
- `getActiveProductsByCategory(category)` — productos activos por categoría (para shop público)
- `getProductCategoryCounts()` — conteo por categoría (para bento grid)
- `createProduct(data)`, `updateProduct(id, data)`, `deleteProduct(id)`
- `getOrders()`, `updateOrderStatus(id, status)`

## Product Modal — Cloudinary + AI

El campo de imagen permite URL directa o subir imagen. Al subir, se envía a Cloudinary con un prompt AI generativo que automáticamente mejora/describe la imagen del producto. La URL resultante se guarda en `imageUrl`.

## Categorías disponibles (`SHOP_CATEGORIES`)

Definidas en `src/types/shop.ts`:

```typescript
export const SHOP_CATEGORIES = [
  "Shampoo y Acondicionador",
  "Mascarillas y Baños de Crema",
  "Tratamientos Capilares",
  "Aceites y Serums",
  "Protectores y Sprays",
  "Cremas para Peinar",
  "Accesorios",
] as const;
```

---

# SHOP PÚBLICO (`/shop`)

## Propósito

Página pública de tienda online accesible por clientes. Muestra categorías como bento grid y permite navegar a sub-páginas por categoría.

## Archivos

```
src/app/shop/
├── page.tsx                         — Non-async, Suspense + ShopCategoriesData
├── _actions/
│   └── get-category-counts.ts       — Action: llama getProductCategoryCounts()
├── _components/
│   ├── shop-categories-data.tsx     — Async server component: fetcha y pasa a bento
│   ├── shop-categories-bento.tsx    — Bento grid animado (framer-motion)
│   └── bento-skeleton.tsx           — Skeleton de carga
├── _store/
│   └── use-cart.ts                  — Zustand store del carrito
└── [category]/
    ├── page.tsx                     — Non-async, slugToCategory + notFound()
    └── _components/
        ├── category-data.tsx        — Async server component
        ├── category-view.tsx        — Client: grid de productos + category switcher
        └── category-skeleton.tsx    — Skeleton de carga
```

## Bento Grid

- CSS Grid: `grid-cols-2 lg:grid-cols-4`, `gridAutoRows: "160px"`
- Tres variantes de card: `XLCard` (2×2, col-span-2+row-span-2), `WideCard` (2×1, col-span-2), `SmCard` (1×1)
- Layout fijo de 7 categorías: XL(Shampoo), Wide(Mascarillas), Sm(Aceites), Sm(Protectores), Sm(Cremas), Sm(Tratamientos), Wide(Accesorios)
- Animaciones con `MotionLink = motion(Link)` de framer-motion + `cardVariants` con `type: "spring" as const`
- Muestra conteo real de productos desde DB + mock names por categoría

## Utilidades de slug (`src/lib/shop-utils.ts`)

```typescript
export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
export function slugToCategory(slug: string): ShopCategory | undefined {
  return SHOP_CATEGORIES.find((c) => categoryToSlug(c) === slug);
}
```

## Patrón Non-async page + Suspense

**NUNCA** hacer `page.tsx` async. Siempre usar:

```tsx
// page.tsx
export default function ShopPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <DataComponent /> {/* este sí es async */}
    </Suspense>
  );
}

// data-component.tsx
export default async function DataComponent() {
  const data = await fetchData();
  return <ViewComponent data={data} />;
}
```

---

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

# Chatbot WhatsApp — Turnero Peluquería Luckete Colorista

## Contexto general

Proyecto Next.js 16 + TypeScript + Prisma 7 + PostgreSQL (Neon) + TailwindCSS v4 desplegado en Vercel.
URL producción: https://turnero-peluqueria.vercel.app

El sistema permite a clientes reservar, ver, modificar y cancelar turnos en una peluquería.
Este README documenta específicamente el módulo del chatbot de WhatsApp y los cambios relacionados realizados en esta sesión.

---

## Problema original que motivó el chatbot

El formulario web de modificación de turnos (`/appointments/update/[id]`) era accesible por cualquier persona que tuviera el número de teléfono de otro cliente. No había verificación de identidad.

**Solución adoptada:** redirigir la modificación al chatbot de WhatsApp, donde Meta verifica la identidad del usuario a través del campo `from` del mensaje entrante. Solo el dueño del número puede modificar su turno.

---

## Stack del chatbot

- **Webhook:** `POST /api/webhooks/whatsapp-chatbot` (Next.js API route)
- **Sesiones:** tabla `whatsapp_chatbot_sessions` en PostgreSQL (Neon)
- **Mensajería:** API de Meta WhatsApp Business (v22.0)
- **Verificación webhook:** variable de entorno `WHATSAPP_CHATBOT_VERIFY_TOKEN`

---

## Variables de entorno necesarias

```env
WHATSAPP_CHATBOT_VERIFY_TOKEN=<openssl rand -hex 32>
OWNER_PHONE=5493794XXXXXX           # teléfono de la dueña (sin +)
NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER=5493794085932
NEXT_PUBLIC_APP_URL=https://turnero-peluqueria.vercel.app
```

---

## Schema Prisma

```prisma
model WhatsappChatbotSession {
  telephone     String   @id
  step          String
  appointmentId String?
  newDate       String?
  newTime       String?
  expiresAt     DateTime
  updatedAt     DateTime @updatedAt
  @@map("whatsapp_chatbot_sessions")
}
```

**TTL de sesión:** 30 minutos de inactividad. Para resetear una sesión manualmente, borrar la fila en Neon por `telephone`.

---

## Archivos del chatbot

```
src/app/api/webhooks/whatsapp-chatbot/
├── route.ts       — GET (verify token) + POST (recibe mensajes)
├── handler.ts     — orquesta el flujo, detecta patrón de ID directo
└── steps.ts       — toda la lógica de conversación
```

### `route.ts`

- `GET`: responde el challenge de Meta con `WHATSAPP_CHATBOT_VERIFY_TOKEN`
- `POST`: extrae `from`, `text`, `contactName` del payload de Meta, llama `handleIncomingMessage()`, siempre responde 200 OK

### `handler.ts`

Orden de procesamiento:

1. Detecta patrón `/hola! quiero modificar mi turno #([a-z0-9]+)/i` **ANTES** de verificar sesión → llama `handleDirectModify`
2. Busca sesión en DB. Si no existe o expiró → `sendMainMenu`
3. Switch por `session.step` → delega a la función correspondiente en `steps.ts`

### `steps.ts`

Contiene toda la lógica de conversación. Imports clave:

```typescript
import { sendTextMessage } from "@/services/whatsapp";
import { getConfig } from "@/services/config";
import { updateAppointment } from "@/services/update";
import { getAppointmentById } from "@/services/get";
```

---

## Flujos implementados

### 1. Ver mi turno

Busca el próximo turno activo (PENDING o PAID, fecha futura) y lo muestra. Borra la sesión al terminar.

### 2. Modificar mi turno

**Desde el menú (opción 2):**

- Si tiene 1 turno → salta directo a selección de fecha
- Si tiene varios → muestra lista para elegir cuál

**Desde la web (botón "Modificar turno"):**

- El botón abre WhatsApp con mensaje pre-cargado: `Hola! Quiero modificar mi turno #[ID_COMPLETO]`
- El bot detecta el ID, busca el turno filtrando por `id + telephone + status activo + fecha futura`, salta directo a selección de fecha

**Flujo de selección:**

1. Muestra turno original (fecha y hora)
2. Muestra días disponibles (próximos 7 días habilitados en config)
3. Muestra horarios disponibles del día elegido
4. Pide confirmación mostrando turno original vs turno nuevo
5. Verifica race condition antes de actualizar (cuenta bookings activos excluyendo el turno actual)
6. Actualiza y notifica a la dueña vía WhatsApp

### 3. Cancelar mi turno

Deriva al link web o a escribir directamente a la dueña.

### 4. Hablar con Luckete

Pregunta SI/NO si quiere dejar mensaje. Notifica a la dueña con nombre y teléfono del cliente (y mensaje si lo dejó).

---

## Estados de sesión (`step`)

| Step                             | Descripción                              |
| -------------------------------- | ---------------------------------------- |
| `AWAITING_OPTION`                | Menú principal                           |
| `AWAITING_APPOINTMENT_SELECTION` | Elegir cuál turno (cuando hay múltiples) |
| `AWAITING_DATE`                  | Elegir fecha para el cambio              |
| `AWAITING_HOUR`                  | Elegir hora para el cambio               |
| `CONFIRMING_CHANGE`              | Confirmar el cambio (1/2/3)              |
| `AWAITING_LUCKETE_CONTACT`       | SI/NO dejar mensaje para la dueña        |
| `AWAITING_LUCKETE_MESSAGE`       | Escribir el mensaje para la dueña        |

---

## Formato de los mensajes (decisiones de diseño)

Se decidió un estilo limpio, sin separadores (`─────`), sin exceso de emojis en las listas.

### Menú principal

```
🤖 ¿En qué te puedo ayudar?

1  → 👁️ Ver mi turno
2  → ✏️ Modificar mi turno
3  → ❌ Cancelar mi turno
4  → 💬 Hablar con Luckete
```

### Selección de fecha

```
Turno original
📅 Fecha: miércoles 11 de marzo
🕐 Hora: 16:00 hs

Días disponibles para el cambio

Entre semana
1  → jueves 12 de marzo
2  → martes 17 de marzo

Fin de semana
3  → sábado 14 de marzo

Respondé con el número del día o escribí una fecha (ej: 22/03)
```

### Selección de hora

```
🕐 Horarios disponibles

Por la mañana
1  → 09:00
2  → 10:00

Por la tarde
3  → 14:00

Respondé con el número o escribí la hora (ej: 10:30 o a las 4)
```

### Confirmación de cambio

```
✅ ¿Confirmamos el cambio?

📅 lunes 16 de marzo a las 10:00 hs

1  → ✅ Sí, confirmar
2  → 🔄 Elegir otro horario
3  → 🔙 Volver al menú
```

### Confirmación final

```
✅ ¡Listo! Tu turno fue modificado exitosamente.

Turno original: miércoles 11 de marzo a las 16:00 hs
Turno nuevo:    lunes 16 de marzo a las 10:00 hs

📍 Cómo llegar: https://maps.app.goo.gl/T56dNBbQZaFUNDJi6

Nos vemos pronto ✂️
```

---

## Diferencia admin vs cliente (appointment-card)

```typescript
// publicView={true} → cliente → abre WhatsApp con ID del turno
const WHATSAPP_TEXT = encodeURIComponent(`Hola! Quiero modificar mi turno #${appointment.id}`)
<a href={`wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}>Modificar turno</a>

// publicView={false} → admin (god mode) → navega al formulario
<Link href={`/appointments/update/${appointment.id}`}>Modificar turno</Link>
```

---

## Problema de fechas (CRÍTICO)

### El problema

Vercel corre en UTC. Argentina es UTC-3. Si se usa `new Date()` o `startOfDay(new Date())` sin considerar UTC, a partir de las 21:00 hora argentina el servidor ya está en el día siguiente.

### El patrón correcto (usado en todo el proyecto)

```typescript
const now = new Date();
const todayUTC = new Date(
  Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0,
    0,
    0,
    0,
  ),
);
```

Este patrón está implementado en `getAppointmentsByDate` y debe usarse en cualquier comparación de fechas.

### Ejemplo de MAL uso (evitar)

```typescript
date: {
  gte: startOfDay(new Date());
} // ❌ usa hora local del servidor
date: {
  gte: new Date();
} // ❌ idem
```

---

## Bug que se encontró y resolvió: turnos pasados en la web

**Síntoma:** `/appointments/get` mostraba turnos viejos (ej: del 10 de marzo cuando ya era 11 de marzo).

**Causa:** `getAppointmentsByPhone` en `services/get.ts` usaba `startOfDay(new Date())` que en el servidor UTC ya era el día siguiente.

**Fix aplicado en `src/services/get.ts`:**

```typescript
export async function getAppointmentsByPhone(
  telephone: string,
): Promise<Appointment[]> {
  const now = new Date();
  const todayUTC = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0,
      0,
      0,
      0,
    ),
  );

  return db.appointment.findMany({
    where: {
      telephone,
      status: { not: "CANCELLED" },
      date: { gte: todayUTC },
    },
    orderBy: { date: "asc" },
  });
}
```

---

## `sendTextMessage` — ubicación

Función unificada en `src/services/whatsapp.ts`. Fue migrada desde un archivo `send.ts` que fue eliminado.

```typescript
export async function sendTextMessage(to: string, text: string): Promise<void> {
  await sendWhatsAppMessage({
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: text },
  });
}
```

Usa API v22.0.

---

## Templates de WhatsApp para notificar a la dueña

Creados en Meta Business Suite, categoría `UTILITY`, idioma `Spanish (ARG)`.
Pie de página: `Luckete Colorista • Asistente automático`

| Nombre                         | Uso                                     | Función en código                     |
| ------------------------------ | --------------------------------------- | ------------------------------------- |
| `owner_client_contact_1`       | Cliente quiere hablar sin dejar mensaje | `sendOwnerClientContact(phone)`       |
| `owner_client_message_1`       | Cliente dejó un mensaje                 | `sendOwnerClientMessage(phone, msg)`  |
| `owner_appointment_modified_1` | Turno modificado exitosamente           | `sendOwnerAppointmentModified(phone)` |

✅ El bot ahora usa estos templates aprobados para notificar a la dueña (en lugar de `sendTextMessage` que solo funciona dentro de la ventana de 24hs de Meta). Las funciones están en `src/services/whatsapp.ts`.

---

## Búsqueda de teléfono en la DB

Los teléfonos se guardan con prefijo internacional (ej: `5493794800756`). El `from` de Meta también llega con prefijo. Para evitar problemas de coincidencia exacta, se usa:

```typescript
telephone: {
  endsWith: telephone.slice(-10);
}
```

Esto toma los últimos 10 dígitos y busca coincidencia por el final, tolerando diferencias en el prefijo.

---

## Items pendientes (chatbot)

- [x] ~~Implementar notificaciones a la dueña usando templates aprobados~~ ✅ `sendOwnerClientContact` / `sendOwnerClientMessage` implementados

- [ ] Agregar seguridad al FRONT y BACK end (captcha, rate limiting)

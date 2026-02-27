# AI CONTEXT — Turnero Peluquería (Luckete Colorista)

## PROJECT OVERVIEW

A Next.js appointment booking web app for a hair salon called **Luckete Colorista**.
Users book appointments, pay via MercadoPago, and receive WhatsApp notifications.

- **Production URL:** https://turnero-peluqueria.vercel.app
- **Stack:** Next.js 16, TypeScript, Prisma, PostgreSQL (Neon), TailwindCSS, Vercel
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

### Creation (New Appointment)

1. User fills form (date → time → telephone → confirmation)
2. Hook calls `createPaymentPreferenceAction`
3. Action creates `PENDING` appointment in DB with `cuid` ID
4. Action creates MercadoPago preference with `external_reference = appointment.id`
5. User is redirected to MercadoPago checkout (`init_point`)
6. After payment, MP webhook fires → marks appointment as `PAID` + sends WhatsApp confirmation

### File: `src/app/appointments/_actions/payment-preference.ts`

- Creates appointment first, then MP preference
- Uses `appointment.id` as `external_reference`
- Returns `initPoint` URL for redirect

### File: `src/app/api/webhooks/mercadopago/route.ts`

- Verifies MP signature
- Fetches payment from MP API using payment ID
- Checks `payment.status === "approved"`
- Uses `payment.external_reference` to find appointment
- Updates appointment: `status: "PAID"`, `paymentId`
- Calls `sendAppointmentConfirmation` (WhatsApp)

### Update Flow

- User goes to `/appointments/update/[id]`
- Same form as creation but in edit mode
- `updateAppointmentAction` → `updateAppointment` service
- Only updates `date`, `time`, `telephone` — never touches `status` or `paymentId`

---

## MERCADOPAGO INTEGRATION

### Credentials (Vercel env vars)

```
MP_ACCESS_TOKEN=...          # Production access token
MP_PUBLIC_KEY=...            # Production public key
MP_WEBHOOK_SECRET=...        # For signature verification
```

### Preference config

```typescript
{
  items: [{
    title: "Turno en Luckete Colorista",
    description: "Reserva de turno en Luckete Colorista",
    category_id: "services",
    quantity: 1,
    unit_price: 1000,
  }],
  external_reference: appointmentId,  // cuid string
  statement_descriptor: "LUCKETE COLORISTA",
  back_urls: {
    success: `${APP_URL}/appointments/new?status=approved`,
    failure: `${APP_URL}/appointments/new?status=failure`,
    pending: `${APP_URL}/appointments/new?status=pending`,
  },
  notification_url: `${APP_URL}/api/webhooks/mercadopago`,
}
```

### Webhook endpoint: `/api/webhooks/mercadopago`

- POST handler
- Verifies `x-signature` header with HMAC SHA256
- Fetches payment from `https://api.mercadopago.com/v1/payments/${paymentId}`
- On `approved`: updates DB + sends WhatsApp

---

## WHATSAPP INTEGRATION

### Credentials (Vercel env vars)

```
WHATSAPP_ACCESS_TOKEN=...    # Permanent system user token
WHATSAPP_PHONE_ID=976682535533891
```

### Business Account IDs

```
Phone ID: 976682535533891
WABA ID: 2680394532340734
Phone number: +54 9 379 407-3810
```

### File: `src/services/whatsapp.ts`

- `sendAppointmentConfirmation({ telephone, date, hour, appointmentId })`
- `sendAppointmentReminder({ telephone, date, hour })`
- Both use `formatArgentinianPhone()` before sending
- API endpoint: `https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_ID}/messages`

### Templates (Meta approved, language: `es`)

1. **`appointment_confirmation_1`** — sent after payment approved
   - Body variables: `{{1}}` date, `{{2}}` hour, `{{3}}` appointmentId, `{{4}}` maps URL
   - Button "Ver turno": dynamic URL with suffix `{{1}}` = appointmentId → `https://turnero-peluqueria.vercel.app/appointments/{appointmentId}`
   - Button "Como llegar": static URL → Google Maps

2. **`appointment_reminder_2`** — sent by cron the morning of the appointment
   - Body variables: `{{1}}` date, `{{2}}` hour, `{{3}}` maps URL
   - Button "Como llegar": static URL → Google Maps

### IMPORTANT: Button URL Variables

- Button URL variables are INDEPENDENT from body variables
- Button always uses `{{1}}` regardless of body variable numbering
- Base URL must be static, only the suffix is dynamic
- In API call: `{ type: "button", sub_type: "url", index: "0", parameters: [{ type: "text", text: appointmentId }] }`

### Meta Developer App

- App: **Soluciones Digitales** (ID: 763931256720643)
- Login account: santiagomanso.dev@gmail.com
- WhatsApp Manager: business.facebook.com/wa/manage/message-templates

---

## CRON JOB (Daily Reminders)

### File: `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/reminder",
      "schedule": "0 10 * * *"
    }
  ]
}
```

Runs at 10:00 UTC = 7:00 AM Argentina time (UTC-3)

### File: `src/app/api/cron/reminder/route.ts`

- GET handler, protected by `Authorization: Bearer ${CRON_SECRET}`
- Finds all `PAID` appointments for today (midnight to midnight UTC)
- Calls `sendAppointmentReminder` for each
- Returns `{ ok, succeeded, failed }`

### Testing in Postman

- Method: GET
- URL: `https://turnero-peluqueria.vercel.app/api/cron/reminder`
- Header: `Authorization: Bearer {{CRON_SECRET}}`
- Environment variable: `CRON_SECRET` in "Turnero-Peluqueria" environment

### Env var

```
CRON_SECRET=...   # Random hex string, generated with: openssl rand -hex 32
```

---

## KEY FILE STRUCTURE

```
src/
├── app/
│   ├── appointments/
│   │   ├── _actions/
│   │   │   ├── payment-preference.ts   # Creates PENDING appt + MP preference
│   │   │   ├── get-by-phone.ts         # Search appointments by phone
│   │   │   ├── get-by-id.ts            # Get single appointment
│   │   │   └── update.ts               # Update appointment (date/time/phone only)
│   │   ├── _hooks/
│   │   │   ├── use-create-appointment-form.ts  # Main form hook (create + update)
│   │   │   └── use-get-appointments.ts         # Search hook
│   │   ├── new/                        # /appointments/new — booking form
│   │   │   └── success/                # /appointments/new/success — post-payment
│   │   ├── get/                        # /appointments/get — search by phone
│   │   ├── update/[id]/                # /appointments/update/[id] — edit form
│   │   └── [id]/                       # /appointments/[id] — single view (from WhatsApp link)
│   ├── api/
│   │   ├── webhooks/mercadopago/       # MP webhook handler
│   │   └── cron/reminder/             # Daily reminder cron
│   └── shop/                           # Shop page
├── services/
│   ├── create.ts                       # createAppointment (normalizes phone)
│   ├── update.ts                       # updateAppointment (normalizes phone, preserves status/paymentId)
│   ├── get.ts                          # getAppointmentById, getAppointmentsByPhone
│   └── whatsapp.ts                     # sendAppointmentConfirmation, sendAppointmentReminder
├── lib/
│   ├── db.ts                           # Prisma client
│   └── format-phone.ts                 # formatArgentinianPhone()
├── types/
│   └── appointment.ts                  # Appointment type
└── components/
    ├── ui/
    │   ├── container.tsx               # Container.wrapper + Container.content
    │   └── calendar.tsx                # Calendar with mobile optimizations
    └── appointment-card.tsx            # Card with delete action
```

---

## ENVIRONMENT VARIABLES (Vercel + .env)

```
# Database
DATABASE_URL=...

# MercadoPago
MP_ACCESS_TOKEN=...
MP_PUBLIC_KEY=...
MP_WEBHOOK_SECRET=...

# App
NEXT_PUBLIC_APP_URL=https://turnero-peluqueria.vercel.app

# WhatsApp
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_PHONE_ID=976682535533891

# Cron
CRON_SECRET=...
```

---

## TIMEZONE HANDLING

- Argentina is **UTC-3** (no daylight saving)
- Timezone: `"America/Argentina/Buenos_Aires"`
- DB stores dates as UTC midnight
- Always use `formatInTimeZone(date, "America/Argentina/Buenos_Aires", "dd/MM/yyyy")` from `date-fns-tz` to display dates
- Cron runs at `0 10 * * *` UTC = 7:00 AM Argentina

---

## MOBILE / UI NOTES

- App is mobile-first, optimized for iPhone (including Dynamic Island / safe areas)
- `container.tsx` uses `overflow-y-auto` and `pt-safe` class for safe area insets
- Calendar cells are smaller on mobile (`--spacing(6)` vs `--spacing(7)`)
- Instagram in-app browser: safe area handled via CSS `@supports` in `globals.css`
- Design tokens: `text-gold`, `bg-gold`, `border-border-subtle`, `text-content`, `text-content-tertiary`, etc.

---

## GOOGLE MAPS LINK

```
https://maps.app.goo.gl/fXLVneR8ndBgTUxG6
```

Used in both WhatsApp templates as the "Como llegar" button URL.

---

## KNOWN ISSUES / DECISIONS

1. **Phone normalization:** Old appointments (before fix) may have `3794XXXXXX` instead of `549...`. The `formatArgentinianPhone` function handles both formats.
2. **Webhook is primary:** MP `auto_return` doesn't work on iOS/Android native apps. Webhook is the reliable mechanism; `back_url` is fallback only.
3. **Dead code:** `src/app/appointments/_actions/create.ts` (createAppointmentAction) is unused — appointment creation happens inside `payment-preference.ts`.
4. **WhatsApp payment method:** Must add payment method in Meta Business Manager to send messages beyond test numbers.
5. **Template button URL:** Must use base URL + `{{1}}` suffix added via Meta's "Agregar variable" button. Cannot type `{{N}}` manually in the URL field.

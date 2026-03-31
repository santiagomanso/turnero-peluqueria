# Appointments Full-Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign all `/appointments/*` routes to use a full-page layout (Enfoque B) with a `PublicNavbar` and, for the wizard pages, a two-column desktop layout (sidebar step index + content area).

**Architecture:** A shared `PublicNavbar` replaces the existing `Navbar` + `Container` pattern across all appointments pages. The wizard (`/appointments/new` and `/appointments/update/[id]`) gains a desktop sidebar that shows the 5 steps as a visual index; mobile stays sequential as today. Non-wizard pages (get, [id], success) get a centered full-page layout with the same `PublicNavbar`.

**Tech Stack:** Next.js 15 App Router, React 19, TailwindCSS v4, Framer Motion, shadcn/ui, `date-fns` + `date-fns-tz`, `next/dynamic` (ssr:false for client-only navbar).

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| **Create** | `src/components/public-navbar.tsx` | Brand + nav links + dark mode toggle |
| **Modify** | `src/app/appointments/new/page.tsx` | Full-page wrapper, drop Container/Navbar |
| **Modify** | `src/app/appointments/new/_components/create-appointment-form.tsx` | Desktop 2-col layout (sidebar + content) |
| **Modify** | `src/app/appointments/get/page.tsx` | Full-page centered layout |
| **Modify** | `src/app/appointments/update/[id]/page.tsx` | Full-page wrapper |
| **Modify** | `src/app/appointments/[id]/page.tsx` | Full-page centered layout |
| **Modify** | `src/app/appointments/new/success/page.tsx` | Full-page centered layout |

---

## Task 1: Create `PublicNavbar`

**Files:**
- Create: `src/components/public-navbar.tsx`

This component renders the top navigation bar visible on all public appointments pages.
It needs `dynamic(..., { ssr: false })` because it calls `useTheme()` which reads client state.

- [ ] **Step 1: Create the file**

```tsx
// src/components/public-navbar.tsx
"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Sun, Moon, Scissors } from "lucide-react";
import { useTheme } from "./public-theme-provider";

function PublicNavbarComponent() {
  const { isDark, setTheme } = useTheme();

  return (
    <nav className="h-14 shrink-0 bg-surface/90 dark:bg-zinc-950/90 border-b border-border-subtle dark:border-zinc-800 backdrop-blur-sm flex items-center px-6 lg:px-8">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2.5 mr-auto">
        <div className="w-7 h-7 bg-content dark:bg-zinc-100 rounded-full flex items-center justify-center shrink-0">
          <Scissors className="w-3.5 h-3.5 text-white dark:text-zinc-900" strokeWidth={1.5} />
        </div>
        <span className="text-sm tracking-[0.06em] text-content dark:text-zinc-100 font-light hidden sm:block">
          Luckete Colorista
        </span>
      </Link>

      {/* Nav links – hidden on mobile */}
      <div className="hidden md:flex items-center gap-7 mr-6">
        <Link
          href="/appointments/new"
          className="text-[0.65rem] tracking-[0.14em] uppercase text-content-secondary dark:text-zinc-400 hover:text-content dark:hover:text-zinc-100 transition-colors"
        >
          Agendar Turno
        </Link>
        <Link
          href="/appointments/get"
          className="text-[0.65rem] tracking-[0.14em] uppercase text-content-secondary dark:text-zinc-400 hover:text-content dark:hover:text-zinc-100 transition-colors"
        >
          Consultar Turno
        </Link>
        <Link
          href="/shop"
          className="text-[0.65rem] tracking-[0.14em] uppercase text-content-secondary dark:text-zinc-400 hover:text-content dark:hover:text-zinc-100 transition-colors"
        >
          Tienda
        </Link>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[0.65rem] tracking-[0.14em] uppercase text-content-secondary dark:text-zinc-400 hover:text-content dark:hover:text-zinc-100 transition-colors"
        >
          WhatsApp
        </a>
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="w-8 h-8 rounded-full flex items-center justify-center border border-border-subtle dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-black/5 dark:hover:bg-zinc-700 transition-colors shrink-0"
        aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      >
        {isDark ? (
          <Sun className="w-3.5 h-3.5 text-content-secondary dark:text-zinc-400" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-content-secondary" />
        )}
      </button>
    </nav>
  );
}

const PublicNavbar = dynamic(() => Promise.resolve(PublicNavbarComponent), {
  ssr: false,
});

export default PublicNavbar;
```

- [ ] **Step 2: Verify it compiles**

```bash
cd /Users/devsanti/Documents/projects/turnero-peluqueria && pnpm tsc --noEmit 2>&1 | head -30
```

Expected: no errors related to `public-navbar.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/public-navbar.tsx
git commit -m "feat: add PublicNavbar for appointments pages"
```

---

## Task 2: Refactor `/appointments/new/page.tsx`

**Files:**
- Modify: `src/app/appointments/new/page.tsx`

Replace the `Container.wrapper` + `Container.content` + `Navbar` shell with a full-page flex column that has `PublicNavbar` at the top. The `CreateAppointmentView` (and its Suspense) fills the remaining height.

- [ ] **Step 1: Replace the file content**

```tsx
// src/app/appointments/new/page.tsx
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import PublicNavbar from "@/components/public-navbar";
import CreateAppointmentView from "./_components/create-appointment-view";

function PageSkeleton() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-6 h-6 animate-spin text-gold" />
      <p className="text-xs text-content-quaternary dark:text-zinc-600 uppercase tracking-widest">
        Cargando...
      </p>
    </div>
  );
}

export default function CreateAppointmentPage() {
  return (
    <div className="min-h-svh flex flex-col bg-surface dark:bg-zinc-950 font-archivo">
      <PublicNavbar />
      <Suspense fallback={<PageSkeleton />}>
        <CreateAppointmentView />
      </Suspense>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

```bash
pnpm tsc --noEmit 2>&1 | head -30
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/appointments/new/page.tsx
git commit -m "feat: appointments/new — full-page layout with PublicNavbar"
```

---

## Task 3: Refactor `create-appointment-form.tsx` — desktop 2-column layout

**Files:**
- Modify: `src/app/appointments/new/_components/create-appointment-form.tsx`

This is the core change. The goal:
- **Mobile**: keep the existing UX — `ProgressBar` on top, form card, nav buttons at bottom.
- **Desktop (lg+)**: drop the `ProgressBar`. Add a left sidebar (`w-64`) that shows the 5 steps as a vertical list. The right side holds the step content and nav buttons.

### Layout skeleton

```
<div class="flex-1 flex flex-col min-h-0">           ← fills space below PublicNavbar
  <ProgressBar class="lg:hidden" />                 ← mobile only
  <div class="flex flex-1 min-h-0">
    <aside class="hidden lg:flex sidebar">           ← desktop only
      StepItem × 5
    </aside>
    <form class="flex-1 flex flex-col min-h-0">
      <div class="flex-1 overflow-y-auto px-6 py-8 lg:px-12">
        <p class="hidden lg:block paso-label">       ← "PASO 2 DE 5"
        <h1 class="hidden lg:block step-title">      ← "Horario"
        <p class="hidden lg:block step-subtitle">    ← "Turnos disponibles para el lunes 31"
        {step components}
      </div>
      <BottomNavigationButtons />                    ← stays inside <form> — critical for submit
    </form>
  </div>
</div>
```

### Step metadata

Step names and subtitles for the sidebar:

```
1 → "Fecha"         / subtitle = formatted selected date OR "Elegí una fecha"
2 → "Horario"       / subtitle = selected time OR "Elegí tu hora"
3 → "Teléfono"      / subtitle = "—"
4 → "Confirmación"  / subtitle = "—"
5 → "Pago"          / subtitle = "—"
```

Step headings shown in the right content area (desktop only):

```
1 → heading "Fecha",        subheading "Elegí el día de tu turno"
2 → heading "Horario",      subheading `Turnos disponibles para el {date formatted}`
3 → heading "Teléfono",     subheading "Ingresá tu número de WhatsApp"
4 → heading "Confirmación", subheading "Revisá los detalles antes de pagar"
5 → heading "Pago",         subheading "Completá el pago para confirmar tu turno"
```

- [ ] **Step 1: Replace the file**

```tsx
// src/app/appointments/new/_components/create-appointment-form.tsx
"use client";

import { Suspense } from "react";
import { Loader2, Check } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import DateStep from "./date-step";
import HourStep from "./hour-step";
import TelephoneStep from "./telephone-step";
import ConfirmationStep from "./confirmation-step";
import PaymentStep from "./payment-step";
import ProgressBar from "./progress-bar";
import BottomNavigationButtons from "./bottom-navigation-buttons";
import useCreateAppointmentForm from "@/app/appointments/_hooks/use-create-appointment-form";
import type { Appointment } from "@/types/appointment";
import type { DaysConfig } from "@/types/config";

type Props = {
  appointment?: Appointment;
  bookingCost?: number;
  daysConfig?: DaysConfig | null;
};

// ─── Step metadata ────────────────────────────────────────────────────────────

const STEP_NAMES = ["Fecha", "Horario", "Teléfono", "Confirmación", "Pago"] as const;

const STEP_HEADINGS: { heading: string; getSubheading: (date?: Date) => string }[] = [
  {
    heading: "Fecha",
    getSubheading: () => "Elegí el día de tu turno",
  },
  {
    heading: "Horario",
    getSubheading: (date) =>
      date
        ? `Turnos disponibles para el ${format(date, "EEEE dd 'de' MMMM", { locale: es })}`
        : "Turnos disponibles",
  },
  {
    heading: "Teléfono",
    getSubheading: () => "Ingresá tu número de WhatsApp",
  },
  {
    heading: "Confirmación",
    getSubheading: () => "Revisá los detalles antes de pagar",
  },
  {
    heading: "Pago",
    getSubheading: () => "Completá el pago para confirmar tu turno",
  },
];

// ─── Sidebar step item ────────────────────────────────────────────────────────

type SidebarStepProps = {
  stepNumber: number;
  label: string;
  subtitle: string;
  currentStep: number;
};

function SidebarStep({ stepNumber, label, subtitle, currentStep }: SidebarStepProps) {
  const isActive = currentStep === stepNumber;
  const isDone = currentStep > stepNumber;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
        isActive && "bg-gold/10 dark:bg-gold/10",
      )}
    >
      {/* Number / check bubble */}
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold transition-all",
          isActive &&
            "bg-gold text-white",
          isDone &&
            "bg-gold/15 dark:bg-gold/20 text-gold border border-gold/30",
          !isActive &&
            !isDone &&
            "bg-step-inactive-bg dark:bg-zinc-800 text-step-inactive-text dark:text-zinc-500 border border-step-inactive-border dark:border-zinc-700",
        )}
      >
        {isDone ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : stepNumber}
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p
          className={cn(
            "text-sm leading-tight font-medium truncate",
            isActive
              ? "text-content dark:text-zinc-100"
              : isDone
              ? "text-content-secondary dark:text-zinc-400"
              : "text-content-tertiary dark:text-zinc-500",
          )}
        >
          {label}
        </p>
        <p className="text-[0.65rem] text-content-quaternary dark:text-zinc-600 truncate mt-0.5">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

// ─── Inner form ───────────────────────────────────────────────────────────────

function FormSkeleton() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-6 h-6 animate-spin text-gold" />
      <p className="text-xs text-content-quaternary dark:text-zinc-600 uppercase tracking-widest">
        Cargando...
      </p>
    </div>
  );
}

function AppointmentFormInner({
  appointment,
  bookingCost = 0,
  daysConfig,
}: Props) {
  const appointmentForm = useCreateAppointmentForm({ appointment, daysConfig });
  const { currentStep, totalSteps } = appointmentForm;

  // Values for sidebar subtitles
  const selectedDate = appointmentForm.form.watch("date");
  const selectedTime = appointmentForm.form.watch("time");

  const sidebarSubtitles = [
    selectedDate
      ? format(selectedDate, "EEE dd 'de' MMMM", { locale: es })
      : "Elegí una fecha",
    selectedTime || "Elegí tu hora",
    "—",
    "—",
    "—",
  ];

  const currentHeading = STEP_HEADINGS[currentStep - 1];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Mobile progress bar */}
      <div className="lg:hidden px-4 pt-5 pb-2">
        <ProgressBar appointmentForm={appointmentForm} />
      </div>

      <div className="flex flex-1 min-h-0">
        {/* ── Desktop sidebar ── */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border-subtle dark:border-zinc-800 py-8 px-4 gap-1">
          {STEP_NAMES.map((name, i) => (
            <SidebarStep
              key={i}
              stepNumber={i + 1}
              label={name}
              subtitle={sidebarSubtitles[i]}
              currentStep={currentStep}
            />
          ))}
        </aside>

        {/* ── Form (content + nav buttons) ── */}
        <form
          onSubmit={appointmentForm.form.handleSubmit(appointmentForm.onSubmit)}
          className="flex-1 flex flex-col min-h-0"
        >
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto px-4 py-5 lg:px-12 lg:py-10">
            {/* Desktop step header */}
            <div className="hidden lg:block mb-6">
              <p className="text-xs tracking-[0.18em] uppercase text-content-quaternary dark:text-zinc-500 mb-3">
                Paso {currentStep} de {totalSteps}
              </p>
              <h1 className="text-4xl font-light text-content dark:text-zinc-100 mb-1">
                {currentHeading.heading}
              </h1>
              <p className="text-sm text-content-tertiary dark:text-zinc-500">
                {currentHeading.getSubheading(selectedDate)}
              </p>
            </div>

            {/* Mobile: card wrapper for step content */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-border-subtle dark:border-zinc-700 shadow-sm p-5 flex flex-col lg:bg-transparent lg:dark:bg-transparent lg:border-0 lg:shadow-none lg:rounded-none lg:p-0">
              {currentStep === 1 && (
                <DateStep appointmentForm={appointmentForm} />
              )}
              {currentStep === 2 && (
                <HourStep appointmentForm={appointmentForm} />
              )}
              {currentStep === 3 && (
                <TelephoneStep appointmentForm={appointmentForm} />
              )}
              {currentStep === 4 && (
                <ConfirmationStep
                  appointmentForm={appointmentForm}
                  bookingCost={bookingCost}
                />
              )}
              {currentStep === 5 && (
                <PaymentStep
                  appointmentForm={appointmentForm}
                  bookingCost={bookingCost}
                />
              )}
            </div>
          </div>

          {/* Nav buttons — stay inside <form> so type="submit" works */}
          <div className="shrink-0 px-4 pb-5 lg:px-12 lg:pb-8">
            <BottomNavigationButtons
              appointmentForm={appointmentForm}
              bookingCost={bookingCost}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────

export default function CreateAppointmentForm({
  appointment,
  bookingCost,
  daysConfig,
}: Props) {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <AppointmentFormInner
        appointment={appointment}
        bookingCost={bookingCost}
        daysConfig={daysConfig}
      />
    </Suspense>
  );
}
```

- [ ] **Step 2: Verify it compiles**

```bash
pnpm tsc --noEmit 2>&1 | head -30
```

Expected: no new errors.

- [ ] **Step 3: Visual check in browser**

Open `http://localhost:3000/appointments/new`.

- [ ] Desktop (≥1024px): left sidebar shows 5 steps; step 1 active (gold); right area shows "PASO 1 DE 5" + "Fecha" heading + calendar.
- [ ] Click "Siguiente" → step 2 becomes active; step 1 shows checkmark in sidebar.
- [ ] Mobile (≤768px): horizontal progress bar at top; form card below; nav buttons at bottom.
- [ ] Step 5: "Pagar con MercadoPago" button submits the form (NOT a `type="button"`).

- [ ] **Step 4: Commit**

```bash
git add src/app/appointments/new/_components/create-appointment-form.tsx
git commit -m "feat: appointments wizard — desktop 2-col sidebar layout"
```

---

## Task 4: Refactor `/appointments/get/page.tsx`

**Files:**
- Modify: `src/app/appointments/get/page.tsx`

Replace `Container.wrapper` + `Container.content` + `Navbar` with `PublicNavbar` + centered content area. The `GetAppointments` component inside doesn't change.

- [ ] **Step 1: Replace the file**

```tsx
// src/app/appointments/get/page.tsx
import PublicNavbar from "@/components/public-navbar";
import GetAppointments from "./_components/get-appointments";

export default function SearchAppointmentPage() {
  return (
    <div className="min-h-svh flex flex-col bg-surface dark:bg-zinc-950 font-archivo">
      <PublicNavbar />
      <main className="flex-1 flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-2xl">
          <GetAppointments />
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

```bash
pnpm tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Visual check**

Open `http://localhost:3000/appointments/get`. PublicNavbar visible at top; search form centered below.

- [ ] **Step 4: Commit**

```bash
git add src/app/appointments/get/page.tsx
git commit -m "feat: appointments/get — full-page layout with PublicNavbar"
```

---

## Task 5: Refactor `/appointments/update/[id]/page.tsx`

**Files:**
- Modify: `src/app/appointments/update/[id]/page.tsx`

The update page renders `UpdateAppointmentView` which in turn renders `CreateAppointmentForm`. The form already gets the 2-col layout from Task 3. This page just needs the correct full-page shell.

- [ ] **Step 1: Replace the file**

```tsx
// src/app/appointments/update/[id]/page.tsx
import PublicNavbar from "@/components/public-navbar";
import UpdateAppointmentView from "../_components/update-appointment-view";

type Props = {
  params: Promise<{ id: string }>;
};

export default function UpdateAppointmentPage({ params }: Props) {
  return (
    <div className="min-h-svh flex flex-col bg-surface dark:bg-zinc-950 font-archivo">
      <PublicNavbar />
      <UpdateAppointmentView params={params} />
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

```bash
pnpm tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Visual check**

Navigate to a valid update URL. Confirm PublicNavbar appears and the 2-col wizard works (isEditing mode: last button says "Confirmar", not "Pagar con MercadoPago").

- [ ] **Step 4: Commit**

```bash
git add src/app/appointments/update/[id]/page.tsx
git commit -m "feat: appointments/update — full-page layout with PublicNavbar"
```

---

## Task 6: Refactor `/appointments/[id]/page.tsx`

**Files:**
- Modify: `src/app/appointments/[id]/page.tsx`

Appointment detail (read-only). Replace `Container` + `Navbar` with `PublicNavbar` + centered content.

- [ ] **Step 1: Replace the file**

Keep all the existing JSX for the card (`InfoCard`, status badge, actions) — only the outer shell changes.

```tsx
// src/app/appointments/[id]/page.tsx
import PublicNavbar from "@/components/public-navbar";
import { getAppointmentByIdAction } from "../_actions/get-by-id";
import { formatDateNumericFromISO } from "@/lib/format-date";
import { formatPhoneDisplay } from "@/lib/format-phone";
import {
  Calendar,
  Clock,
  Phone,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-md bg-white dark:bg-zinc-700 border border-border-subtle dark:border-zinc-600 shadow-sm">
      <Icon className="w-4 h-4 shrink-0 text-gold" />
      <div>
        <p className="text-[0.6rem] uppercase tracking-wider text-content-quaternary dark:text-zinc-500 mb-0.5">
          {label}
        </p>
        <p className="font-semibold text-sm text-content dark:text-zinc-100">
          {value}
        </p>
      </div>
    </div>
  );
}

export default async function AppointmentDetailPage({ params }: Props) {
  const { id } = await params;
  const response = await getAppointmentByIdAction(id);

  if (!response.success || !response.data) {
    notFound();
  }

  const appointment = response.data;
  const isPaid = appointment.status === "PAID";
  const price = appointment.price
    ? `$${appointment.price.toLocaleString("es-AR")} ARS`
    : "$0 ARS";

  return (
    <div className="min-h-svh flex flex-col bg-surface dark:bg-zinc-950 font-archivo">
      <PublicNavbar />
      <main className="flex-1 flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-2xl">
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-border-subtle dark:border-zinc-700 shadow-sm p-5 flex flex-col gap-4">
            {/* Status */}
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold ${
                isPaid
                  ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                  : "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800"
              }`}
            >
              {isPaid ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              {isPaid ? "Pago confirmado" : "Pago pendiente"}
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoCard
                icon={Calendar}
                label="Fecha"
                value={formatDateNumericFromISO(appointment.date)}
              />
              <InfoCard icon={Clock} label="Hora" value={appointment.time} />
              <InfoCard
                icon={Phone}
                label="Teléfono"
                value={formatPhoneDisplay(appointment.telephone)}
              />
              <InfoCard icon={DollarSign} label="Precio" value={price} />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-2">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(`Hola! Quiero modificar mi turno #${appointment.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center px-6 py-3 rounded-md font-bold text-sm uppercase tracking-[0.08em] bg-gold text-white shadow-md shadow-neutral-300 dark:shadow-black/30 hover:bg-gold/90 transition-all"
              >
                Modificar turno
              </a>
              <Link
                href="/"
                className="w-full text-center px-6 py-3 rounded-md font-bold text-sm uppercase tracking-[0.08em] bg-white dark:bg-zinc-700 border border-border-subtle dark:border-zinc-600 text-content-secondary dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-zinc-600 transition-all"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

```bash
pnpm tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Visual check**

Navigate to `/appointments/<valid-id>`. PublicNavbar visible; card centered below.

- [ ] **Step 4: Commit**

```bash
git add src/app/appointments/\[id\]/page.tsx
git commit -m "feat: appointments/[id] — full-page layout with PublicNavbar"
```

---

## Task 7: Refactor `/appointments/new/success/page.tsx`

**Files:**
- Modify: `src/app/appointments/new/success/page.tsx`

Success confirmation page. Replace `Container` + `Navbar` with `PublicNavbar` + centered layout. The `AnimatedCheck` SVG and all content stay exactly the same.

- [ ] **Step 1: Replace the file**

```tsx
// src/app/appointments/new/success/page.tsx
import Link from "next/link";
import PublicNavbar from "@/components/public-navbar";
import { Home, CalendarCheck } from "lucide-react";

function AnimatedCheck() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="88"
      height="88"
    >
      <style>{`
        .ap-path {
          fill: none;
          stroke: #ceaa6b;
          stroke-width: 7;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .ap-circle {
          stroke-dasharray: 220;
          stroke-dashoffset: 220;
          animation: ap-draw-circle 0.6s ease-out forwards;
        }
        .ap-check {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: ap-draw-check 0.4s ease-out 0.6s forwards;
        }
        .ap-container {
          animation: ap-pop 0.3s ease-out 1s both;
          transform-origin: center;
        }
        @keyframes ap-draw-circle { to { stroke-dashoffset: 0; } }
        @keyframes ap-draw-check  { to { stroke-dashoffset: 0; } }
        @keyframes ap-pop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
      `}</style>
      <g className="ap-container">
        <path className="ap-path ap-circle" d="M 62 17 A 35 35 0 1 0 81 65" />
        <path className="ap-path ap-check"  d="M 32 50 L 48 65 L 78 28" />
      </g>
    </svg>
  );
}

export default function AppointmentSuccessPage() {
  return (
    <div className="min-h-svh flex flex-col bg-surface dark:bg-zinc-950 font-archivo">
      <PublicNavbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center gap-6 text-center max-w-sm">
          {/* Animated check */}
          <div className="w-24 h-24 rounded-full bg-gold/10 dark:bg-gold/10 flex items-center justify-center">
            <AnimatedCheck />
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h1 className="text-2xl font-extrabold text-content dark:text-zinc-100">
              ¡Turno reservado!
            </h1>
            <p className="text-sm text-content-tertiary dark:text-zinc-500 max-w-[280px] mx-auto">
              Tu pago fue procesado correctamente. Te esperamos en el salón.
            </p>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-gold/10 text-gold border border-gold/30">
            <CalendarCheck className="w-3.5 h-3.5" />
            Pago confirmado con MercadoPago
          </div>

          {/* WhatsApp note */}
          <p className="text-xs text-content-quaternary dark:text-zinc-600 max-w-[240px]">
            Recibirás una confirmación por WhatsApp con los detalles de tu turno.
          </p>

          {/* CTA */}
          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gold text-white hover:bg-gold/90 transition-all shadow-md shadow-gold/20"
          >
            <Home className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

```bash
pnpm tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Visual check**

Navigate to `/appointments/new/success`. PublicNavbar at top; success card centered vertically.

- [ ] **Step 4: Commit**

```bash
git add src/app/appointments/new/success/page.tsx
git commit -m "feat: appointments/success — full-page layout with PublicNavbar"
```

---

## Final verification checklist

- [ ] All 7 appointments routes render with `PublicNavbar`
- [ ] Desktop wizard: sidebar shows correct active/done/pending states as you step through
- [ ] Mobile wizard: horizontal `ProgressBar` + stacked form, no sidebar visible
- [ ] Step 5 submit button (`type="submit"`) triggers form submit → MercadoPago redirect
- [ ] Edit mode (`/appointments/update/[id]`): last button says "Confirmar" (not "Pagar")
- [ ] Dark mode toggle in `PublicNavbar` works on all routes
- [ ] `pnpm tsc --noEmit` passes with no errors

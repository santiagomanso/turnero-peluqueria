"use client";

import { Suspense, type ReactNode } from "react";
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

const STEP_NAMES = [
  "Fecha",
  "Horario",
  "Teléfono",
  "Confirmación",
  "Pago",
] as const;

const STEP_HEADINGS: {
  heading: string;
  getSubheading: (date?: Date) => string;
  rightHint: ReactNode;
}[] = [
  {
    heading: "Fecha",
    getSubheading: () => "Seleccionar fecha",
    rightHint: (
      <p className="text-xs text-content-tertiary dark:text-zinc-500 leading-relaxed">
        Turnos con{" "}
        <strong className="text-content-secondary dark:text-zinc-300">
          +24 hs
        </strong>{" "}
        de anticipación.
      </p>
    ),
  },
  {
    heading: "Horario",
    getSubheading: (date) =>
      date
        ? `Turnos disponibles para el ${format(date, "EEEE dd 'de' MMMM", { locale: es })}`
        : "Seleccionar hora",
    rightHint: (
      <p className="text-xs text-content-tertiary dark:text-zinc-500 leading-relaxed">
        Cancelaciones con{" "}
        <strong className="text-content-secondary dark:text-zinc-300">
          +24 hs
        </strong>{" "}
        de anticipación.
      </p>
    ),
  },
  {
    heading: "Teléfono",
    getSubheading: () => "Teléfono de contacto",
    rightHint: (
      <p className="text-xs text-content-tertiary dark:text-zinc-500 leading-relaxed">
        Usá este número para{" "}
        <strong className="text-content-secondary dark:text-zinc-300">
          consultar
        </strong>{" "}
        tu turno después.
      </p>
    ),
  },
  {
    heading: "Confirmación",
    getSubheading: () => "Revisá tus datos",
    rightHint: (
      <p className="text-xs text-content-tertiary dark:text-zinc-500 leading-relaxed">
        Verificá que todo sea{" "}
        <strong className="text-content-secondary dark:text-zinc-300">
          correcto
        </strong>{" "}
        antes de agendar.
      </p>
    ),
  },
  {
    heading: "Pago",
    getSubheading: () => "Método de pago",
    rightHint: (
      <p className="text-xs text-content-tertiary dark:text-zinc-500 leading-relaxed">
        Completá el pago para{" "}
        <strong className="text-content-secondary dark:text-zinc-300">
          confirmar
        </strong>{" "}
        tu turno.
      </p>
    ),
  },
];

// ─── Sidebar step item ────────────────────────────────────────────────────────

type SidebarStepProps = {
  stepNumber: number;
  label: string;
  subtitle: string;
  currentStep: number;
};

function SidebarStep({
  stepNumber,
  label,
  subtitle,
  currentStep,
}: SidebarStepProps) {
  const isActive = currentStep === stepNumber;
  const isDone = currentStep > stepNumber;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
        isActive && "bg-gold/10 dark:bg-gold/10",
      )}
    >
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold transition-all",
          isActive && "bg-gold text-white",
          isDone &&
            "bg-gold/15 dark:bg-gold/20 text-gold border border-gold/30",
          !isActive &&
            !isDone &&
            "bg-step-inactive-bg dark:bg-zinc-800 text-step-inactive-text dark:text-zinc-500 border border-step-inactive-border dark:border-zinc-700",
        )}
      >
        {isDone ? (
          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
        ) : (
          stepNumber
        )}
      </div>
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

// ─── Skeleton ────────────────────────────────────────────────────────────────

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

// ─── Inner form ───────────────────────────────────────────────────────────────

function AppointmentFormInner({
  appointment,
  bookingCost = 0,
  daysConfig,
}: Props) {
  const appointmentForm = useCreateAppointmentForm({ appointment, daysConfig });
  const { currentStep, totalSteps } = appointmentForm;

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
      {/* Mobile: progress bar */}
      <div className="lg:hidden px-5 py-4">
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
          {/* Scrollable content — flat, no card */}
          <div className="flex-1 overflow-y-auto px-5 py-2  lg:px-12 lg:py-10">
            {/* Wrapper header — shown on ALL screens */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl lg:text-4xl font-bold text-content dark:text-zinc-100 leading-tight">
                  {currentHeading.heading}
                </h1>
                <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-1">
                  {currentHeading.getSubheading(selectedDate)}
                </p>
                <div className="w-8 h-px mt-2 bg-gold-gradient" />
              </div>
              <div className="text-right max-w-40 shrink-0 ml-4">
                <p className="text-[0.6rem] uppercase tracking-[0.15em] text-gold font-semibold mb-1.5">
                  Paso {currentStep} de {totalSteps}
                </p>
                {currentHeading.rightHint}
              </div>
            </div>

            {/* Step content — constrained width, no card wrapper */}
            <div className="lg:max-w-lg">
              {currentStep === 1 && (
                <DateStep appointmentForm={appointmentForm} hideHeader />
              )}
              {currentStep === 2 && (
                <HourStep appointmentForm={appointmentForm} hideHeader />
              )}
              {currentStep === 3 && (
                <TelephoneStep appointmentForm={appointmentForm} hideHeader />
              )}
              {currentStep === 4 && (
                <ConfirmationStep
                  appointmentForm={appointmentForm}
                  bookingCost={bookingCost}
                  hideHeader
                />
              )}
              {currentStep === 5 && (
                <PaymentStep
                  appointmentForm={appointmentForm}
                  bookingCost={bookingCost}
                  hideHeader
                />
              )}
            </div>
          </div>

          {/* Nav buttons — inside <form> so type="submit" works */}
          <div className="shrink-0 px-5 pb-6 lg:px-12 lg:pb-8">
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

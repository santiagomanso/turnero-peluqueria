"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
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

function FormSkeleton() {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
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
  return (
    <div className="w-full flex flex-col flex-1">
      <ProgressBar appointmentForm={appointmentForm} />
      <form
        onSubmit={appointmentForm.form.handleSubmit(appointmentForm.onSubmit)}
        className="w-full flex flex-col flex-1"
      >
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-border-subtle dark:border-zinc-700 shadow-sm p-5 mb-4 flex flex-col flex-1 overflow-y-auto">
          {appointmentForm.currentStep === 1 && (
            <DateStep appointmentForm={appointmentForm} />
          )}
          {appointmentForm.currentStep === 2 && (
            <HourStep appointmentForm={appointmentForm} />
          )}
          {appointmentForm.currentStep === 3 && (
            <TelephoneStep appointmentForm={appointmentForm} />
          )}
          {appointmentForm.currentStep === 4 && (
            <ConfirmationStep
              appointmentForm={appointmentForm}
              bookingCost={bookingCost}
            />
          )}
          {appointmentForm.currentStep === 5 && (
            <PaymentStep
              appointmentForm={appointmentForm}
              bookingCost={bookingCost}
            />
          )}
        </div>
        <BottomNavigationButtons appointmentForm={appointmentForm} bookingCost={bookingCost} />
      </form>
    </div>
  );
}

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

"use client";

import DateStep from "./date-step";
import HourStep from "./hour-step";
import TelephoneStep from "./telephone-step";
import ConfirmationStep from "./confirmation-step";
import ProgressBar from "./progress-bar";
import BottomNavigationButtons from "./bottom-navigation-buttons";
import useCreateAppointmentForm from "@/app/appointments/_hooks/use-create-appointment-form";
import type { Appointment } from "@/types/appointment";

type Props = {
  appointment?: Appointment;
};

export default function CreateAppointmentForm({ appointment }: Props) {
  const appointmentForm = useCreateAppointmentForm({ appointment });

  return (
    <div className="w-full">
      <ProgressBar appointmentForm={appointmentForm} />

      <form
        onSubmit={appointmentForm.form.handleSubmit(appointmentForm.onSubmit)}
        className="w-full"
      >
        {/* White card wrapping the step content */}
        <div className="bg-white rounded-xl border border-border-subtle shadow-sm p-5 mb-4 min-h-100 flex flex-col w-full">
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
            <ConfirmationStep appointmentForm={appointmentForm} />
          )}
        </div>

        <BottomNavigationButtons appointmentForm={appointmentForm} />
      </form>
    </div>
  );
}

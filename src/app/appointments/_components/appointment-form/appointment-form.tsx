"use client";

import useAppointmentForm from "../hooks/use-appointment-form";

import DateStep from "./date-step";
import HourStep from "./hour-step";
import TelephoneStep from "./telephone-step";
import ConfirmationStep from "./confirmation-step";
import ProgressBar from "./progress-bar";
import BottomNavigationButtons from "./bottom-navigation-buttons";

export default function AppointmentForm() {
  const appointmentForm = useAppointmentForm();

  return (
    <div>
      <ProgressBar appointmentForm={appointmentForm} />
      <form
        onSubmit={appointmentForm.form.handleSubmit(appointmentForm.onSubmit)}
      >
        <div className="mb-5 min-h-100 sm:min-h-100 flex flex-col">
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

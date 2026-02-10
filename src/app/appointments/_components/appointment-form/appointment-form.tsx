"use client";

import useAppointmentForm from "../hooks/use-appointment-form";

import { Button } from "@/components/ui/button";
import DateStep from "./date-step";
import HourStep from "./hour-step";
import TelephoneStep from "./telephone-step";

export default function AppointmentForm() {
  const appointmentForm = useAppointmentForm();

  return (
    <div>
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                step === appointmentForm.currentStep
                  ? "bg-white text-fuchsia-950"
                  : step < appointmentForm.currentStep
                    ? "bg-fuchsia-300 text-fuchsia-950"
                    : "bg-fuchsia-950/50 text-white/50"
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="w-full bg-fuchsia-950/50 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(appointmentForm.currentStep / appointmentForm.totalSteps) * 100}%`,
            }}
          ></div>
        </div>
      </div>

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
        </div>

        <div className="flex justify-between gap-4">
          <Button
            type="button"
            onClick={appointmentForm.handleBack}
            disabled={appointmentForm.currentStep === 1}
            variant="outline"
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              appointmentForm.currentStep === 1
                ? "bg-white/10 text-white/30 cursor-not-allowed"
                : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
            }`}
          >
            Atrás
          </Button>
          {appointmentForm.currentStep < appointmentForm.totalSteps ? (
            <Button
              type="button"
              onClick={appointmentForm.handleNext}
              className="px-6 py-3 rounded-lg font-semibold bg-white text-fuchsia-950 hover:bg-white/90 transition-all"
            >
              Siguiente
            </Button>
          ) : (
            <Button
              type="submit"
              className="px-6 py-3 rounded-lg font-semibold bg-white text-fuchsia-950 hover:bg-white/90 transition-all"
            >
              Enviar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

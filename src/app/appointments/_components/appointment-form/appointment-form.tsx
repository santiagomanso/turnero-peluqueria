"use client";

import useAppointmentForm from "../hooks/use-appointment-form";
import { Controller } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AppointmentForm() {
  const appointmentForm = useAppointmentForm();

  return (
    <div>
      {/* Progress Indicator */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          {[1, 2, 3].map((step) => (
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

      {/* Form */}
      <form
        onSubmit={appointmentForm.form.handleSubmit(appointmentForm.onSubmit)}
      >
        <div className="mb-5">
          {/* Step 1: Date Selection */}
          {appointmentForm.currentStep === 1 && (
            <>
              <h2 className="text-2xl font-bold text-white">Fecha</h2>
              <FieldGroup>
                <Controller
                  name="date"
                  control={appointmentForm.form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="date" className="text-white">
                        Seleccionar fecha
                      </FieldLabel>

                      <Calendar
                        mode="single"
                        selected={field.value || undefined} // ✅ Explicitly pass undefined if no value
                        onSelect={(date) => {
                          // If deselected, set back to today
                          field.onChange(date || new Date());
                        }}
                        locale={es}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        className="rounded-md border border-white/30 bg-white/10"
                      />

                      <FieldDescription className="text-white/70 text-center">
                        Selecciona una fecha para tu cita. Las fechas pasadas no
                        están disponibles.
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className="text-red-300 text-center"
                        />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </>
          )}

          {/* Step 2: Placeholder */}
          {appointmentForm.currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Step 2</h2>
              <p className="text-white">Step 2 content will go here</p>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {appointmentForm.currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Confirm Your Information
              </h2>
              <div className="space-y-4 bg-white/5 rounded-lg p-6">
                <div className="border-b border-white/20 pb-3">
                  <p className="text-white/70 text-sm mb-1">Appointment Date</p>
                  <p className="text-white text-lg font-medium">
                    {appointmentForm.form.getValues("date")
                      ? format(appointmentForm.form.getValues("date"), "PPP")
                      : "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
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
            Back
          </Button>
          {appointmentForm.currentStep < appointmentForm.totalSteps ? (
            <Button
              type="button"
              onClick={appointmentForm.handleNext}
              className="px-6 py-3 rounded-lg font-semibold bg-white text-fuchsia-950 hover:bg-white/90 transition-all"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              className="px-6 py-3 rounded-lg font-semibold bg-white text-fuchsia-950 hover:bg-white/90 transition-all"
            >
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

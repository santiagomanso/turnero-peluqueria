"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DateStep from "@/app/appointments/new/_components/date-step";
import HourStep from "@/app/appointments/new/_components/hour-step";
import TelephoneStep from "@/app/appointments/new/_components/telephone-step";
import useAdminCreateForm from "../_hooks/use-admin-create-form";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// ── Progress bar (3 pasos) ────────────────────────────────────────────
function AdminProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-5 px-1">
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={cn(
            "h-1 rounded-full transition-all flex-1",
            currentStep > step
              ? "bg-gold"
              : currentStep === step
                ? "bg-gold flex-2"
                : "bg-black/10",
          )}
        />
      ))}
    </div>
  );
}

// ── Navigation buttons ────────────────────────────────────────────────
function NavButtons({
  appointmentForm,
}: {
  appointmentForm: ReturnType<typeof useAdminCreateForm>;
}) {
  const isLastStep = appointmentForm.currentStep === appointmentForm.totalSteps;
  const { isSubmitting } = appointmentForm.form.formState;

  return (
    <div className="flex justify-between items-center gap-4 pt-4 border-t border-border-subtle">
      <Button
        type="button"
        onClick={appointmentForm.handleBack}
        disabled={appointmentForm.currentStep === 1 || isSubmitting}
        className="px-6 py-3 rounded-md font-semibold text-sm uppercase tracking-[0.08em] bg-white! border border-border-subtle text-content-secondary shadow-none hover:bg-black/5! transition-all"
      >
        Atrás
      </Button>

      <Button
        key="next-button"
        type="button"
        onClick={appointmentForm.handleNext}
        className={cn(
          "px-6 py-3 rounded-md font-bold text-sm uppercase tracking-[0.08em] bg-gold text-white shadow-md shadow-neutral-300 hover:bg-gold/90 transition-all",
          isLastStep && "hidden",
        )}
      >
        Siguiente
      </Button>

      <Button
        key="submit-button"
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "px-6 py-3 rounded-md font-bold text-sm uppercase tracking-[0.08em] bg-gold text-white shadow-md shadow-neutral-300 hover:bg-gold/90 transition-all",
          !isLastStep && "hidden",
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Guardando...
          </>
        ) : (
          "Crear turno"
        )}
      </Button>
    </div>
  );
}

// ── Form content ──────────────────────────────────────────────────────
function AdminFormContent({ onClose }: { onClose: () => void }) {
  const appointmentForm = useAdminCreateForm(onClose);

  return (
    <form
      onSubmit={appointmentForm.form.handleSubmit(appointmentForm.onSubmit)}
      className="flex flex-col gap-4"
    >
      <AdminProgressBar currentStep={appointmentForm.currentStep} />

      <div className="min-h-85">
        {appointmentForm.currentStep === 1 && (
          <DateStep appointmentForm={appointmentForm} allowToday />
        )}
        {appointmentForm.currentStep === 2 && (
          <HourStep appointmentForm={appointmentForm} />
        )}
        {appointmentForm.currentStep === 3 && (
          <TelephoneStep appointmentForm={appointmentForm} />
        )}
      </div>

      <NavButtons appointmentForm={appointmentForm} />
    </form>
  );
}

// ── Main component ────────────────────────────────────────────────────
export default function AdminCreateAppointment() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="h-9 w-9 p-0 border border-border-subtle bg-white shadow-sm text-content-secondary hover:text-content hover:bg-gold/8 rounded-md transition-all"
      >
        <Plus className="w-4 h-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[min(calc(100vw-2rem),28rem)] bg-white rounded-2xl p-6">
          <DialogHeader className="mb-2">
            <DialogTitle className="font-heebo text-xl font-semibold text-content">
              Nuevo turno
            </DialogTitle>
            <p className="text-xs text-content-tertiary mt-0.5">
              El turno se creará como{" "}
              <strong className="text-content-secondary">PENDIENTE</strong> sin
              pasar por Mercado Pago.
            </p>
          </DialogHeader>
          <AdminFormContent onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

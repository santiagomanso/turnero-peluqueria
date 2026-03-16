"use client";

import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DateStep from "@/app/appointments/new/_components/date-step";
import HourStep from "@/app/appointments/new/_components/hour-step";
import TelephoneStep from "@/app/appointments/new/_components/telephone-step";
import useAdminCreateForm from "../_hooks/use-admin-create-form";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

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
                : "bg-black/10 dark:bg-white/10",
          )}
        />
      ))}
    </div>
  );
}

function NavButtons({
  appointmentForm,
}: {
  appointmentForm: ReturnType<typeof useAdminCreateForm>;
}) {
  const isLastStep = appointmentForm.currentStep === appointmentForm.totalSteps;
  const { isSubmitting } = appointmentForm.form.formState;

  return (
    <div className="flex justify-between items-center gap-4 pt-4 border-t border-border-subtle dark:border-zinc-700">
      <Button
        type="button"
        variant="outline"
        onClick={appointmentForm.handleBack}
        disabled={appointmentForm.currentStep === 1 || isSubmitting}
        className="px-6 py-3 rounded-md font-semibold text-sm uppercase tracking-[0.08em] shadow-none"
      >
        Atrás
      </Button>

      <Button
        type="button"
        onClick={appointmentForm.handleNext}
        className={cn(
          "px-6 py-3 rounded-md font-bold text-sm uppercase tracking-[0.08em] bg-gold text-white shadow-md hover:bg-gold/90 transition-all",
          isLastStep && "hidden",
        )}
      >
        Siguiente
      </Button>

      <Button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "px-6 py-3 rounded-md font-bold text-sm uppercase tracking-[0.08em] bg-gold text-white shadow-md hover:bg-gold/90 transition-all",
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

export default function AdminCreateAppointment({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(calc(100vw-2rem),28rem)] bg-white dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 rounded-2xl p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="font-heebo text-xl font-semibold text-content dark:text-zinc-100">
            Nuevo turno
          </DialogTitle>

          <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-0.5">
            El turno se creará como{" "}
            <strong className="text-content-secondary dark:text-zinc-300">
              PENDIENTE
            </strong>{" "}
            sin pasar por Mercado Pago.
          </p>
        </DialogHeader>

        <AdminFormContent onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

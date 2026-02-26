import useCreateAppointmentForm from "@/app/appointments/_hooks/use-create-appointment-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  appointmentForm: ReturnType<typeof useCreateAppointmentForm>;
};

export default function BottomNavigationButtons({ appointmentForm }: Props) {
  const isLastStep = appointmentForm.currentStep === appointmentForm.totalSteps;
  const { isSubmitted, isSubmitting } = appointmentForm.form.formState;
  const isPaymentStep = appointmentForm.currentStep === 2;

  return (
    <div className="flex justify-between items-center gap-4">
      <Button
        type="button"
        onClick={appointmentForm.handleBack}
        disabled={
          appointmentForm.currentStep === 1 ||
          isSubmitting ||
          isSubmitted ||
          appointmentForm.isRedirecting
        }
        className="px-6 py-3 rounded-md font-semibold text-sm uppercase tracking-[0.08em] bg-white! border border-border-subtle text-content-secondary shadow-none hover:bg-black/5! transition-all"
      >
        Atrás
      </Button>

      {!isLastStep ? (
        <Button
          key="next-button"
          type="button"
          onClick={appointmentForm.handleNext}
          disabled={appointmentForm.isRedirecting}
          className="px-6 py-3 rounded-md font-bold text-sm uppercase tracking-[0.08em] bg-gold text-white shadow-md shadow-neutral-300 hover:bg-gold/90 transition-all"
        >
          {appointmentForm.isRedirecting && isPaymentStep ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Redirigiendo...
            </>
          ) : (
            "Siguiente"
          )}
        </Button>
      ) : (
        <Button
          key="submit-button"
          type="submit"
          disabled={
            isSubmitting || isSubmitted || appointmentForm.isRedirecting
          }
          className="px-6 py-3 rounded-md font-bold text-sm uppercase tracking-[0.08em] bg-gold text-white shadow-md shadow-neutral-300 hover:bg-gold/90 transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Guardando...
            </>
          ) : appointmentForm.isEditing ? (
            "Confirmar"
          ) : (
            "Pagar"
          )}
        </Button>
      )}
    </div>
  );
}

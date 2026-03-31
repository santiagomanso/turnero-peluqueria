import useCreateAppointmentForm from "@/app/appointments/_hooks/use-create-appointment-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  appointmentForm: ReturnType<typeof useCreateAppointmentForm>;
  bookingCost?: number;
};

export default function BottomNavigationButtons({ appointmentForm }: Props) {
  const isLastStep = appointmentForm.currentStep === appointmentForm.totalSteps;
  const { isSubmitted, isSubmitting } = appointmentForm.form.formState;

  const submitLabel = appointmentForm.isEditing ? "Confirmar" : "Pagar";

  return (
    <div className="flex justify-between items-center gap-4 pt-4 border-t border-border-subtle dark:border-zinc-800">
      <Button
        type="button"
        onClick={appointmentForm.handleBack}
        disabled={
          appointmentForm.currentStep === 1 ||
          isSubmitting ||
          isSubmitted ||
          appointmentForm.isRedirecting
        }
        className="px-6 py-3 rounded-md font-semibold text-sm bg-white! dark:bg-zinc-800! border border-border-subtle dark:border-zinc-700 text-content-secondary dark:text-zinc-400 shadow-none hover:bg-black/5! dark:hover:bg-zinc-700! transition-all"
      >
        Atrás
      </Button>

      {!isLastStep ? (
        <Button
          key="next-button"
          type="button"
          onClick={appointmentForm.handleNext}
          disabled={appointmentForm.isRedirecting}
          className="px-6 py-3 rounded-md font-bold text-sm bg-gold text-white hover:bg-gold/90 transition-all"
        >
          Siguiente
        </Button>
      ) : (
        <Button
          key="submit-button"
          type="submit"
          disabled={
            isSubmitting ||
            isSubmitted ||
            appointmentForm.isRedirecting ||
            appointmentForm.isValidatingDiscount
          }
          className="px-5 py-3 rounded-md font-bold text-sm bg-gold text-white hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || appointmentForm.isRedirecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              {appointmentForm.isRedirecting
                ? "Redirigiendo..."
                : "Guardando..."}
            </>
          ) : (
            submitLabel
          )}
        </Button>
      )}
    </div>
  );
}

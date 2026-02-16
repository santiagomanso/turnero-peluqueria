import useCreateAppointmentForm from "@/app/appointments/_hooks/use-create-appointment-form";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";

type Props = {
  appointmentForm: ReturnType<typeof useCreateAppointmentForm>;
};

export default function BottomNavigationButtons({ appointmentForm }: Props) {
  const isLastStep = appointmentForm.currentStep === appointmentForm.totalSteps;
  const { isSubmitted, isSubmitting } = appointmentForm.form.formState;

  return (
    <div className="flex justify-between items-center gap-4">
      <Button
        type="button"
        onClick={appointmentForm.handleBack}
        disabled={
          appointmentForm.currentStep === 1 || isSubmitting || isSubmitted
        }
        variant="outline"
        className="px-6 py-3 rounded-lg font-semibold"
      >
        Atrás
      </Button>

      {!isLastStep ? (
        <Button
          key="next-button"
          type="button"
          onClick={appointmentForm.handleNext}
          className="px-6 py-3 rounded-lg font-semibold bg-white text-fuchsia-950"
        >
          Siguiente
        </Button>
      ) : (
        <Button
          key="submit-button"
          type="submit"
          disabled={isSubmitting || isSubmitted}
          className="px-6 py-3 rounded-lg font-semibold bg-white text-fuchsia-950"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Confirmando...
            </>
          ) : (
            "Confirmar turno"
          )}
        </Button>
      )}
    </div>
  );
}

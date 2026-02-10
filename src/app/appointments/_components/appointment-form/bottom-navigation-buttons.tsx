import { Button } from "@/components/ui/button";
import useAppointmentForm from "../hooks/use-appointment-form";

type Props = {
  appointmentForm: ReturnType<typeof useAppointmentForm>;
};

export default function BottomNavigationButtons({ appointmentForm }: Props) {
  return (
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
  );
}

import useCreateAppointmentForm from "@/app/appointments/_hooks/use-create-appointment-form";
import { cn } from "@/lib/utils";

type Props = { appointmentForm: ReturnType<typeof useCreateAppointmentForm> };

function Step({ step, currentStep }: { step: number; currentStep: number }) {
  const isActive = currentStep === step;
  const isDone = currentStep > step;
  return (
    <div
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all",
        isActive && "bg-gold text-white",
        isDone && "bg-gold-soft text-gold border border-gold-border",
        !isActive &&
          !isDone &&
          "bg-step-inactive-bg text-step-inactive-text border border-step-inactive-border dark:bg-zinc-800 dark:text-zinc-500 dark:border-zinc-700",
      )}
    >
      {step}
    </div>
  );
}

function Line({ done }: { done: boolean }) {
  return (
    <div
      className={cn(
        "flex-1 h-px mx-2 transition-all",
        done ? "bg-gold/40" : "bg-black/8 dark:bg-white/10",
      )}
    />
  );
}

export default function ProgressBar({ appointmentForm }: Props) {
  const { currentStep } = appointmentForm;
  return (
    <div className="flex flex-row items-center w-full">
      <Step step={1} currentStep={currentStep} />
      <Line done={currentStep > 1} />
      <Step step={2} currentStep={currentStep} />
      <Line done={currentStep > 2} />
      <Step step={3} currentStep={currentStep} />
      <Line done={currentStep > 3} />
      <Step step={4} currentStep={currentStep} />
      <Line done={currentStep > 4} />
      <Step step={5} currentStep={currentStep} />
    </div>
  );
}

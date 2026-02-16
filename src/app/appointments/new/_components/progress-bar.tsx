import useCreateAppointmentForm from "@/app/appointments/_hooks/use-create-appointment-form";

type Props = {
  appointmentForm: ReturnType<typeof useCreateAppointmentForm>;
};

export default function ProgressBar({ appointmentForm }: Props) {
  return (
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
  );
}

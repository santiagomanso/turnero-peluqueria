import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  date: z.date({
    error: "Por favor seleccione una fecha.",
  }),
  time: z
    .string({
      error: "Por favor seleccione un horario.",
    })
    .min(1, "Por favor seleccione un horario."),
});

type FormType = z.infer<typeof formSchema>;

export default function useAppointmentForm() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 3;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      date: tomorrow,
      time: "",
    },
  });

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormType)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["date"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["time"];
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: FormType) => {
    console.log("Form submitted:", data);
  };

  // Available appointment times
  const availableTimes = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  return {
    form,
    currentStep,
    totalSteps,
    handleNext,
    handleBack,
    onSubmit,
    availableTimes,
  };
}

"use client";

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
  telephone: z.string().min(9, "Teléfono inválido."),
});

type FormType = z.infer<typeof formSchema>;

export default function useAppointmentForm() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 4; // Already set to 4

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      date: tomorrow,
      time: "",
      telephone: "",
    },
  });

  const handleNext = async () => {
    const stepFieldsMap: Record<number, (keyof FormType)[]> = {
      1: ["date"],
      2: ["time"],
      3: ["telephone"],
      // Step 4 is confirmation - no validation needed
    };

    const fieldsToValidate = stepFieldsMap[currentStep] || [];
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

    // Here's where you would send to your database
    // Example structure of what would be sent:
    const appointmentData = {
      date: data.date.toISOString(), // Convert to ISO string for database
      time: data.time,
      telephone: data.telephone,
      createdAt: new Date().toISOString(),
    };

    console.log("Data to send to database:", appointmentData);

    // Example API call (uncomment when ready):
    // fetch('/api/appointments', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(appointmentData),
    // });
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

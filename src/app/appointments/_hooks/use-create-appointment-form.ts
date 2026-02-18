"use client";

import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAppointmentAction } from "../_actions/create";
import { updateAppointmentAction } from "../_actions/update";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Appointment } from "@/types/appointment";

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

type UseAppointmentFormOptions = {
  appointment?: Appointment; // Optional: if provided, we're editing
  mode?: "create" | "update";
};

export default function useCreateAppointmentForm(
  options?: UseAppointmentFormOptions,
) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 4;

  const router = useRouter();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  // Determine if we're editing or creating
  const isEditing = !!options?.appointment;

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: isEditing
      ? {
          // Pre-fill with existing data
          date: new Date(options.appointment!.date),
          time: options.appointment!.time,
          telephone: options.appointment!.telephone,
        }
      : {
          // Default values for new appointment
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
    };

    const fieldsToValidate = stepFieldsMap[currentStep] || [];
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && !form.formState.isSubmitting) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: FormType) => {
    try {
      const response = isEditing
        ? await updateAppointmentAction({
            id: options.appointment!.id,
            date: data.date,
            time: data.time,
            telephone: data.telephone,
          })
        : await createAppointmentAction({
            date: data.date,
            time: data.time,
            telephone: data.telephone,
          });

      if (response.success) {
        toast.success(
          isEditing
            ? "Turno actualizado correctamente 🎉"
            : "Turno creado correctamente 🎉",
        );

        if (!isEditing) {
          form.reset();
        }

        router.push(isEditing ? "/appointments/get" : "/");
      } else {
        toast.error(response.error ?? "Error al procesar el turno");
      }
    } catch (error) {
      toast.error("Error inesperado");
    }
  };

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

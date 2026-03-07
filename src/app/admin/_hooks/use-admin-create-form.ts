"use client";

import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createAdminAppointmentAction } from "../_actions/create-admin-appointment";

const formSchema = z.object({
  date: z.date({ error: "Por favor seleccione una fecha." }),
  time: z.string().min(1, "Por favor seleccione un horario."),
  telephone: z.string().min(9, "Teléfono inválido."),
});

type FormType = z.infer<typeof formSchema>;

import { useAdminAppointments } from "../_hooks/use-admin-appointments";

export default function useAdminCreateForm(onSuccess?: () => void) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 3;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: today,
      time: "",
      telephone: "",
    },
  });

  const handleNext = async () => {
    const stepFieldsMap: Record<number, (keyof FormType)[]> = {
      1: ["date"],
      2: ["time"],
    };
    const fieldsToValidate = stepFieldsMap[currentStep] || [];
    const isValid = await form.trigger(fieldsToValidate);
    if (!isValid) return;
    if (currentStep < totalSteps) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1 && !form.formState.isSubmitting) {
      setCurrentStep((s) => s - 1);
    }
  };

  const { handleRefresh } = useAdminAppointments();

  const onSubmit = async (data: FormType) => {
    const result = await createAdminAppointmentAction(data);
    if (result.success) {
      toast.success("Turno creado correctamente ✓");
      form.reset({ date: today, time: "", telephone: "" });
      setCurrentStep(1);
      handleRefresh();
      onSuccess?.();
    } else {
      toast.error(result.error ?? "Error al crear el turno");
    }
  };

  // Shape compatible con los steps existentes
  return {
    form,
    currentStep,
    totalSteps,
    isEditing: false,
    isRedirecting: false,
    handleNext,
    handleBack,
    onSubmit,
  };
}

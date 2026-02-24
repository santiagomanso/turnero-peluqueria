"use client";

import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAppointmentAction } from "../_actions/update";
import { createAppointmentAction } from "../_actions/create";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import type { Appointment } from "@/types/appointment";
import { createPaymentPreferenceAction } from "../_actions/payment-preference";

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
  appointment?: Appointment;
  mode?: "create" | "update";
};

export default function useCreateAppointmentForm(
  options?: UseAppointmentFormOptions,
) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const [isAutoCreating, setIsAutoCreating] = React.useState(false);
  const totalSteps = 4;

  const router = useRouter();
  const searchParams = useSearchParams();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const isEditing = !!options?.appointment;

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: isEditing
      ? {
          date: new Date(options.appointment!.date),
          time: options.appointment!.time,
          telephone: options.appointment!.telephone,
        }
      : {
          date: tomorrow,
          time: "",
          telephone: "",
        },
  });

  React.useEffect(() => {
    const status = searchParams.get("status");
    const collectionStatus = searchParams.get("collection_status");

    if (status === "approved" || collectionStatus === "approved") {
      router.push("/appointments/new/success");
    }

    if (status === "failure") {
      toast.error("El pago no pudo procesarse. Intentá de nuevo.");
    }
  }, [searchParams]);

  const handleNext = async () => {
    const stepFieldsMap: Record<number, (keyof FormType)[]> = {
      1: ["date"],
      2: ["time"],
      3: ["telephone"],
    };

    const fieldsToValidate = stepFieldsMap[currentStep] || [];
    const isValid = await form.trigger(fieldsToValidate);

    if (!isValid) return;

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && !form.formState.isSubmitting) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: FormType) => {
    if (isEditing) {
      try {
        const response = await updateAppointmentAction({
          id: options.appointment!.id,
          date: data.date,
          time: data.time,
          telephone: data.telephone,
        });

        if (response.success) {
          toast.success("Turno actualizado correctamente 🎉");
          router.push("/appointments/get");
        } else {
          toast.error(response.error ?? "Error al actualizar el turno");
        }
      } catch {
        toast.error("Error inesperado");
      }
      return;
    }

    const dateStr = data.date.toISOString().split("T")[0];
    setIsRedirecting(true);

    const response = await createPaymentPreferenceAction({
      date: dateStr,
      hour: data.time,
      telephone: data.telephone,
    });

    if (!response.success || !response.initPoint) {
      toast.error(response.error ?? "Error al iniciar el pago");
      setIsRedirecting(false);
      return;
    }

    router.push(response.initPoint);
  };

  return {
    form,
    currentStep,
    totalSteps,
    handleNext,
    handleBack,
    onSubmit,
    isRedirecting,
    isAutoCreating,
  };
}

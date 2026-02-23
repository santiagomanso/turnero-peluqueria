"use client";

import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAppointmentAction } from "../_actions/create";
import { updateAppointmentAction } from "../_actions/update";
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

  // On mount — check if we're returning from MP payment
  React.useEffect(() => {
    const status = searchParams.get("status");
    const paymentId = searchParams.get("payment_id") ?? undefined;
    const dateParam = searchParams.get("date");
    const hourParam = searchParams.get("hour");
    const telephoneParam = searchParams.get("telephone");

    if (
      status === "approved" &&
      paymentId &&
      dateParam &&
      hourParam &&
      telephoneParam
    ) {
      const [year, month, day] = dateParam.split("-").map(Number);
      const date = new Date(year, month - 1, day, 0, 0, 0, 0);

      setIsAutoCreating(true);

      createAppointmentAction({
        date,
        time: decodeURIComponent(hourParam),
        telephone: decodeURIComponent(telephoneParam),
        paymentId,
      }).then((response) => {
        if (response.success) {
          toast.success("Turno creado correctamente 🎉");
          router.push("/appointments/new/success");
        } else {
          toast.error(response.error ?? "Error al crear el turno");
          setIsAutoCreating(false);
        }
      });

      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
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

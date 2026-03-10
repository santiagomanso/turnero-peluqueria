"use client";

import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAppointmentAction } from "../_actions/update";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import type { Appointment } from "@/types/appointment";
import { createPaymentPreferenceAction } from "../_actions/mercadopago";
import {
  getAvailabilityAction,
  type AvailableHour,
} from "../_actions/get-availability";
import type { DaysConfig } from "@/types/config";
import { validateDiscountAction } from "../_actions/validate-discount";

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
  daysConfig?: DaysConfig | null;
};

const dayKeyMap: Record<number, keyof DaysConfig> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

function getNextAvailableDate(
  daysConfig: DaysConfig | null | undefined,
  fullDates: Date[] = [],
): Date {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);

  if (!daysConfig) return date;

  for (let i = 0; i < 60; i++) {
    const key = dayKeyMap[date.getUTCDay()];
    const isFull = fullDates.some(
      (d) => d.toDateString() === date.toDateString(),
    );
    if (daysConfig[key] && !isFull) return date;
    date.setDate(date.getDate() + 1);
  }

  return date;
}

export default function useCreateAppointmentForm(
  options?: UseAppointmentFormOptions,
) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const [availableHours, setAvailableHours] = React.useState<AvailableHour[]>(
    [],
  );
  const [isLoadingHours, setIsLoadingHours] = React.useState(false);
  const [appliedDiscount, setAppliedDiscount] = React.useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [isValidatingDiscount, setIsValidatingDiscount] = React.useState(false);
  const [fullDates, setFullDates] = React.useState<Date[]>([]);

  const totalSteps = 4;

  const router = useRouter();
  const searchParams = useSearchParams();

  const isEditing = !!options?.appointment;

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: isEditing
      ? {
          date: new Date(options.appointment!.date),
          time: options.appointment!.time,
          telephone: options.appointment!.telephone.replace(/^549/, ""),
        }
      : {
          date: getNextAvailableDate(options?.daysConfig),
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

  const selectedDate = form.watch("date");

  React.useEffect(() => {
    if (!selectedDate) return;
    setIsLoadingHours(true);
    getAvailabilityAction(selectedDate).then((res) => {
      if (res.success && res.hours) setAvailableHours(res.hours);
      setIsLoadingHours(false);
    });
  }, [selectedDate]);

  const applyDiscount = async (code: string) => {
    if (!code.trim()) return;
    setIsValidatingDiscount(true);
    const result = await validateDiscountAction(code);
    if (result.success) {
      setAppliedDiscount({ code: result.code, discount: result.discount });
      toast.success(`Código aplicado: ${result.discount}% de descuento`);
    } else {
      toast.error(result.error);
    }
    setIsValidatingDiscount(false);
  };

  const removeDiscount = () => setAppliedDiscount(null);

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
      discountCode: appliedDiscount?.code ?? null,
    });

    if (!response.success || !response.initPoint) {
      toast.error(response.error ?? "Error al iniciar el pago");
      if ("hourFull" in response && response.hourFull) {
        const availability = await getAvailabilityAction(data.date);
        if (availability.success && availability.hours) {
          setAvailableHours(availability.hours);
          const anyAvailable = availability.hours.some((h) => h.available);
          if (!anyAvailable) {
            const newFullDates = [...fullDates, data.date];
            setFullDates(newFullDates);
            const nextDate = getNextAvailableDate(
              options?.daysConfig,
              newFullDates,
            );
            form.setValue("date", nextDate);
            form.setValue("time", "");
            setCurrentStep(1);
          } else {
            form.setValue("time", "");
            setCurrentStep(2);
          }
        }
      }
      setIsRedirecting(false);
      return;
    }

    router.push(response.initPoint);
  };

  return {
    form,
    currentStep,
    totalSteps,
    isEditing,
    handleNext,
    handleBack,
    onSubmit,
    isRedirecting,
    availableHours,
    isLoadingHours,
    daysConfig: options?.daysConfig ?? null,
    appliedDiscount,
    isValidatingDiscount,
    applyDiscount,
    removeDiscount,
    fullDates,
  };
}

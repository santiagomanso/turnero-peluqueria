"use client";

import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/app/shop/_store/use-cart";
import { createOrderAction } from "@/app/shop/_actions/create-order";
import { createShopPreferenceAction } from "@/app/shop/_actions/create-shop-preference";
import { validateCartAction } from "@/app/shop/_actions/validate-cart";
import type { PaymentMethod } from "@/types/shop";

// ─── Schema ────────────────────────────────────────────────────────────────────

export const checkoutSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100),
  telephone: z.string().min(8, "Ingresá un número de teléfono válido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  note: z.string().max(500).optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

// ─── Hook ──────────────────────────────────────────────────────────────────────

export default function useCheckoutForm() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [paymentMethod, setPaymentMethod] =
    React.useState<PaymentMethod>("mercadopago");
  const [globalError, setGlobalError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const totalSteps = 3;

  const router = useRouter();
  const items = useCart((s) => s.items);
  const saveLastOrder = useCart((s) => s.saveLastOrder);
  const removeFromCart = useCart((s) => s.remove);
  const clearCart = useCart((s) => s.clearCart);
  const totalPrice = useCart((s) => s.totalPrice);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      telephone: "",
      email: "",
      note: "",
    },
  });

  // ─── Step navigation ─────────────────────────────────────────────────────

  const handleNext = async () => {
    const stepFieldsMap: Record<number, (keyof CheckoutFormValues)[]> = {
      1: [],
      2: ["name", "telephone", "email", "note"],
    };

    const fieldsToValidate = stepFieldsMap[currentStep] ?? [];
    if (fieldsToValidate.length > 0) {
      const isValid = await form.trigger(fieldsToValidate);
      if (!isValid) return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  // ─── Submit ───────────────────────────────────────────────────────────────

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    setGlobalError(null);

    try {
      // ── Validate stock & active status before creating the order ──
      const validation = await validateCartAction(
        items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      );

      if (!validation.valid) {
        // Inactive products → remove from cart, redirect to shop
        if (validation.inactive.length > 0) {
          const names = validation.inactive.map((p) => p.name);
          for (const p of validation.inactive) {
            removeFromCart(p.productId);
          }
          toast.error(
            `${names.join(", ")} ya no ${names.length === 1 ? "está disponible" : "están disponibles"}. ${names.length === 1 ? "Fue removido" : "Fueron removidos"} de tu carrito.`,
          );
          setIsSubmitting(false);
          router.push("/shop");
          return;
        }

        // Out of stock → remove from cart, stay on checkout
        if (validation.outOfStock.length > 0) {
          for (const p of validation.outOfStock) {
            removeFromCart(p.productId);
          }
          const messages = validation.outOfStock.map((p) =>
            p.available === 0
              ? `"${p.name}" se quedó sin stock`
              : `"${p.name}" solo tiene ${p.available} en stock`,
          );
          toast.error(messages.join(". ") + ". Revisá tu pedido.");
          setIsSubmitting(false);
          setCurrentStep(1);
          return;
        }
      }

      // ── Create the order ──
      const orderResult = await createOrderAction({
        name: data.name,
        telephone: data.telephone,
        email: data.email || undefined,
        note: data.note || undefined,
        paymentMethod,
        items: items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
        })),
      });

      if (!orderResult.success) {
        setGlobalError(orderResult.error);
        setIsSubmitting(false);
        return;
      }

      if (paymentMethod === "mercadopago") {
        saveLastOrder();
        const mpResult = await createShopPreferenceAction(orderResult.order);
        if (!mpResult.success) {
          setGlobalError(mpResult.error);
          setIsSubmitting(false);
          return;
        }
        window.location.href = mpResult.initPoint;
      } else {
        saveLastOrder();
        clearCart();
        router.push(
          `/shop/checkout/success?orderId=${orderResult.order.id}&method=local`,
        );
      }
    } catch {
      setGlobalError("Ocurrió un error inesperado. Intentá de nuevo.");
      setIsSubmitting(false);
    }
  };

  return {
    form,
    currentStep,
    totalSteps,
    handleNext,
    handleBack,
    onSubmit,
    paymentMethod,
    setPaymentMethod,
    globalError,
    isSubmitting,
    items,
    total: totalPrice(),
  };
}

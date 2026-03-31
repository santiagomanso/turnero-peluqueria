"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type useCheckoutForm from "../_hooks/use-checkout-form";

type Props = {
  checkout: ReturnType<typeof useCheckoutForm>;
};

export default function CheckoutNavButtons({ checkout }: Props) {
  const { currentStep, totalSteps, handleNext, handleBack, isSubmitting, total, paymentMethod } =
    checkout;

  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  const submitLabel =
    paymentMethod === "mercadopago"
      ? `Pagar $${total.toLocaleString("es-AR")} con MercadoPago`
      : `Confirmar pedido — $${total.toLocaleString("es-AR")}`;

  return (
    <div className="flex items-center justify-between gap-3 pt-4 border-t border-border-subtle dark:border-zinc-800">
      {/* Back — always rendered, invisible on step 1 */}
      <Button
        type="button"
        onClick={handleBack}
        disabled={isSubmitting}
        className={cn(
          "px-5 py-2.5 rounded-xl font-semibold text-sm bg-white! dark:bg-zinc-800! border border-border-subtle dark:border-zinc-700 text-content-secondary dark:text-zinc-400 shadow-none hover:bg-black/5! dark:hover:bg-zinc-700! transition-all",
          isFirstStep && "invisible pointer-events-none",
        )}
      >
        Atrás
      </Button>

      {/* Right slot — Next and Submit always rendered; one is invisible */}
      <div className="flex items-center gap-2">
        {/* Next — invisible on last step */}
        <Button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className={cn(
            "px-5 py-2.5 rounded-xl font-bold text-sm bg-gold text-white hover:bg-gold/90 transition-all",
            isLastStep && "invisible pointer-events-none absolute",
          )}
        >
          Siguiente
        </Button>

        {/* Submit — invisible on non-last steps */}
        <Button
          type="submit"
          disabled={isSubmitting || checkout.items.length === 0}
          className={cn(
            "px-5 py-2.5 rounded-xl font-bold text-sm bg-gold text-white hover:bg-gold/90 transition-all disabled:opacity-50",
            !isLastStep && "invisible pointer-events-none absolute",
          )}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </div>
  );
}

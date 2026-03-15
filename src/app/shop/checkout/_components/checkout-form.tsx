"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import useCheckoutForm from "../_hooks/use-checkout-form";
import StepCart from "./step-cart";
import StepContact from "./step-contact";
import StepPayment from "./step-payment";
import CheckoutNavButtons from "./checkout-nav-buttons";

// ─── Step labels ───────────────────────────────────────────────────────────────

const STEP_LABELS = ["Tu pedido", "Tus datos", "Método de pago"];

// ─── Progress indicator ────────────────────────────────────────────────────────

function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isDone = step < currentStep;
        const isActive = step === currentStep;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.6rem] font-extrabold transition-all ${
                isDone
                  ? "bg-gold text-white"
                  : isActive
                    ? "bg-gold text-white ring-4 ring-gold/20"
                    : "bg-surface dark:bg-zinc-800 text-content-quaternary dark:text-zinc-500 border border-border-subtle dark:border-zinc-700"
              }`}
            >
              {isDone ? "✓" : step}
            </div>
            <span
              className={`text-[0.65rem] font-semibold transition-colors ${
                isActive
                  ? "text-content dark:text-zinc-100"
                  : "text-content-quaternary dark:text-zinc-600"
              }`}
            >
              {STEP_LABELS[i]}
            </span>
            {step < totalSteps && (
              <div
                className={`h-px w-4 transition-colors ${
                  isDone
                    ? "bg-gold"
                    : "bg-border-subtle dark:bg-zinc-700"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Empty cart ────────────────────────────────────────────────────────────────

function EmptyCartMessage() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <ShoppingBag
        className="w-12 h-12 text-content-quaternary dark:text-zinc-600"
        strokeWidth={1.5}
      />
      <p className="text-sm font-semibold text-content dark:text-zinc-100">
        Tu carrito está vacío
      </p>
      <Link
        href="/shop"
        className="text-xs font-semibold text-gold hover:underline"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}

// ─── Main checkout form ────────────────────────────────────────────────────────

export default function CheckoutForm() {
  const checkout = useCheckoutForm();
  const { form, currentStep, totalSteps, onSubmit, globalError, items } =
    checkout;

  if (items.length === 0) {
    return <EmptyCartMessage />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-8"
    >
      {/* Back link */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-1 text-xs text-content-tertiary dark:text-zinc-500 hover:text-gold transition-colors mb-5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Volver a la tienda
      </Link>

      {/* Step indicator */}
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

      {/* Step heading */}
      <div className="mb-4">
        <h2 className="text-sm font-extrabold text-content dark:text-zinc-100 mb-1">
          {STEP_LABELS[currentStep - 1]}
        </h2>
        <div className="w-7 h-px bg-gold-gradient" />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* ─── Step content ─────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.18 }}
          >
            {currentStep === 1 && (
              <StepCart items={checkout.items} total={checkout.total} />
            )}
            {currentStep === 2 && (
              <StepContact form={form} />
            )}
            {currentStep === 3 && (
              <StepPayment
                value={checkout.paymentMethod}
                onChange={checkout.setPaymentMethod}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* ─── Global error ─────────────────────────────────────────── */}
        {globalError && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 text-xs text-red-700 dark:text-red-400 font-medium"
          >
            {globalError}
          </motion.div>
        )}

        {/* ─── Navigation buttons — always rendered ─────────────────── */}
        <CheckoutNavButtons checkout={checkout} />
      </form>
    </motion.div>
  );
}

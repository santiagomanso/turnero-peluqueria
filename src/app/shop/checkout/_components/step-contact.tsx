"use client";

import React from "react";
import { User, Phone, Mail, MessageSquare } from "lucide-react";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { CheckoutFormValues } from "../_hooks/use-checkout-form";
import { formatPhoneAsYouType } from "@/lib/format-phone";

// ─── Shared form field wrapper ─────────────────────────────────────────────────

function FormField({
  icon: Icon,
  label,
  error,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-content dark:text-zinc-300">
        <Icon className="w-3.5 h-3.5 text-content-tertiary dark:text-zinc-500" />
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[0.6rem] text-red-500 dark:text-red-400 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Step contact ──────────────────────────────────────────────────────────────

const inputClass =
  "w-full rounded-lg border border-border-subtle dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm text-content dark:text-zinc-100 placeholder:text-content-quaternary dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all";

export default function StepContact({
  form,
}: {
  form: UseFormReturn<CheckoutFormValues>;
}) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-3">
      <FormField icon={User} label="Nombre" error={errors.name?.message}>
        <input
          {...register("name")}
          placeholder="Tu nombre"
          className={inputClass}
        />
      </FormField>

      <FormField
        icon={Phone}
        label="Teléfono (WhatsApp)"
        error={errors.telephone?.message}
      >
        <Controller
          name="telephone"
          control={control}
          render={({ field }) => (
            <input
              type="tel"
              value={formatPhoneAsYouType(field.value)}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                field.onChange(digits);
              }}
              placeholder="3794 123456"
              className={inputClass}
            />
          )}
        />
      </FormField>

      <FormField
        icon={Mail}
        label="Email (opcional)"
        error={errors.email?.message}
      >
        <input
          {...register("email")}
          type="email"
          placeholder="tu@email.com"
          className={inputClass}
        />
      </FormField>

      <FormField
        icon={MessageSquare}
        label="Nota (opcional)"
        error={errors.note?.message}
      >
        <textarea
          {...register("note")}
          rows={2}
          placeholder="Algún comentario para tu pedido..."
          className={`${inputClass} resize-none`}
        />
      </FormField>
    </div>
  );
}

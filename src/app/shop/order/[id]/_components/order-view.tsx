"use client";

import { motion } from "framer-motion";
import {
  Package,
  User,
  Phone,
  Store,
  CreditCard,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/shop";

// ─── Status visual ────────────────────────────────────────────────────────────

const STATUS_STEPS: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: "PENDING",    label: "Recibido",          icon: <Clock className="w-4 h-4" /> },
  { status: "PROCESSING", label: "En preparación",    icon: <Package className="w-4 h-4" /> },
  { status: "READY",      label: "Listo para retirar", icon: <Store className="w-4 h-4" /> },
  { status: "PICKED_UP",  label: "Retirado",           icon: <CheckCircle2 className="w-4 h-4" /> },
];

function StatusTracker({ status }: { status: OrderStatus }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
        <span className="text-sm font-semibold text-red-700 dark:text-red-400">
          Pedido cancelado
        </span>
      </div>
    );
  }

  const currentIdx = STATUS_STEPS.findIndex((s) => s.status === status);

  return (
    <div className="flex items-center gap-0">
      {STATUS_STEPS.map((step, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        return (
          <div key={step.status} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  isDone
                    ? "bg-gold text-white"
                    : isActive
                      ? "bg-gold text-white ring-4 ring-gold/20"
                      : "bg-surface dark:bg-zinc-800 text-content-quaternary dark:text-zinc-600 border border-border-subtle dark:border-zinc-700",
                )}
              >
                {step.icon}
              </div>
              <span
                className={cn(
                  "text-[0.55rem] font-semibold text-center leading-tight max-w-[56px]",
                  isActive
                    ? "text-gold"
                    : isDone
                      ? "text-content-secondary dark:text-zinc-400"
                      : "text-content-quaternary dark:text-zinc-600",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-1 mb-5 transition-colors",
                  i < currentIdx ? "bg-gold" : "bg-border-subtle dark:bg-zinc-700",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export default function OrderView({ order }: { order: Order }) {
  const subtotal = order.items.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 pb-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-content-tertiary dark:text-zinc-500">
            Pedido
          </p>
          <p className="font-mono font-extrabold text-lg text-gold leading-tight">
            #{order.id.slice(-6).toUpperCase()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-content-tertiary dark:text-zinc-500">
            Fecha
          </p>
          <p className="text-sm font-medium text-content dark:text-zinc-300">
            {new Date(order.createdAt).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Status tracker */}
      <div className="rounded-xl border border-border-subtle dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-content-quaternary dark:text-zinc-500 mb-4">
          Estado del pedido
        </p>
        <StatusTracker status={order.status} />
      </div>

      {/* Customer */}
      <div className="rounded-xl border border-border-subtle dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-content-quaternary dark:text-zinc-500">
          Datos de contacto
        </p>
        <div className="flex items-center gap-2.5">
          <User className="w-3.5 h-3.5 text-gold shrink-0" />
          <span className="text-sm font-medium text-content dark:text-zinc-100">
            {order.name ?? "Sin nombre"}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
          <span className="text-sm text-content-secondary dark:text-zinc-400">
            +{order.telephone}
          </span>
        </div>
      </div>

      {/* Products */}
      <div className="rounded-xl border border-border-subtle dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <p className="text-xs font-semibold uppercase tracking-wider text-content-quaternary dark:text-zinc-500 px-4 pt-4 pb-3">
          Productos ({order.items.length})
        </p>
        {order.items.map((item, i) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 border-t border-border-subtle dark:border-zinc-800",
              i % 2 === 0
                ? "bg-white dark:bg-zinc-900"
                : "bg-surface/50 dark:bg-zinc-800/50",
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
              <Package className="w-4 h-4 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-content dark:text-zinc-100 truncate">
                {item.productName}
              </p>
              <p className="text-xs text-content-tertiary dark:text-zinc-500">
                x{item.quantity} · ${item.unitPrice.toLocaleString("es-AR")} c/u
              </p>
            </div>
            <span className="text-sm font-semibold text-content dark:text-zinc-100 tabular-nums shrink-0">
              ${(item.unitPrice * item.quantity).toLocaleString("es-AR")}
            </span>
          </div>
        ))}
      </div>

      {/* Total + payment method */}
      <div className="rounded-xl border border-border-subtle dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle dark:border-zinc-800 bg-surface/50 dark:bg-zinc-800/50">
          <span className="text-sm text-content-secondary dark:text-zinc-400">
            Subtotal
          </span>
          <span className="text-sm font-medium text-content dark:text-zinc-100 tabular-nums">
            ${subtotal.toLocaleString("es-AR")}
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle dark:border-zinc-800 bg-surface/50 dark:bg-zinc-800/50">
          <span className="text-sm text-content-secondary dark:text-zinc-400">
            Método de pago
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full",
              order.paymentMethod === "mercadopago"
                ? "bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400"
                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
            )}
          >
            {order.paymentMethod === "mercadopago" ? (
              <CreditCard className="w-3 h-3" />
            ) : (
              <Store className="w-3 h-3" />
            )}
            {order.paymentMethod === "mercadopago" ? "MercadoPago" : "Efectivo"}
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-bold text-content dark:text-zinc-100">
            Total
          </span>
          <span className="text-base font-extrabold text-gold tabular-nums">
            ${order.total.toLocaleString("es-AR")}
          </span>
        </div>
      </div>

      {/* Note */}
      {order.note && (
        <div className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 px-4 py-3">
          <p className="text-xs font-semibold text-amber-800 dark:text-amber-400 mb-1">
            Tu nota
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300">{order.note}</p>
        </div>
      )}

      {/* Pickup reminder */}
      <div className="rounded-xl border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/30 px-4 py-3 flex items-center gap-3">
        <Truck className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
        <p className="text-xs text-purple-700 dark:text-purple-300">
          Retiro en local — te avisamos por WhatsApp cuando esté listo.
        </p>
      </div>

      {/* Back */}
      <Link
        href="/shop"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border-subtle dark:border-zinc-700 text-sm font-semibold text-content-secondary dark:text-zinc-400 hover:border-gold hover:text-gold transition-all"
      >
        <ShoppingBag className="w-4 h-4" />
        Volver a la tienda
      </Link>
    </motion.div>
  );
}

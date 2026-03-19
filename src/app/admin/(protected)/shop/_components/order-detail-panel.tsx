"use client";

import {
  X,
  Store,
  User,
  Mail,
  Phone,
  Package,
  ShoppingCart,
  MapPin,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { updateOrderStatusAction } from "../_actions/update-order-status";
import {
  ORDER_STATUS_CONFIG,
  type Order,
  type OrderStatus,
} from "@/types/shop";

interface OrderDetailPanelProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus?: (id: string, status: OrderStatus) => void;
  readOnly?: boolean;
}

const STATUS_ORDER: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "READY",
  "PICKED_UP",
];

const NEXT_ACTIONS: {
  status: OrderStatus;
  label: string;
  icon: React.ReactNode;
  className: string;
}[] = [
  {
    status: "PROCESSING",
    label: "Preparando pedido",
    icon: <ShoppingCart size={14} />,
    className:
      "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900",
  },
  {
    status: "READY",
    label: "Listo para retirar",
    icon: <MapPin size={14} />,
    className:
      "bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800 dark:hover:bg-purple-900",
  },
  {
    status: "PICKED_UP",
    label: "Marcar como retirado",
    icon: <CheckCircle2 size={14} />,
    className: "bg-gold text-white hover:bg-gold/90",
  },
];

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = ORDER_STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
}

export function OrderDetailPanel({
  order,
  onClose,
  onUpdateStatus,
  readOnly = false,
}: OrderDetailPanelProps) {
  const subtotal = order.items.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0,
  );

  const currentIdx = STATUS_ORDER.indexOf(order.status);
  const availableActions = NEXT_ACTIONS.filter(
    (a) => STATUS_ORDER.indexOf(a.status) > currentIdx,
  );
  const previousStatus = currentIdx > 0 ? STATUS_ORDER[currentIdx - 1] : null;

  async function handleUpdateStatus(status: OrderStatus) {
    const result = await updateOrderStatusAction(order.id, status);
    if (!result.success) {
      toast.error(result.error ?? "Error al actualizar el estado");
      return;
    }
    onUpdateStatus?.(order.id, status);
    toast.success("Estado actualizado correctamente");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
        className="relative w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-xl flex flex-col overflow-hidden max-h-[92svh] bg-base dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800"
      >
        {/* Drag handle mobile */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-border-subtle dark:bg-zinc-700" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border-subtle dark:border-zinc-800 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-bold text-gold">
                #{order.id.slice(-6).toUpperCase()}
              </span>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-xs mt-1 text-content-tertiary dark:text-zinc-500">
              {new Date(order.createdAt).toLocaleDateString("es-AR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Body scrollable */}
        <div className="overflow-y-auto flex-1 scrollbar-none">
          {/* Pickup banner */}
          <div className="mx-5 mt-5 rounded-xl px-4 py-3 flex items-center gap-3 bg-purple-50 border border-purple-100 dark:bg-purple-950/30 dark:border-purple-900">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-purple-100 dark:bg-purple-900">
              <Store
                size={15}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                Retiro en local
              </p>
              <p className="text-xs mt-0.5 text-purple-600 dark:text-purple-400">
                El cliente retira el pedido en la peluquería. No se realiza
                envío.
              </p>
            </div>
          </div>

          {/* Cliente */}
          <div className="mx-5 mt-4 rounded-xl p-4 space-y-2.5 bg-surface dark:bg-zinc-800 border border-border-subtle dark:border-zinc-700">
            <p className="text-xs font-semibold tracking-wide uppercase text-content-quaternary dark:text-zinc-500 mb-1">
              Datos del cliente
            </p>
            {[
              { icon: <User size={13} />, value: order.name ?? "Sin nombre" },
              { icon: <Mail size={13} />, value: order.email ?? "Sin email" },
              { icon: <Phone size={13} />, value: order.telephone },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="text-gold shrink-0">{row.icon}</span>
                <span
                  className={cn(
                    "text-sm",
                    i === 0
                      ? "font-medium text-content dark:text-zinc-100"
                      : "text-content-secondary dark:text-zinc-400",
                  )}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Productos */}
          <div className="mx-5 mt-4">
            <p className="text-xs font-semibold tracking-wide uppercase text-content-quaternary dark:text-zinc-500 mb-3">
              Productos ({order.items.length})
            </p>
            <div className="rounded-xl overflow-hidden border border-border-subtle dark:border-zinc-700">
              {order.items.map((item, i) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3",
                    i < order.items.length - 1 &&
                      "border-b border-border-subtle dark:border-zinc-700",
                    i % 2 === 0
                      ? "bg-white dark:bg-zinc-900"
                      : "bg-surface dark:bg-zinc-800",
                  )}
                >
                  <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center bg-gold/10">
                    <Package size={15} className="text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-content dark:text-zinc-100">
                      {item.productName}
                    </p>
                    <p className="text-xs mt-0.5 text-content-tertiary dark:text-zinc-500">
                      {item.productCategory}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-content-tertiary dark:text-zinc-500">
                      x{item.quantity} · $
                      {item.unitPrice.toLocaleString("es-AR")} c/u
                    </p>
                    <p className="text-sm font-semibold text-content dark:text-zinc-100">
                      $
                      {(item.unitPrice * item.quantity).toLocaleString("es-AR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nota */}
          {order.note && (
            <div className="mx-5 mt-4 rounded-xl px-4 py-3 bg-amber-50 border border-amber-100 dark:bg-amber-950/30 dark:border-amber-900">
              <p className="text-xs font-semibold mb-1 text-amber-800 dark:text-amber-400">
                Nota del cliente
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {order.note}
              </p>
            </div>
          )}

          {/* Total */}
          <div className="mx-5 mt-4 mb-5 rounded-xl overflow-hidden border border-border-subtle dark:border-zinc-700">
            {[
              {
                label: "Subtotal",
                value: `$${subtotal.toLocaleString("es-AR")}`,
                valueClass: "text-content dark:text-zinc-100",
              },
              {
                label: "Envío",
                value: "Sin cargo",
                valueClass: "text-green-600 dark:text-green-400",
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-4 py-3 bg-surface dark:bg-zinc-800 border-b border-border-subtle dark:border-zinc-700"
              >
                <span className="text-sm text-content-secondary dark:text-zinc-400">
                  {row.label}
                </span>
                <span className={cn("text-sm font-medium", row.valueClass)}>
                  {row.value}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900">
              <span className="text-sm font-bold text-content dark:text-zinc-100">
                Total
              </span>
              <span className="font-bold text-gold">
                ${order.total.toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        {!readOnly &&
          order.status !== "CANCELLED" &&
          (availableActions.length > 0 || previousStatus !== null) && (
            <div className="px-5 py-4 border-t border-border-subtle dark:border-zinc-800 shrink-0 bg-surface dark:bg-zinc-800">
              <p className="text-xs font-semibold tracking-wide uppercase text-content-quaternary dark:text-zinc-500 mb-3">
                Actualizar estado
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                {availableActions.map((action) => (
                  <button
                    key={action.status}
                    onClick={() => handleUpdateStatus(action.status)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all",
                      action.className,
                    )}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
                {previousStatus !== null && (
                  <button
                    onClick={() => handleUpdateStatus(previousStatus)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-content-tertiary dark:text-zinc-500 border border-border-subtle dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-500 hover:text-content-secondary dark:hover:text-zinc-400 transition-all"
                  >
                    <RotateCcw size={12} />
                    Revertir a &quot;{ORDER_STATUS_CONFIG[previousStatus].label}
                    &quot;
                  </button>
                )}
              </div>
            </div>
          )}
      </motion.div>
    </div>
  );
}

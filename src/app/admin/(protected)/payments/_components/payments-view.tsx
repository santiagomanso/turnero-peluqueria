"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  TrendingUp,
  Calendar,
  ShoppingBag,
  Eye,
  Loader2,
  Clock,
  Phone,
  User,
  Mail,
  DollarSign,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  formatDateFromISO,
  formatDateLongFromISO,
  isTodayFromISO,
} from "@/lib/format-date";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { type UnifiedPaymentRow } from "@/app/admin/_actions/get-payments";
import { usePayments } from "../_hooks/use-payments";
import { getOrderByIdAction } from "@/app/admin/(protected)/shop/_actions/get-orders";
import { getAppointmentByIdAction } from "@/app/appointments/_actions/get-by-id";
import { OrderDetailPanel } from "@/app/admin/(protected)/shop/_components/order-detail-panel";
import type { Order } from "@/types/shop";
import type { Appointment } from "@/types/appointment";

const PaymentsMobileDropdown = dynamic(
  () =>
    import("./payments-mobile-dropdown").then((m) => ({
      default: m.PaymentsMobileDropdown,
    })),
  { ssr: false },
);

// ─── Type badge ───────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: UnifiedPaymentRow["type"] }) {
  return type === "appointment" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-semibold bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-800 whitespace-nowrap">
      <Calendar className="w-2.5 h-2.5" />
      Turno
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800 whitespace-nowrap">
      <ShoppingBag className="w-2.5 h-2.5" />
      Pedido
    </span>
  );
}

// ─── Source badge ─────────────────────────────────────────────────────────────

function SourceBadge({ source }: { source: UnifiedPaymentRow["source"] }) {
  return source === "mercadopago" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-semibold bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-800 whitespace-nowrap">
      MercadoPago
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800 whitespace-nowrap">
      Efectivo
    </span>
  );
}

// ─── Summary cards ────────────────────────────────────────────────────────────

function SummaryCards({ payments }: { payments: UnifiedPaymentRow[] }) {
  const total = payments.reduce((sum, p) => sum + p.amount, 0);
  const appointments = payments.filter((p) => p.type === "appointment").length;
  const orders = payments.filter((p) => p.type === "shop_order").length;

  return (
    <div className="flex flex-col lg:flex-row gap-3">
      <div className="flex gap-3 lg:flex-1">
        <div className="flex-1 min-w-35 rounded-xl border border-border-subtle dark:border-zinc-800 bg-surface dark:bg-zinc-800/50 px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center shrink-0">
            <Calendar size={16} className="text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-xs text-content-tertiary dark:text-zinc-500">
              Turnos
            </p>
            <p className="text-lg font-bold text-content dark:text-zinc-100">
              {appointments}
            </p>
          </div>
        </div>
        <div className="flex-1 min-w-35 rounded-xl border border-border-subtle dark:border-zinc-800 bg-surface dark:bg-zinc-800/50 px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center shrink-0">
            <ShoppingBag size={16} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-content-tertiary dark:text-zinc-500">
              Pedidos
            </p>
            <p className="text-lg font-bold text-content dark:text-zinc-100">
              {orders}
            </p>
          </div>
        </div>
      </div>
      <div className="lg:flex-1 rounded-xl border border-border-subtle dark:border-zinc-800 bg-surface dark:bg-zinc-800/50 px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
          <TrendingUp size={16} className="text-gold" />
        </div>
        <div>
          <p className="text-xs text-content-tertiary dark:text-zinc-500">
            Total recaudado
          </p>
          <p className="text-lg font-bold text-content dark:text-zinc-100">
            ${total.toLocaleString("es-AR")}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Appointment detail dialog ───────────────────────────────────────────────

function AppointmentDetailPanel({
  appointment,
  onClose,
}: {
  appointment: Appointment;
  onClose: () => void;
}) {
  const dateStr = new Date(appointment.date).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
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
        className="relative w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-xl flex flex-col overflow-hidden max-h-[92svh] bg-base dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800"
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
                #{appointment.id.slice(-6).toUpperCase()}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap",
                  appointment.status === "PAID"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
                )}
              >
                {appointment.status === "PAID" ? "Pagado" : "Pendiente"}
              </span>
            </div>
            <p className="text-xs mt-1 text-content-tertiary dark:text-zinc-500 capitalize">
              {dateStr}
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

        {/* Body */}
        <div className="overflow-y-auto flex-1 scrollbar-none px-5 py-5 space-y-4">
          {/* Client data */}
          <div className="rounded-xl p-4 space-y-2.5 bg-surface dark:bg-zinc-800 border border-border-subtle dark:border-zinc-700">
            <p className="text-xs font-semibold tracking-wide uppercase text-content-quaternary dark:text-zinc-500 mb-1">
              Datos del turno
            </p>
            {[
              {
                icon: <User size={13} />,
                value: appointment.payerName ?? appointment.payerEmail ?? "Sin nombre",
              },
              {
                icon: <Mail size={13} />,
                value: appointment.payerEmail ?? "Sin email",
              },
              {
                icon: <Phone size={13} />,
                value: appointment.telephone,
              },
              {
                icon: <Clock size={13} />,
                value: `${appointment.time} hs`,
              },
              {
                icon: <DollarSign size={13} />,
                value: `$${appointment.price.toLocaleString("es-AR")}`,
              },
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

          {/* Payment info */}
          {appointment.payment && (
            <div className="rounded-xl p-4 bg-surface dark:bg-zinc-800 border border-border-subtle dark:border-zinc-700">
              <p className="text-xs font-semibold tracking-wide uppercase text-content-quaternary dark:text-zinc-500 mb-2">
                Pago
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-content-secondary dark:text-zinc-400">
                  MercadoPago
                </span>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  ${appointment.payment.amount.toLocaleString("es-AR")}
                </span>
              </div>
              {appointment.payment.mercadopagoId && (
                <p className="text-[0.6rem] font-mono text-content-quaternary dark:text-zinc-600 mt-1">
                  ID: {appointment.payment.mercadopagoId}
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Mobile payment card ─────────────────────────────────────────────────────

function PaymentCard({
  payment,
  onViewDetail,
  isLoading,
}: {
  payment: UnifiedPaymentRow;
  onViewDetail: () => void;
  isLoading: boolean;
}) {
  const time = new Date(payment.paidAt).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <button
      onClick={onViewDetail}
      disabled={isLoading}
      className="w-full text-left rounded-xl border border-border-subtle dark:border-zinc-800 bg-white dark:bg-zinc-800 overflow-hidden active:scale-[0.98] transition-transform"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-gray-100 dark:bg-black/30 border-b border-border-subtle dark:border-zinc-800">
        <span className="text-[0.65rem] font-bold text-content-tertiary dark:text-zinc-500 tabular-nums">
          {time}
        </span>
        <div className="flex items-center gap-1.5">
          <TypeBadge type={payment.type} />
          <SourceBadge source={payment.source} />
        </div>
      </div>

      {/* Body */}
      <div className="px-3.5 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-content dark:text-zinc-100 truncate">
            {payment.customerName ?? `+${payment.customerPhone}`}
          </p>
          <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-0.5">
            {payment.type === "appointment" && payment.appointmentDate
              ? `${formatDateLongFromISO(payment.appointmentDate)} · ${payment.appointmentTime}`
              : payment.orderId
                ? `Pedido #${payment.orderId.slice(-6).toUpperCase()}`
                : `+${payment.customerPhone}`}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            ${payment.amount.toLocaleString("es-AR")}
          </span>
        </div>
        {isLoading ? (
          <Loader2 className="w-4 h-4 text-gold animate-spin shrink-0" />
        ) : (
          <Eye className="w-4 h-4 text-content-quaternary dark:text-zinc-600 shrink-0" />
        )}
      </div>
    </button>
  );
}

// ─── Payments list (mobile cards + desktop table) ────────────────────────────

function PaymentsList({
  payments,
  onViewDetail,
  loadingPaymentId,
}: {
  payments: UnifiedPaymentRow[];
  onViewDetail: (payment: UnifiedPaymentRow) => void;
  loadingPaymentId: string | null;
}) {
  if (payments.length === 0) {
    return (
      <div className="py-16 text-center">
        <CreditCard
          size={36}
          className="mx-auto mb-3 opacity-20 text-content-tertiary dark:text-zinc-600"
        />
        <p className="text-sm text-content-tertiary dark:text-zinc-500">
          No hay pagos en este período
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-2.5">
      {/* ── Mobile cards ── */}
      <div className="lg:hidden space-y-2.5">
        {payments.map((p) => (
          <PaymentCard
            key={p.id}
            payment={p}
            onViewDetail={() => onViewDetail(p)}
            isLoading={loadingPaymentId === p.id}
          />
        ))}
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden lg:flex flex-col flex-1 min-h-0 rounded-xl border border-border-subtle dark:border-zinc-800 overflow-hidden">
        <div className="overflow-y-auto flex-1">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              <tr className="bg-surface dark:bg-zinc-800/50 border-b border-border-subtle dark:border-zinc-800">
                {["Hora", "Tipo", "Método", "Cliente", "Detalle", "Monto", ""].map(
                  (h) => (
                    <th
                      key={h || "actions"}
                      className="px-4 py-2.5 text-left text-xs font-medium text-content-tertiary dark:text-zinc-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {payments.map((p, idx) => (
                <tr
                  key={p.id}
                  className={cn(
                    "border-b border-border-subtle dark:border-zinc-800 last:border-b-0 transition-colors hover:bg-surface/60 dark:hover:bg-zinc-800/30",
                    idx % 2 === 0
                      ? "bg-white dark:bg-zinc-900"
                      : "bg-surface/40 dark:bg-zinc-900/50",
                  )}
                >
                  <td className="px-4 py-3 text-xs text-content-secondary dark:text-zinc-400 whitespace-nowrap tabular-nums">
                    {new Date(p.paidAt).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <TypeBadge type={p.type} />
                  </td>
                  <td className="px-4 py-3">
                    <SourceBadge source={p.source} />
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-content dark:text-zinc-100 whitespace-nowrap">
                      {p.customerName ?? `+${p.customerPhone}`}
                    </p>
                    <p className="text-xs text-content-tertiary dark:text-zinc-500">
                      +{p.customerPhone}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-xs text-content-secondary dark:text-zinc-400 whitespace-nowrap">
                    {p.type === "appointment" && p.appointmentDate ? (
                      <>
                        {formatDateLongFromISO(p.appointmentDate)} ·{" "}
                        {p.appointmentTime}
                      </>
                    ) : p.orderId ? (
                      <span className="font-mono text-gold">
                        #{p.orderId.slice(-6).toUpperCase()}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap tabular-nums">
                      ${p.amount.toLocaleString("es-AR")}
                    </span>
                    {p.mercadopagoId && (
                      <p
                        className="text-[0.55rem] font-mono text-content-quaternary dark:text-zinc-600 truncate max-w-20"
                        title={p.mercadopagoId}
                      >
                        {p.mercadopagoId.slice(0, 8)}…
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetail(p)}
                      disabled={loadingPaymentId === p.id}
                      className="text-xs gap-1.5 text-content-tertiary dark:text-zinc-500 hover:text-gold"
                    >
                      {loadingPaymentId === p.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export function PaymentsView() {
  const [specificDate, setSpecificDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  );
  const { cache, isLoading, fetchPayments, refreshPayments } = usePayments();
  const payments: UnifiedPaymentRow[] = cache[specificDate] ?? [];

  // Detail panel state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loadingPaymentId, setLoadingPaymentId] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments(specificDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDateChange(date: string) {
    setSpecificDate(date);
    fetchPayments(date);
  }

  function handleRefresh() {
    refreshPayments(specificDate);
  }

  async function handleViewDetail(payment: UnifiedPaymentRow) {
    setLoadingPaymentId(payment.id);

    if (payment.type === "shop_order" && payment.orderId) {
      const result = await getOrderByIdAction(payment.orderId);
      if (result.success && result.order) {
        setSelectedOrder(result.order);
      }
    } else if (payment.type === "appointment" && payment.appointmentId) {
      const result = await getAppointmentByIdAction(payment.appointmentId);
      if (result.success && result.data) {
        setSelectedAppointment(result.data);
      }
    }

    setLoadingPaymentId(null);
  }

  const controls = (
    <PaymentsMobileDropdown
      specificDate={specificDate}
      isLoading={isLoading}
      onDateChange={handleDateChange}
      onRefresh={handleRefresh}
    />
  );

  const subtitle = isTodayFromISO(specificDate)
    ? "Pagos de hoy"
    : `Mostrando: ${formatDateFromISO(specificDate)}`;

  return (
    <>
      <AdminPageHeader
        title="Pagos"
        subtitle={subtitle}
        badge={isLoading ? undefined : payments.length}
        desktopControls={controls}
        mobileControls={controls}
      />

      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto lg:overflow-y-hidden px-4 lg:px-7 py-5 gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-content-tertiary dark:text-zinc-500 animate-pulse">
              Cargando pagos…
            </p>
          </div>
        ) : (
          <>
            <SummaryCards payments={payments} />
            <PaymentsList
              payments={payments}
              onViewDetail={handleViewDetail}
              loadingPaymentId={loadingPaymentId}
            />
          </>
        )}
      </div>

      {/* Detail panels */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailPanel
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            readOnly
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedAppointment && (
          <AppointmentDetailPanel
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

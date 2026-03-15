"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { CreditCard, TrendingUp, Calendar, ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  formatDateFromISO,
  formatDateLongFromISO,
  isTodayFromISO,
} from "@/lib/format-date";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import {
  getUnifiedPaymentsAction,
  type UnifiedPaymentRow,
} from "@/app/admin/_actions/get-payments";

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
    <div className="flex gap-3 flex-wrap">
      <div className="flex-1 min-w-[140px] rounded-xl border border-border-subtle dark:border-zinc-800 bg-surface dark:bg-zinc-800/50 px-4 py-3 flex items-center gap-3">
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
      <div className="flex-1 min-w-[140px] rounded-xl border border-border-subtle dark:border-zinc-800 bg-surface dark:bg-zinc-800/50 px-4 py-3 flex items-center gap-3">
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
      <div className="flex-1 min-w-[140px] rounded-xl border border-border-subtle dark:border-zinc-800 bg-surface dark:bg-zinc-800/50 px-4 py-3 flex items-center gap-3">
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
  );
}

// ─── Payments table ───────────────────────────────────────────────────────────

function PaymentsTable({ payments }: { payments: UnifiedPaymentRow[] }) {
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
    <div className="overflow-x-auto rounded-xl border border-border-subtle dark:border-zinc-800">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="bg-surface dark:bg-zinc-800/50 border-b border-border-subtle dark:border-zinc-800">
            {[
              "Hora",
              "Tipo",
              "Método",
              "Cliente",
              "Detalle",
              "Monto",
            ].map((h) => (
              <th
                key={h}
                className="px-4 py-2.5 text-left text-xs font-medium text-content-tertiary dark:text-zinc-500 uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
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
              {/* Hora */}
              <td className="px-4 py-3 text-xs text-content-secondary dark:text-zinc-400 whitespace-nowrap tabular-nums">
                {new Date(p.paidAt).toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>

              {/* Tipo */}
              <td className="px-4 py-3">
                <TypeBadge type={p.type} />
              </td>

              {/* Método */}
              <td className="px-4 py-3">
                <SourceBadge source={p.source} />
              </td>

              {/* Cliente */}
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-content dark:text-zinc-100 whitespace-nowrap">
                  {p.customerName ?? `+${p.customerPhone}`}
                </p>
                <p className="text-xs text-content-tertiary dark:text-zinc-500">
                  +{p.customerPhone}
                </p>
              </td>

              {/* Detalle */}
              <td className="px-4 py-3 text-xs text-content-secondary dark:text-zinc-400 whitespace-nowrap">
                {p.type === "appointment" && p.appointmentDate ? (
                  <>
                    {formatDateLongFromISO(p.appointmentDate)} · {p.appointmentTime}
                  </>
                ) : p.orderId ? (
                  <span className="font-mono text-gold">
                    #{p.orderId.slice(-6).toUpperCase()}
                  </span>
                ) : (
                  "—"
                )}
              </td>

              {/* Monto */}
              <td className="px-4 py-3">
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap tabular-nums">
                  ${p.amount.toLocaleString("es-AR")}
                </span>
                {p.mercadopagoId && (
                  <p
                    className="text-[0.55rem] font-mono text-content-quaternary dark:text-zinc-600 truncate max-w-[80px]"
                    title={p.mercadopagoId}
                  >
                    {p.mercadopagoId.slice(0, 8)}…
                  </p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export function PaymentsView() {
  const [specificDate, setSpecificDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [payments, setPayments] = useState<UnifiedPaymentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPayments = useCallback(async (date: string) => {
    setIsLoading(true);
    const result = await getUnifiedPaymentsAction(date);
    if (result.success) setPayments(result.data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadPayments(specificDate);
  }, [specificDate, loadPayments]);

  function handleDateChange(date: string) {
    setSpecificDate(date);
  }

  function handleRefresh() {
    loadPayments(specificDate);
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
        desktopControls={controls}
        mobileControls={controls}
      />

      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-4 lg:px-7 py-5 space-y-4">
        <p className="text-xs text-content-tertiary dark:text-zinc-500">
          {isLoading
            ? "Cargando…"
            : `${payments.length} pago${payments.length !== 1 ? "s" : ""}`}
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-content-tertiary dark:text-zinc-500 animate-pulse">
              Cargando pagos…
            </p>
          </div>
        ) : (
          <>
            <SummaryCards payments={payments} />
            <PaymentsTable payments={payments} />
          </>
        )}
      </div>
    </>
  );
}

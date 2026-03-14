"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { CreditCard, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { formatDateFromISO, formatDateLongFromISO, isTodayFromISO } from "@/lib/format-date";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import {
  getPaymentsAction,
  type PaymentRow,
} from "@/app/admin/_actions/get-payments";

const PaymentsMobileDropdown = dynamic(
  () =>
    import("./payments-mobile-dropdown").then((m) => ({
      default: m.PaymentsMobileDropdown,
    })),
  { ssr: false },
);

// ─── Summary cards ────────────────────────────────────────────────────────────

function SummaryCards({ payments }: { payments: PaymentRow[] }) {
  const total = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="flex gap-3">
      <div className="flex-1 rounded-xl border border-border-subtle dark:border-zinc-800 bg-surface dark:bg-zinc-800/50 px-4 py-3 flex items-center gap-3">
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
      <div className="flex-1 rounded-xl border border-border-subtle dark:border-zinc-800 bg-surface dark:bg-zinc-800/50 px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shrink-0">
          <CreditCard size={16} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-xs text-content-tertiary dark:text-zinc-500">Pagos</p>
          <p className="text-lg font-bold text-content dark:text-zinc-100">
            {payments.length}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────

function PaymentsTable({ payments }: { payments: PaymentRow[] }) {
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
            <th className="px-4 py-2.5 text-left text-xs font-medium text-content-tertiary dark:text-zinc-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-content-tertiary dark:text-zinc-500 uppercase tracking-wider">
              Cliente
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-content-tertiary dark:text-zinc-500 uppercase tracking-wider">
              Turno
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-content-tertiary dark:text-zinc-500 uppercase tracking-wider">
              Monto
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-content-tertiary dark:text-zinc-500 uppercase tracking-wider">
              ID MP
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr
              key={payment.id}
              className="border-b border-border-subtle dark:border-zinc-800 last:border-b-0 hover:bg-surface/50 dark:hover:bg-zinc-800/30 transition-colors"
            >
              <td className="px-4 py-3 text-xs text-content-secondary dark:text-zinc-400 whitespace-nowrap">
                {new Date(payment.createdAt).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>

              <td className="px-4 py-3">
                <p className="text-sm font-medium text-content dark:text-zinc-100 whitespace-nowrap">
                  {payment.appointment.payerName ??
                    payment.appointment.payerEmail ??
                    `+${payment.appointment.telephone}`}
                </p>
                <p className="text-xs text-content-tertiary dark:text-zinc-500">
                  +{payment.appointment.telephone}
                </p>
              </td>

              <td className="px-4 py-3 text-xs text-content-secondary dark:text-zinc-400 whitespace-nowrap">
                {formatDateLongFromISO(payment.appointment.date)} ·{" "}
                {payment.appointment.time}
              </td>

              <td className="px-4 py-3">
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                  ${payment.amount.toLocaleString("es-AR")}
                </span>
              </td>

              <td className="px-4 py-3">
                <span
                  className="text-xs font-mono text-content-tertiary dark:text-zinc-500 bg-surface dark:bg-zinc-800 px-2 py-0.5 rounded border border-border-subtle dark:border-zinc-700"
                  title={payment.mercadopagoId}
                >
                  {payment.mercadopagoId.slice(0, 10)}…
                </span>
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
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPayments = useCallback(async (date: string) => {
    setIsLoading(true);
    const result = await getPaymentsAction(date);
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

  // ── Desktop controls ──────────────────────────────────────────────────────
  const desktopControls = (
    <PaymentsMobileDropdown
      specificDate={specificDate}
      isLoading={isLoading}
      onDateChange={handleDateChange}
      onRefresh={handleRefresh}
    />
  );

  // ── Mobile controls ───────────────────────────────────────────────────────
  const mobileControls = (
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
        desktopControls={desktopControls}
        mobileControls={mobileControls}
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

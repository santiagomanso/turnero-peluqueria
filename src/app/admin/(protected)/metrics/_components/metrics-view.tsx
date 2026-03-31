"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import {
  CalendarDays,
  CheckCircle,
  XCircle,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Receipt,
} from "lucide-react";
import { StatCard } from "./stat-card";
import { TopHours } from "./top-hours";
import { DayChart } from "./day-chart";
import { ConversionCard } from "./conversion";
import { GrowthChart } from "./growth";
import { DonutChart } from "./donut-chart";
import { HorizontalBarChart } from "./horizontal-bar-chart";
import { OrdersStatusDonut } from "./orders-status-donut";
import { usePeriod } from "@/app/admin/_hooks/use-period";
import { useMetricsStore } from "../_hooks/use-metrics-store";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";

const MetricsMobileDropdown = dynamic(
  () =>
    import("./metrics-mobile-dropdown").then((m) => ({
      default: m.MetricsMobileDropdown,
    })),
  { ssr: false },
);

const fmtMoney = (v: number) => `$${v.toLocaleString("es-AR")}`;

export function MetricsView() {
  const { period } = usePeriod();
  const { data, isLoading, fetch } = useMetricsStore();
  const d = data[period];

  useEffect(() => {
    fetch(period);
  }, [period, fetch]);

  return (
    <div className="flex flex-col h-full">
      <AdminPageHeader
        title="Métricas"
        subtitle="Estadísticas generales del negocio"
        mobileControls={<MetricsMobileDropdown />}
        desktopControls={<MetricsMobileDropdown />}
      />

      <div className="flex-1 overflow-y-auto">
        {isLoading && !d ? (
          <div className="px-7 py-10 flex items-center justify-center">
            <p className="text-sm text-content-tertiary dark:text-zinc-500 animate-pulse">
              Cargando métricas...
            </p>
          </div>
        ) : !d ? (
          <div className="px-7 py-10 flex items-center justify-center">
            <p className="text-sm text-content-tertiary dark:text-zinc-500">
              No hay datos disponibles.
            </p>
          </div>
        ) : (
          <div className="px-7 py-5 max-md:px-4 space-y-5">
            {/* ─── Section: Turnos ──────────────────────────────────────── */}
            <p className="text-[0.6rem] uppercase tracking-[0.15em] text-content-quaternary dark:text-zinc-500 font-semibold">
              Turnos
            </p>

            <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2">
              <StatCard
                icon={CalendarDays}
                label="Total turnos"
                value={String(d.stats.total)}
                delta={d.stats.totalDelta}
                period={period}
              />
              <StatCard
                icon={CheckCircle}
                label="Turnos pagados"
                labelMobile="Pagados"
                value={String(d.stats.paid)}
                delta={d.stats.paidDelta}
                period={period}
              />
              <StatCard
                icon={XCircle}
                label="Cancelaciones"
                value={String(d.stats.cancelled)}
                delta={d.stats.cancelledDelta}
                period={period}
              />
              <StatCard
                icon={TrendingUp}
                label="Ganancias turnos"
                labelMobile="Ganancias"
                value={d.stats.revenue}
                delta={d.stats.revenueDelta}
                period={period}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">
              <DayChart data={d.byDay} />
              <TopHours data={d.byHour} />
              <ConversionCard
                paid={d.stats.paid}
                cancelled={d.stats.cancelled}
                total={d.stats.total}
              />
            </div>

            <GrowthChart data={d.growth} />

            {/* ─── Section: Tienda ──────────────────────────────────────── */}
            <div className="pt-2">
              <p className="text-[0.6rem] uppercase tracking-[0.15em] text-content-quaternary dark:text-zinc-500 font-semibold">
                Tienda online
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-2">
              <StatCard
                icon={ShoppingBag}
                label="Total pedidos"
                value={String(d.shopStats.totalOrders)}
                delta={d.shopStats.totalOrdersDelta}
                period={period}
              />
              <StatCard
                icon={DollarSign}
                label="Ingresos tienda"
                value={fmtMoney(d.shopStats.shopRevenue)}
                delta={d.shopStats.shopRevenueDelta}
                period={period}
              />
              <StatCard
                icon={Receipt}
                label="Ticket promedio"
                value={fmtMoney(d.shopStats.avgTicket)}
                delta={d.shopStats.avgTicketDelta}
                period={period}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">
              <DonutChart
                title="Ventas por categoría"
                data={d.salesByCategory.map((c) => ({
                  name: c.name,
                  value: c.revenue,
                }))}
                formatValue={fmtMoney}
              />
              <HorizontalBarChart
                title="Productos más vendidos"
                subtitle="Top 5 por unidades"
                data={d.topProducts.map((p) => ({
                  name: p.name,
                  value: p.quantity,
                }))}
                formatValue={(v) => `${v} uds`}
              />
              <OrdersStatusDonut data={d.ordersByStatus} />
            </div>

            {/* ─── Section: Finanzas ────────────────────────────────────── */}
            <div className="pt-2">
              <p className="text-[0.6rem] uppercase tracking-[0.15em] text-content-quaternary dark:text-zinc-500 font-semibold">
                Finanzas
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
              <DonutChart
                title="Ingresos por fuente"
                data={d.revenueBySource}
                formatValue={fmtMoney}
              />
              <DonutChart
                title="Ingresos por método de pago"
                data={d.revenueByMethod}
                formatValue={fmtMoney}
              />
            </div>

            {/* ─── Section: Clientes ────────────────────────────────────── */}
            <div className="pt-2">
              <p className="text-[0.6rem] uppercase tracking-[0.15em] text-content-quaternary dark:text-zinc-500 font-semibold">
                Clientes
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1 pb-5">
              <HorizontalBarChart
                title="Top clientes"
                subtitle="Por gasto total"
                data={d.topClients.map((c) => ({
                  name: c.name,
                  value: c.totalSpent,
                }))}
                formatValue={fmtMoney}
              />
              <DonutChart
                title="Recurrentes vs nuevos"
                data={d.clientSegments}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

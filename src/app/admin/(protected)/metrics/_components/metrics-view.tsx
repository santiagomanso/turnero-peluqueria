"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import {
  CalendarDays,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { StatCard } from "./stat-card";
import { TopHours } from "./top-hours";
import { DayChart } from "./day-chart";
import { ConversionCard } from "./conversion";
import { GrowthChart } from "./growth";
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

export function MetricsView() {
  const { period } = usePeriod();
  const { data, isLoading, fetch, refresh } = useMetricsStore();
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

      {/* Content */}
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
          <div className="px-7 py-5 max-md:px-4 space-y-5 max-w-5xl">
            <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-2">
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
                label="Ganancias"
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
          </div>
        )}
      </div>
    </div>
  );
}

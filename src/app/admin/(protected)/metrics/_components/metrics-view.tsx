"use client";

import { useEffect } from "react";
import {
  CalendarDays,
  CheckCircle,
  XCircle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "./stat-card";
import { TopHours } from "./top-hours";
import { DayChart } from "./day-chart";
import { ConversionCard } from "./conversion";
import { GrowthChart } from "./growth";
import PeriodTabs from "@/app/admin/_components/period-tabs";
import { usePeriod } from "@/app/admin/_hooks/use-period";
import { useMetricsStore } from "../_hooks/use-metrics-store";

export function MetricsView() {
  const { period } = usePeriod();
  const { data, isLoading, fetch, refresh } = useMetricsStore();
  const d = data[period];

  useEffect(() => {
    fetch(period);
  }, [period, fetch]);

  return (
    <div className="flex flex-col h-full">
      {/* Header desktop */}
      <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-border-subtle dark:border-zinc-800 px-7 h-19 flex items-center max-md:hidden">
        <div className="flex items-center gap-4 flex-1">
          <div>
            <h1 className="font-heebo text-xl font-semibold text-content dark:text-zinc-100">
              Métricas
            </h1>
            <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-0.5">
              Estadísticas generales del negocio
            </p>
          </div>
          <PeriodTabs />
          <div className="ml-auto">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 shadow-sm"
              disabled={isLoading}
              onClick={() => refresh(period)}
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </div>

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
              />
              <StatCard
                icon={CheckCircle}
                label="Turnos pagados"
                labelMobile="Pagados"
                value={String(d.stats.paid)}
                delta={d.stats.paidDelta}
              />
              <StatCard
                icon={XCircle}
                label="Cancelaciones"
                value={String(d.stats.cancelled)}
                delta={d.stats.cancelledDelta}
              />
              <StatCard
                icon={TrendingUp}
                label="Ganancias"
                value={d.stats.revenue}
                delta={d.stats.revenueDelta}
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

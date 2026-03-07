"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  CalendarDays,
  Clock,
  XCircle,
  CheckCircle,
} from "lucide-react";

import { usePeriod } from "../_hooks/use-period";
import { useAdminTheme } from "./admin-theme-provider";
import PeriodTabs from "./period-tabs";

const GOLD = "#c9a96e";
const GOLD_SOFT = "rgba(201,169,110,0.15)";
const GOLD_BORDER = "rgba(201,169,110,0.6)";
const GREEN = "#5a9e6f";
const RED = "#e05b4b";

type Period = "week" | "month" | "year";

const DATA: Record<
  Period,
  {
    stats: {
      total: number;
      totalDelta: number;
      paid: number;
      paidDelta: number;
      cancelled: number;
      cancelledDelta: number;
      revenue: string;
      revenueDelta: number;
    };
    byDay: { label: string; turnos: number }[];
    byHour: { label: string; turnos: number }[];
    growth: { label: string; current: number; previous: number }[];
  }
> = {
  week: {
    stats: {
      total: 35,
      totalDelta: 8,
      paid: 32,
      paidDelta: 5,
      cancelled: 3,
      cancelledDelta: -1,
      revenue: "$350.000",
      revenueDelta: 12,
    },
    byDay: [
      { label: "Lun", turnos: 4 },
      { label: "Mar", turnos: 6 },
      { label: "Mié", turnos: 3 },
      { label: "Jue", turnos: 7 },
      { label: "Vie", turnos: 5 },
      { label: "Sáb", turnos: 8 },
      { label: "Dom", turnos: 2 },
    ],
    byHour: [
      { label: "09:00", turnos: 8 },
      { label: "10:00", turnos: 12 },
      { label: "11:00", turnos: 6 },
      { label: "14:00", turnos: 9 },
      { label: "15:00", turnos: 11 },
      { label: "16:00", turnos: 7 },
      { label: "17:00", turnos: 4 },
    ],
    growth: [
      { label: "Lun", current: 4, previous: 3 },
      { label: "Mar", current: 6, previous: 4 },
      { label: "Mié", current: 3, previous: 5 },
      { label: "Jue", current: 7, previous: 4 },
      { label: "Vie", current: 5, previous: 6 },
      { label: "Sáb", current: 8, previous: 5 },
      { label: "Dom", current: 2, previous: 3 },
    ],
  },
  month: {
    stats: {
      total: 83,
      totalDelta: 12,
      paid: 75,
      paidDelta: 9,
      cancelled: 8,
      cancelledDelta: 2,
      revenue: "$830.000",
      revenueDelta: 18,
    },
    byDay: [
      { label: "Lun", turnos: 14 },
      { label: "Mar", turnos: 18 },
      { label: "Mié", turnos: 11 },
      { label: "Jue", turnos: 20 },
      { label: "Vie", turnos: 16 },
      { label: "Sáb", turnos: 22 },
      { label: "Dom", turnos: 6 },
    ],
    byHour: [
      { label: "09:00", turnos: 18 },
      { label: "10:00", turnos: 28 },
      { label: "11:00", turnos: 14 },
      { label: "14:00", turnos: 22 },
      { label: "15:00", turnos: 25 },
      { label: "16:00", turnos: 16 },
      { label: "17:00", turnos: 9 },
    ],
    growth: [
      { label: "S1", current: 18, previous: 14 },
      { label: "S2", current: 22, previous: 18 },
      { label: "S3", current: 19, previous: 22 },
      { label: "S4", current: 24, previous: 17 },
    ],
  },
  year: {
    stats: {
      total: 943,
      totalDelta: 18,
      paid: 896,
      paidDelta: 15,
      cancelled: 47,
      cancelledDelta: -8,
      revenue: "$9.430.000",
      revenueDelta: 24,
    },
    byDay: [
      { label: "Lun", turnos: 120 },
      { label: "Mar", turnos: 160 },
      { label: "Mié", turnos: 98 },
      { label: "Jue", turnos: 185 },
      { label: "Vie", turnos: 172 },
      { label: "Sáb", turnos: 210 },
      { label: "Dom", turnos: 55 },
    ],
    byHour: [
      { label: "09:00", turnos: 95 },
      { label: "10:00", turnos: 180 },
      { label: "11:00", turnos: 120 },
      { label: "14:00", turnos: 145 },
      { label: "15:00", turnos: 190 },
      { label: "16:00", turnos: 130 },
      { label: "17:00", turnos: 83 },
    ],
    growth: [
      { label: "Ene", current: 60, previous: 45 },
      { label: "Feb", current: 72, previous: 58 },
      { label: "Mar", current: 68, previous: 70 },
      { label: "Abr", current: 80, previous: 65 },
      { label: "May", current: 75, previous: 72 },
      { label: "Jun", current: 90, previous: 68 },
      { label: "Jul", current: 85, previous: 80 },
      { label: "Ago", current: 88, previous: 75 },
      { label: "Sep", current: 70, previous: 85 },
      { label: "Oct", current: 78, previous: 70 },
      { label: "Nov", current: 82, previous: 76 },
      { label: "Dic", current: 95, previous: 80 },
    ],
  },
};

function StatCard({
  icon: Icon,
  label,
  labelMobile,
  value,
  delta,
}: {
  icon: typeof TrendingUp;
  label: string;
  labelMobile?: string;
  value: string;
  delta: number;
}) {
  const isPositive = delta >= 0;
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border-subtle dark:border-zinc-800 shadow-sm overflow-hidden flex">
      {/* Barra lateral */}
      <div className="w-0.75 shrink-0 bg-zinc-300 dark:bg-zinc-700" />

      {/* Contenido */}
      <div className="flex flex-col gap-3 p-5 flex-1 min-w-0">
        {/* Label + icono */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-[0.65rem] uppercase tracking-[0.12em] text-content-tertiary dark:text-zinc-500 leading-tight">
            {labelMobile ? (
              <>
                <span className="sm:hidden">{labelMobile}</span>
                <span className="hidden sm:inline">{label}</span>
              </>
            ) : (
              label
            )}
          </p>
          <Icon className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 shrink-0" />
        </div>

        {/* Valor */}
        <p className="font-heebo text-2xl font-semibold text-content dark:text-zinc-100 leading-none">
          {value}
        </p>

        {/* Delta */}
        <div className="flex items-center gap-1 text-[0.7rem] font-medium text-content-tertiary dark:text-zinc-500">
          {isPositive ? (
            <TrendingUp className="w-3 h-3 text-green-600 shrink-0" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-500 shrink-0" />
          )}
          {isPositive ? "+" : ""}
          {delta}% vs período anterior
        </div>
      </div>
    </div>
  );
}

function TopHours({ data }: { data: { label: string; turnos: number }[] }) {
  const max = Math.max(...data.map((d) => d.turnos));
  const sorted = [...data].sort((a, b) => b.turnos - a.turnos);
  return (
    <div className="flex flex-col gap-2">
      {sorted.map((item, i) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="text-[0.65rem] font-semibold text-content-quaternary dark:text-zinc-600 w-4">
            {i + 1}
          </span>
          <span className="text-xs font-medium text-content dark:text-zinc-200 w-12 shrink-0">
            {item.label}
          </span>
          <div className="flex-1 h-1.5 bg-surface dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(item.turnos / max) * 100}%`,
                background: GOLD,
              }}
            />
          </div>
          <span className="text-xs text-content-secondary dark:text-zinc-400 w-6 text-right">
            {item.turnos}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AdminMetrics() {
  const { period } = usePeriod();
  const { isDark } = useAdminTheme();
  const d = DATA[period];
  const busyDay = [...d.byDay].sort((a, b) => b.turnos - a.turnos)[0];
  const conversionRate = Math.round((d.stats.paid / d.stats.total) * 100);

  const tooltipStyle = {
    contentStyle: {
      background: isDark ? "#27272a" : "#fff",
      border: isDark ? "1px solid #3f3f46" : "1px solid rgba(0,0,0,0.07)",
      borderRadius: 10,
      fontSize: 12,
      color: isDark ? "#f4f4f5" : "#1a1714",
    },
    cursor: { fill: "rgba(201,169,110,0.06)" },
  };

  const axisColor = isDark ? "#71717a" : "#9c9189";
  const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";

  return (
    <div className="flex flex-col h-full max-md:pt-0">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-border-subtle dark:border-zinc-800 px-7 h-19 flex items-center max-md:hidden">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="font-heebo text-xl font-semibold text-content dark:text-zinc-100">
              Métricas
            </h1>
            <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-0.5">
              Estadísticas generales del negocio
            </p>
          </div>
          <PeriodTabs />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-7 py-5 max-md:px-4 space-y-5 max-w-5xl">
          {/* Stat cards */}
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

          {/* Fila 2 */}
          <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">
            {/* Día más ocupado */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border-subtle dark:border-zinc-800 shadow-sm p-5">
              <p className="text-[0.65rem] uppercase tracking-[0.12em] text-content-tertiary dark:text-zinc-500 mb-4">
                Día más ocupado
              </p>
              <div className="flex items-end gap-3 mb-4">
                <p className="font-heebo text-2xl font-semibold text-content dark:text-zinc-100">
                  {busyDay.label}
                </p>
                <p className="text-sm text-content-secondary dark:text-zinc-400 mb-0.5">
                  {busyDay.turnos} turnos
                </p>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={d.byDay} barSize={14}>
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: axisColor }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="turnos" radius={[4, 4, 0, 0]}>
                    {d.byDay.map((entry) => (
                      <Cell
                        key={entry.label}
                        fill={entry.label === busyDay.label ? GOLD : GOLD_SOFT}
                        stroke={
                          entry.label === busyDay.label
                            ? GOLD_BORDER
                            : "transparent"
                        }
                        strokeWidth={1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Horarios más demandados */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border-subtle dark:border-zinc-800 shadow-sm p-5">
              <p className="text-[0.65rem] uppercase tracking-[0.12em] text-content-tertiary dark:text-zinc-500 mb-4">
                <Clock className="w-3 h-3 inline mr-1.5 text-gold" />
                Horarios más demandados
              </p>
              <TopHours data={d.byHour} />
            </div>

            {/* Conversión */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border-subtle dark:border-zinc-800 shadow-sm p-5">
              <p className="text-[0.65rem] uppercase tracking-[0.12em] text-content-tertiary dark:text-zinc-500 mb-4">
                Conversión PENDING → PAID
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-content-secondary dark:text-zinc-400">
                    Pagados
                  </span>
                  <span className="text-xs font-semibold text-green-600">
                    {d.stats.paid}
                  </span>
                </div>
                <div className="h-2 bg-surface dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${conversionRate}%`, background: GREEN }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-content-secondary dark:text-zinc-400">
                    Cancelados
                  </span>
                  <span className="text-xs font-semibold text-red-500">
                    {d.stats.cancelled}
                  </span>
                </div>
                <div className="h-2 bg-surface dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.round((d.stats.cancelled / d.stats.total) * 100)}%`,
                      background: RED,
                    }}
                  />
                </div>
                <div className="pt-2 border-t border-border-subtle dark:border-zinc-800 text-center">
                  <p className="font-heebo text-2xl font-semibold text-content dark:text-zinc-100">
                    {conversionRate}%
                  </p>
                  <p className="text-[0.65rem] text-content-quaternary dark:text-zinc-600 mt-0.5">
                    tasa de conversión
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Crecimiento */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border-subtle dark:border-zinc-800 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <p className="text-[0.65rem] uppercase tracking-[0.12em] text-content-tertiary dark:text-zinc-500">
                Crecimiento vs período anterior
              </p>
              <div className="flex items-center gap-4 text-xs text-content-secondary dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-0.5 rounded-full inline-block"
                    style={{ background: GOLD }}
                  />
                  Actual
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 rounded-full inline-block bg-black/15 dark:bg-white/20" />
                  Anterior
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={d.growth}>
                <CartesianGrid vertical={false} stroke={gridColor} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: axisColor }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: axisColor }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle.contentStyle}
                  cursor={{
                    stroke: GOLD,
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="current"
                  name="Actual"
                  stroke={GOLD}
                  strokeWidth={2}
                  dot={{ fill: GOLD, r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="previous"
                  name="Anterior"
                  stroke={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

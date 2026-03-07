"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAdminTheme } from "@/app/admin/_components/admin-theme-provider";

const GOLD = "#c9a96e";

interface GrowthChartProps {
  data: { label: string; current: number; previous: number }[];
}

export function GrowthChart({ data }: GrowthChartProps) {
  const { isDark } = useAdminTheme();
  const axisColor = isDark ? "#71717a" : "#9c9189";
  const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const tooltipStyle = {
    background: isDark ? "#27272a" : "#fff",
    border: isDark ? "1px solid #3f3f46" : "1px solid rgba(0,0,0,0.07)",
    borderRadius: 10,
    fontSize: 12,
    color: isDark ? "#f4f4f5" : "#1a1714",
  };

  return (
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
        <LineChart data={data}>
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
            contentStyle={tooltipStyle}
            cursor={{ stroke: GOLD, strokeWidth: 1, strokeDasharray: "4 4" }}
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
  );
}

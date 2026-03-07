"use client";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useAdminTheme } from "@/app/admin/_components/admin-theme-provider";

const GOLD = "#c9a96e";
const GOLD_SOFT = "rgba(201,169,110,0.15)";
const GOLD_BORDER = "rgba(201,169,110,0.6)";

interface DayChartProps {
  data: { label: string; turnos: number }[];
}

export function DayChart({ data }: DayChartProps) {
  const { isDark } = useAdminTheme();
  const busyDay = [...data].sort((a, b) => b.turnos - a.turnos)[0];
  const axisColor = isDark ? "#71717a" : "#9c9189";
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

  return (
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
        <BarChart data={data} barSize={14}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: axisColor }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="turnos" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.label}
                fill={entry.label === busyDay.label ? GOLD : GOLD_SOFT}
                stroke={
                  entry.label === busyDay.label ? GOLD_BORDER : "transparent"
                }
                strokeWidth={1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

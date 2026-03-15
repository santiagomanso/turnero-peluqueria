"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useAdminTheme } from "@/app/admin/_components/admin-theme-provider";

const COLORS = [
  "#c9a96e", // gold
  "#7c3aed", // violet
  "#0ea5e9", // sky
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
  "#6366f1", // indigo
];

interface DonutChartProps {
  title: string;
  data: { name: string; value: number }[];
  formatValue?: (value: number) => string;
}

export function DonutChart({ title, data, formatValue }: DonutChartProps) {
  const { isDark } = useAdminTheme();
  const total = data.reduce((acc, d) => acc + d.value, 0);
  const fmt = formatValue ?? ((v: number) => String(v));

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border-subtle dark:border-zinc-800 shadow-sm p-5">
        <p className="text-[0.65rem] uppercase tracking-[0.12em] text-content-tertiary dark:text-zinc-500 mb-4">
          {title}
        </p>
        <p className="text-xs text-content-quaternary dark:text-zinc-500 text-center py-8">
          Sin datos
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border-subtle dark:border-zinc-800 shadow-sm p-5">
      <p className="text-[0.65rem] uppercase tracking-[0.12em] text-content-tertiary dark:text-zinc-500 mb-3">
        {title}
      </p>

      <div className="flex items-center gap-4">
        <div className="w-28 h-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={30}
                outerRadius={50}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: isDark ? "#27272a" : "#fff",
                  border: isDark ? "1px solid #3f3f46" : "1px solid rgba(0,0,0,0.07)",
                  borderRadius: 10,
                  fontSize: 12,
                  color: isDark ? "#f4f4f5" : "#1a1714",
                }}
                formatter={(value) => fmt(Number(value))}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          {data.map((d, i) => {
            const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
            return (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="truncate text-content-secondary dark:text-zinc-400 flex-1">
                  {d.name}
                </span>
                <span className="font-semibold text-content dark:text-zinc-100 tabular-nums shrink-0">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

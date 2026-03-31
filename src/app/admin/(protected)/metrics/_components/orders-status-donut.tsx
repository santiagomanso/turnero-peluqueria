"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useAdminTheme } from "@/app/admin/_components/admin-theme-provider";
import type { OrdersByStatus } from "@/types/metrics";

interface Props {
  data: OrdersByStatus[];
}

export function OrdersStatusDonut({ data }: Props) {
  const { isDark } = useAdminTheme();
  const total = data.reduce((acc, d) => acc + d.count, 0);

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border-subtle dark:border-zinc-800 shadow-sm p-5">
        <p className="text-[0.65rem] uppercase tracking-[0.12em] text-content-tertiary dark:text-zinc-500 mb-4">
          Pedidos por estado
        </p>
        <p className="text-xs text-content-quaternary dark:text-zinc-500 text-center py-8">
          Sin pedidos
        </p>
      </div>
    );
  }

  const chartData = data.map((d) => ({ name: d.label, value: d.count, color: d.color }));

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border-subtle dark:border-zinc-800 shadow-sm p-5">
      <p className="text-[0.65rem] uppercase tracking-[0.12em] text-content-tertiary dark:text-zinc-500 mb-3">
        Pedidos por estado
      </p>

      <div className="flex items-center gap-4">
        <div className="w-28 h-28 shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={30}
                outerRadius={50}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
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
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-heebo text-lg font-bold text-content dark:text-zinc-100">
              {total}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          {data.map((d) => (
            <div key={d.status} className="flex items-center gap-2 text-xs">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: d.color }}
              />
              <span className="truncate text-content-secondary dark:text-zinc-400 flex-1">
                {d.label}
              </span>
              <span className="font-semibold text-content dark:text-zinc-100 tabular-nums shrink-0">
                {d.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

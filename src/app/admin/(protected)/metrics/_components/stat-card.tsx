import { TrendingUp, TrendingDown } from "lucide-react";
import type { Period } from "@/types/metrics";

const periodLabel: Record<Period, string> = {
  week: "semana pasada",
  month: "mes pasado",
  year: "año pasado",
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  labelMobile?: string;
  value: string;
  delta: number;
  period: Period;
}

export function StatCard({
  icon: Icon,
  label,
  labelMobile,
  value,
  delta,
  period,
}: StatCardProps) {
  const isPositive = delta >= 0;
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border-subtle dark:border-zinc-800 shadow-sm overflow-hidden flex">
      <div className="w-0.75 shrink-0 bg-zinc-300 dark:bg-zinc-700" />
      <div className="flex flex-col gap-3 p-5 flex-1 min-w-0">
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
        <p className="font-heebo text-2xl font-semibold text-content dark:text-zinc-100 leading-none">
          {value}
        </p>
        <div className="flex items-center gap-1 text-[0.7rem] font-medium text-content-tertiary dark:text-zinc-500">
          {isPositive ? (
            <TrendingUp className="w-3 h-3 text-green-600 shrink-0" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-500 shrink-0" />
          )}
          {isPositive ? "+" : ""}
          {delta}% vs {periodLabel[period]}
        </div>
      </div>
    </div>
  );
}

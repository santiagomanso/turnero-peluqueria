"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePeriod } from "../_hooks/use-period";

const PERIODS = [
  { id: "week" as const, label: "Semana" },
  { id: "month" as const, label: "Mes" },
  { id: "year" as const, label: "Año" },
];

export default function PeriodTabs() {
  const { period, setPeriod } = usePeriod();

  return (
    <div className="relative flex gap-1 bg-surface dark:bg-zinc-800 rounded-md p-0.5 border border-border-subtle dark:border-zinc-700 h-9 items-center">
      {PERIODS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setPeriod(id)}
          className="relative px-3 py-1 rounded-md text-xs font-medium z-10 h-full"
        >
          {period === id && (
            <motion.span
              layoutId="period-pill"
              className="absolute inset-0 bg-white dark:bg-zinc-700 rounded-md"
              style={{
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span
            className={cn(
              "relative z-10 transition-colors",
              period === id
                ? "text-content dark:text-zinc-100"
                : "text-content-tertiary dark:text-zinc-500",
            )}
          >
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}

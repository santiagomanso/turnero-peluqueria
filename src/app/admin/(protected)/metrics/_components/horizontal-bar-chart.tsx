"use client";

const GOLD = "#c9a96e";

interface HorizontalBarChartProps {
  title: string;
  data: { name: string; value: number }[];
  formatValue?: (value: number) => string;
  subtitle?: string;
}

export function HorizontalBarChart({
  title,
  data,
  formatValue,
  subtitle,
}: HorizontalBarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
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
      <div className="mb-4">
        <p className="text-[0.65rem] uppercase tracking-[0.12em] text-content-tertiary dark:text-zinc-500">
          {title}
        </p>
        {subtitle && (
          <p className="text-[0.6rem] text-content-quaternary dark:text-zinc-500 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {data.map((d, i) => {
          const pct = (d.value / max) * 100;
          return (
            <div key={d.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-content-secondary dark:text-zinc-400 truncate flex-1 mr-2">
                  <span className="text-content-quaternary dark:text-zinc-500 mr-1.5 font-mono text-[0.6rem]">
                    {i + 1}
                  </span>
                  {d.name}
                </span>
                <span className="text-xs font-semibold text-content dark:text-zinc-100 tabular-nums shrink-0">
                  {fmt(d.value)}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-surface dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: GOLD }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

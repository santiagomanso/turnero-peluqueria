import { Clock } from "lucide-react";

const GOLD = "#c9a96e";

interface TopHoursProps {
  data: { label: string; turnos: number }[];
}

export function TopHours({ data }: TopHoursProps) {
  const max = Math.max(...data.map((d) => d.turnos));
  const sorted = [...data].sort((a, b) => b.turnos - a.turnos);
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border-subtle dark:border-zinc-800 shadow-sm p-5">
      <p className="text-[0.65rem] uppercase tracking-[0.12em] text-content-tertiary dark:text-zinc-500 mb-4">
        <Clock className="w-3 h-3 inline mr-1.5 text-gold" />
        Horarios más demandados
      </p>
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
    </div>
  );
}

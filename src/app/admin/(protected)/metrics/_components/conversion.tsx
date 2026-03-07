const GREEN = "#5a9e6f";
const RED = "#e05b4b";

interface ConversionCardProps {
  paid: number;
  cancelled: number;
  total: number;
}

export function ConversionCard({
  paid,
  cancelled,
  total,
}: ConversionCardProps) {
  const conversionRate = Math.round((paid / total) * 100);
  const cancellationRate = Math.round((cancelled / total) * 100);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border-subtle dark:border-zinc-800 shadow-sm p-5">
      <p className="text-[0.65rem] uppercase tracking-[0.12em] text-content-tertiary dark:text-zinc-500 mb-4">
        Conversión PENDING → PAID
      </p>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-content-secondary dark:text-zinc-400">
            Pagados
          </span>
          <span className="text-xs font-semibold text-green-600">{paid}</span>
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
            {cancelled}
          </span>
        </div>
        <div className="h-2 bg-surface dark:bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${cancellationRate}%`, background: RED }}
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
  );
}

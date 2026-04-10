"use client";

import { useRef, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateLongFromISO } from "@/lib/format-date";
import type { Appointment } from "@/types/appointment";
import { useAppointmentSearch } from "../_hooks/use-appointment-search";
import { useAdminAppointments } from "../_hooks/use-appointments";

function StatusBadge({ status }: { status: Appointment["status"] }) {
  if (status === "PAID")
    return (
      <span className="shrink-0 text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
        Pagado
      </span>
    );
  if (status === "PENDING")
    return (
      <span className="shrink-0 text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/25">
        Pendiente
      </span>
    );
  return (
    <span className="shrink-0 text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
      Cancelado
    </span>
  );
}

/** Display identity in the dropdown: phone > email > name */
function getIdentity(a: Appointment): string {
  const phone = a.telephone.slice(-10);
  if (phone) return phone;
  if (a.payerEmail) return a.payerEmail;
  if (a.payerName) return a.payerName;
  return `#${a.id.slice(-6).toUpperCase()}`;
}

/**
 * Returns the value to autocomplete in the input after clicking a result.
 * Uses the field that actually matched the query, so email searches autocomplete
 * with the email (not the phone), allowing the ring to stay specific.
 */
function getMatchingIdentity(a: Appointment, query: string): string {
  const q = query.trim();
  const lower = q.toLowerCase();
  const digits = q.replace(/\D/g, "");

  // All-digit (or mostly digit) query → phone match
  if (digits.length >= 5 && a.telephone.includes(digits)) {
    return a.telephone.slice(-10);
  }
  // Non-digit query → try email first, then name
  if (a.payerEmail && a.payerEmail.toLowerCase().includes(lower)) {
    return a.payerEmail;
  }
  if (a.payerName && a.payerName.toLowerCase().includes(lower)) {
    return a.payerName;
  }
  // Short ID
  const shortId = lower.replace(/^#/, "");
  if (shortId && a.id.toLowerCase().includes(shortId)) {
    return `#${a.id.slice(-6).toUpperCase()}`;
  }
  // Fallback
  return a.telephone.slice(-10);
}

function groupByDate(appointments: Appointment[]): [string, Appointment[]][] {
  const map = new Map<string, Appointment[]>();
  for (const a of appointments) {
    const key = a.date.toISOString().slice(0, 10);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(a);
  }
  return Array.from(map.entries());
}

interface Props {
  className?: string;
}

export function GlobalSearchInput({ className }: Props) {
  const { query, results, isSearching, isOpen, handleQueryChange, setQueryDirect, close } =
    useAppointmentSearch();
  const vm = useAdminAppointments();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [close]);

  function handleResultClick(a: Appointment) {
    const dateISO = a.date.toISOString().slice(0, 10);
    const [y, m, d] = dateISO.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0, 0));

    // Enable cancelled toggle if needed before navigating
    if (a.status === "CANCELLED" && !vm.showCancelled) {
      useAdminAppointments.setState({ showCancelled: true });
    }

    vm.handleDateSelect(date);
    vm.setHighlightedAppointmentId(a.id);

    // Autocomplete with the field that matched the query (email → email, phone → phone)
    setQueryDirect(getMatchingIdentity(a, query));
    close();
  }

  const groups = groupByDate(results);
  const hasResults = results.length > 0;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Input */}
      <div
        className={cn(
          "flex items-center gap-2 h-8 pl-3 pr-3 border border-border-subtle dark:border-zinc-700 bg-transparent transition-colors",
          isOpen
            ? "rounded-t-lg border-gold/40 dark:border-gold/40 border-b-transparent dark:border-b-transparent"
            : "rounded-lg",
        )}
      >
        {isSearching ? (
          <Loader2 className="w-3.5 h-3.5 text-gold shrink-0 animate-spin" />
        ) : (
          <Search className="w-3.5 h-3.5 text-content-tertiary dark:text-zinc-500 shrink-0" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && close()}
          placeholder="Buscar por teléfono, email o #ID..."
          className="flex-1 min-w-0 text-xs bg-transparent text-content dark:text-zinc-100 placeholder:text-content-tertiary dark:placeholder:text-zinc-500 focus:outline-none"
        />
        {isOpen && (
          <kbd className="shrink-0 text-[0.6rem] text-content-quaternary dark:text-zinc-600 bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded font-mono">
            ESC
          </kbd>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 bg-white dark:bg-zinc-900 border border-gold/40 dark:border-gold/40 border-t-0 rounded-b-xl shadow-lg overflow-hidden max-h-80 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-border-subtle dark:border-zinc-800">
            <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-content-quaternary dark:text-zinc-500">
              {hasResults
                ? `${results.length}${results.length === 20 ? "+" : ""} resultado${results.length !== 1 ? "s" : ""}`
                : "Sin resultados"}
            </span>
            <span className="text-[0.65rem] text-content-quaternary dark:text-zinc-600">
              todas las fechas
            </span>
          </div>

          {/* Results */}
          <div className="overflow-y-auto flex-1">
            {hasResults ? (
              groups.map(([dateISO, appts]) => (
                <div key={dateISO} className="px-2 py-1.5">
                  <p className="text-[0.65rem] font-bold uppercase tracking-wide text-gold px-1 mb-1">
                    {formatDateLongFromISO(dateISO)}
                  </p>
                  {appts.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => handleResultClick(a)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-black/4 dark:hover:bg-white/5 transition-colors"
                    >
                      <span className="flex-1 min-w-0 text-xs font-semibold text-content dark:text-zinc-100 truncate">
                        {getIdentity(a)}
                      </span>
                      <span className="shrink-0 text-[0.7rem] text-content-secondary dark:text-zinc-400 font-heebo">
                        {a.time}
                      </span>
                      <StatusBadge status={a.status} />
                    </button>
                  ))}
                </div>
              ))
            ) : (
              <div className="px-3 py-5 text-center">
                <p className="text-xs text-content-secondary dark:text-zinc-400">
                  Sin resultados para{" "}
                  <span className="font-medium">&ldquo;{query}&rdquo;</span>
                </p>
              </div>
            )}
          </div>

          {results.length === 20 && (
            <div className="px-3 py-1.5 border-t border-border-subtle dark:border-zinc-800">
              <p className="text-[0.65rem] text-content-quaternary dark:text-zinc-600 text-center">
                Mostrando los primeros 20 resultados — refiná la búsqueda
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

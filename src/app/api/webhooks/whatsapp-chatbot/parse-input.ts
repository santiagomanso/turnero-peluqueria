import { parse, isValid, startOfDay } from "date-fns";
import { formatDateISO } from "@/lib/format-date";

// Convierte input del usuario a fecha Date o null
// Acepta: "22/03", "22-03", "22/03/2026", "3" (número de lista)
export function parseUserDate(input: string, options: Date[]): Date | null {
  const trimmed = input.trim();

  // Si eligió un número de la lista
  const index = parseInt(trimmed);
  if (!isNaN(index) && index >= 1 && index <= options.length) {
    return options[index - 1];
  }

  const currentYear = new Date().getFullYear();
  const formats = ["dd/MM/yyyy", "dd-MM-yyyy", "dd/MM", "dd-MM"];

  for (const fmt of formats) {
    const baseDate = fmt.includes("yyyy")
      ? new Date()
      : new Date(currentYear, 0, 1);

    const parsed = parse(trimmed, fmt, baseDate);
    if (isValid(parsed)) {
      const today = startOfDay(new Date());
      if (parsed < today) parsed.setFullYear(currentYear + 1);
      return parsed;
    }
  }

  return null;
}

// Convierte input del usuario a hora "HH:mm" o null
// Acepta: "3" (número de lista), "10:30", "10.30", "a las 4", "4", "16hs", "mediodía"
export function parseUserTime(input: string, options: string[]): string | null {
  const trimmed = input.trim().toLowerCase();

  // Si eligió un número de la lista
  const index = parseInt(trimmed);
  if (!isNaN(index) && index >= 1 && index <= options.length) {
    return options[index - 1];
  }

  // Casos especiales
  if (trimmed === "mediodía" || trimmed === "mediodia") return "12:00";

  // Limpiar prefijos y sufijos
  const cleaned = trimmed
    .replace(/^a las\s+/, "")
    .replace(/hs\.?$/, "")
    .replace(/pm$/, "")
    .replace(/am$/, "")
    .trim();

  // Formato HH:MM o HH.MM
  const withColon = cleaned.replace(".", ":");
  const timeMatch = withColon.match(/^(\d{1,2}):(\d{2})$/);
  if (timeMatch) {
    const hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2];
    const normalized = applyWorkingHours(hours);
    return `${String(normalized).padStart(2, "0")}:${minutes}`;
  }

  // Solo número (ej: "4", "16")
  const hourOnly = parseInt(cleaned);
  if (!isNaN(hourOnly)) {
    const normalized = applyWorkingHours(hourOnly);
    return `${String(normalized).padStart(2, "0")}:00`;
  }

  return null;
}

// Horario laboral 08:00 - 19:30
// Si hora < 8 → sumar 12 (4 → 16, 7 → 19)
function applyWorkingHours(hour: number): number {
  if (hour < 8) return hour + 12;
  return hour;
}

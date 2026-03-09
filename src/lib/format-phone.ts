import { parsePhoneNumber, AsYouType } from "libphonenumber-js";

/** Normaliza para DB: "3794800756" → "5493794800756" */
export function formatArgentinianPhone(telephone: string): string {
  const digits = telephone.replace(/\D/g, "");
  if (digits.startsWith("54")) return digits;
  return `549${digits}`;
}

/** Formatea en tiempo real mientras el usuario escribe: "3794800756" → "3794 80-0756" */
export function formatPhoneAsYouType(value: string): string {
  const digits = value.replace(/\D/g, "");
  return new AsYouType("AR").input(digits);
}

/** Formatea para mostrar en UI desde número de DB: "5493794800756" → "0379 154-800756" */
export function formatPhoneDisplay(telephone: string): string {
  try {
    const digits = telephone.replace(/\D/g, "");
    const withCountry = digits.startsWith("54")
      ? `+${digits}`
      : `+549${digits}`;
    const parsed = parsePhoneNumber(withCountry, "AR");
    return parsed.formatNational();
  } catch {
    return telephone.slice(-10);
  }
}

/** Valida que sea un número argentino válido */
export function isValidArgentinianPhone(telephone: string): boolean {
  try {
    const digits = telephone.replace(/\D/g, "");
    const withCountry = digits.startsWith("54")
      ? `+${digits}`
      : `+549${digits}`;
    const parsed = parsePhoneNumber(withCountry, "AR");
    return parsed.isValid();
  } catch {
    return false;
  }
}

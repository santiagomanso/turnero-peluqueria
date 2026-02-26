export function formatArgentinianPhone(telephone: string): string {
  const digits = telephone.replace(/\D/g, "");
  if (digits.startsWith("54")) return digits;
  return `549${digits}`;
}

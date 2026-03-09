"use server";

import { getConfig } from "@/services/config";
import type { DiscountCode } from "@/types/config";

type ValidateResult =
  | { success: true; discount: number; code: string }
  | { success: false; error: string };

export async function validateDiscountAction(
  code: string,
): Promise<ValidateResult> {
  try {
    const config = await getConfig();
    if (!config)
      return { success: false, error: "Error al leer configuración" };

    const codes = config.discountCodes as DiscountCode[];
    const found = codes.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase(),
    );

    if (!found) return { success: false, error: "Código inválido" };

    const now = new Date();
    const validFrom = new Date(found.validFrom);
    const validUntil = new Date(found.validUntil);

    if (now < validFrom)
      return { success: false, error: "El código aún no está vigente" };
    if (now > validUntil) return { success: false, error: "El código expiró" };

    return { success: true, discount: found.discount, code: found.code };
  } catch {
    return { success: false, error: "Error al validar el código" };
  }
}

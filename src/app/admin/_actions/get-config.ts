"use server";

import { getConfig } from "@/services/config";
import type { ConfigData } from "@/types/config";

export async function getConfigAction(): Promise<
  { success: true; data: ConfigData } | { success: false; error: string }
> {
  try {
    const data = await getConfig();
    if (!data)
      return { success: false, error: "No hay configuración guardada" };
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching config:", error);
    return { success: false, error: "Error al obtener la configuración" };
  }
}

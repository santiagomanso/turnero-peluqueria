"use server";

import { revalidatePath } from "next/cache";
import { upsertConfig } from "@/services/config";
import type { ConfigData } from "@/types/config";

export async function saveConfigAction(
  data: ConfigData,
): Promise<{ success: boolean; error?: string }> {
  try {
    await upsertConfig(data);
    revalidatePath("/admin/config");
    return { success: true };
  } catch (error) {
    console.error("Error saving config:", error);
    return { success: false, error: "Error al guardar la configuración" };
  }
}

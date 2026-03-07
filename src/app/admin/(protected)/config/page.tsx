import { cookies } from "next/headers";
import { getConfig } from "@/services/config";
import { ConfigView } from "./_components/config-view";

export default async function ConfigPage() {
  const [config, cookieStore] = await Promise.all([getConfig(), cookies()]);

  const initialTheme =
    cookieStore.get("admin-theme")?.value === "dark" ? "dark" : "light";

  return <ConfigView initialData={config} initialTheme={initialTheme} />;
}

import { cookies } from "next/headers";
import { ConfigView } from "./_components/config-view";

export default async function ConfigPage() {
  const cookieStore = await cookies();
  const initialTheme =
    cookieStore.get("admin-theme")?.value === "dark" ? "dark" : "light";

  return <ConfigView initialTheme={initialTheme} />;
}

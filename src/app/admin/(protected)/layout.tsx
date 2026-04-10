import { ReactNode } from "react";
import { cookies } from "next/headers";
import AdminSidebar from "../_components/admin-sidebar";
import AdminThemeProvider from "../_components/admin-theme-provider";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const isDark = cookieStore.get("admin-theme")?.value === "dark";

  return (
    <AdminThemeProvider defaultDark={isDark}>
      <main className="relative h-svh w-screen flex font-archivo bg-surface dark:bg-zinc-950 overflow-hidden pt-safe">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-gold-gradient z-10 max-lg:hidden" />
        <AdminSidebar />
        <main className="flex-1 min-w-0 max-lg:pt-14 h-full overflow-hidden flex flex-col bg-white dark:bg-zinc-950">
          {children}
        </main>
      </main>
    </AdminThemeProvider>
  );
}

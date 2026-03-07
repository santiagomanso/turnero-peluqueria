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
      <main className="h-svh w-screen flex items-start justify-center font-archivo md:py-5 md:items-center overflow-hidden pt-safe bg-white dark:bg-zinc-900 md:bg-linear-to-br md:from-slate-500 md:via-slate-400 md:to-slate-400 md:dark:bg-none md:dark:bg-zinc-950">
        <div className="flex w-full h-full bg-white dark:bg-zinc-900 md:border md:border-white/20 md:dark:border-zinc-800 md:shadow-xl md:w-5/6 md:rounded-2xl md:max-w-5xl md:h-[85vh] relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-gold-gradient z-10 max-md:hidden" />
          <AdminSidebar />
          <main className="flex-1 min-w-0 max-lg:pt-14 bg-white dark:bg-zinc-900 h-full overflow-hidden flex flex-col">
            {children}
          </main>
        </div>
      </main>
    </AdminThemeProvider>
  );
}

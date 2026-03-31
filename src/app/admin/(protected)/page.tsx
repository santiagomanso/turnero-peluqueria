import { Suspense } from "react";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { OptionsDropdown } from "@/app/admin/_components/options-dropdown";
import DashboardData from "./_components/dashboard-data";

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-border-subtle dark:border-zinc-800 shadow-sm p-5 h-32 animate-pulse"
        />
      ))}
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="flex flex-col h-full max-md:pt-0">
      <AdminPageHeader
        title="Panel de control"
        subtitle="Resumen del día"
        desktopControls={<OptionsDropdown />}
        mobileControls={<OptionsDropdown />}
      />

      <div className="px-7 py-6 max-md:px-4">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardData />
        </Suspense>
      </div>
    </div>
  );
}

import { Suspense } from "react";
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
    <div className="flex flex-col h-full">
      <div className="px-7 py-6 max-md:px-4">
        <h1 className="font-heebo text-xl font-semibold text-content dark:text-zinc-100">
          Panel de control
        </h1>
        <p className="text-sm text-content-tertiary dark:text-zinc-500 mt-1">
          Resumen del día
        </p>
      </div>

      <div className="px-7 max-md:px-4 pb-6">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardData />
        </Suspense>
      </div>
    </div>
  );
}

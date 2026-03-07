function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800 ${className ?? ""}`}
    />
  );
}

function DaysSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl max-md:rounded-none border border-border-subtle max-md:border-x-0 max-md:border-b-0 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-3 w-20 mt-1" />
      </div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 rounded-lg border border-border-subtle dark:border-zinc-800 p-2.5"
          >
            <Skeleton className="h-3 w-6" />
            <Skeleton className="h-5 w-9 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function HoursSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl max-md:rounded-none border border-border-subtle max-md:border-x-0 max-md:border-b-0 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-3 w-72" />
        </div>
        <Skeleton className="h-3 w-20 mt-1" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-lg border border-border-subtle dark:border-zinc-800 p-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-5 w-9 rounded-full" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-32" />
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-7 w-7 rounded-md" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriceSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl max-md:rounded-none border border-border-subtle max-md:border-x-0 max-md:border-b-0 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex flex-col gap-2 mb-4">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-56" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

function ThemeSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl max-md:rounded-none border border-border-subtle max-md:border-x-0 max-md:border-b-0 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex flex-col gap-2 mb-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
      </div>
    </div>
  );
}

function DiscountCodesSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl max-md:rounded-none border border-border-subtle max-md:border-x-0 max-md:border-b-0 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-8 w-28 rounded-md" />
      </div>
      <div className="rounded-lg border border-border-subtle dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-3 border-b border-border-subtle dark:border-zinc-800">
          {[100, 60, 80, 80, 60, 40].map((w, i) => (
            <Skeleton
              key={i}
              className={`h-3 w-${w === 100 ? "24" : w === 80 ? "20" : w === 60 ? "16" : "10"}`}
            />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3.5 border-b border-border-subtle dark:border-zinc-800 last:border-0"
          >
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-12 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="flex flex-col h-full max-md:pt-0">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-border-subtle dark:border-zinc-800 px-7 h-19 flex items-center max-lg:hidden">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3 w-64" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-7 py-5 max-md:px-0 max-md:py-0 flex flex-col gap-4 max-md:gap-0">
          <DaysSkeleton />
          <HoursSkeleton />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-md:gap-0">
            <PriceSkeleton />
            <ThemeSkeleton />
          </div>
          <DiscountCodesSkeleton />
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 z-10 border-t border-border-subtle dark:border-zinc-800 bg-white dark:bg-zinc-900 px-7 max-lg:px-4 h-17 flex items-center justify-between gap-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-56 max-lg:hidden" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-28 rounded-md" />
          <Skeleton className="h-8 w-36 rounded-md" />
        </div>
      </div>
    </div>
  );
}

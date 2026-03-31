/**
 * Skeleton shown while CategoryData is loading via Suspense.
 */
export default function CategorySkeleton() {
  return (
    <div className="pb-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="h-3 w-32 bg-surface dark:bg-zinc-800 rounded mb-4" />

      {/* Header */}
      <div className="mb-5 space-y-2">
        <div className="h-7 w-48 bg-surface dark:bg-zinc-800 rounded-lg" />
        <div className="h-3 w-28 bg-surface dark:bg-zinc-800 rounded" />
        <div className="h-px w-7 bg-surface dark:bg-zinc-800" />
      </div>

      {/* Category switcher pills */}
      <div className="flex gap-2 mb-6 overflow-hidden">
        {[80, 64, 72, 56, 88, 60, 52].map((w) => (
          <div
            key={w}
            className="h-8 shrink-0 bg-surface dark:bg-zinc-800 rounded-full"
            style={{ width: w }}
          />
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden">
            <div className="aspect-square bg-surface dark:bg-zinc-800" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-surface dark:bg-zinc-800 rounded w-3/4" />
              <div className="h-3 bg-surface dark:bg-zinc-800 rounded w-1/2" />
              <div className="flex justify-between items-center mt-1">
                <div className="h-4 w-14 bg-surface dark:bg-zinc-800 rounded" />
                <div className="h-7 w-20 bg-surface dark:bg-zinc-800 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

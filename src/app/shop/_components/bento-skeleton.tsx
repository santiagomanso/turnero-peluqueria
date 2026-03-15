/**
 * Skeleton shown while ShopCategoriesData is loading via Suspense.
 * Mirrors the bento grid layout: 1 xl + 2 sm + 2 wide + 2 sm.
 */
export default function BentoSkeleton() {
  return (
    <div className="pb-8 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-5 space-y-2">
        <div className="h-7 w-32 bg-surface dark:bg-zinc-800 rounded-lg" />
        <div className="h-3 w-44 bg-surface dark:bg-zinc-800 rounded" />
        <div className="h-px w-7 bg-surface dark:bg-zinc-800 rounded" />
      </div>

      {/* Bento grid skeleton */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        style={{ gridAutoRows: "160px" }}
      >
        {/* xl */}
        <div className="col-span-2 row-span-1 lg:col-span-2 lg:row-span-2 bg-surface dark:bg-zinc-800 rounded-2xl" />
        {/* sm sm */}
        <div className="col-span-1 bg-surface dark:bg-zinc-800 rounded-2xl" />
        <div className="col-span-1 bg-surface dark:bg-zinc-800 rounded-2xl" />
        {/* wide */}
        <div className="col-span-2 bg-surface dark:bg-zinc-800 rounded-2xl" />
        {/* wide */}
        <div className="col-span-2 bg-surface dark:bg-zinc-800 rounded-2xl" />
        {/* sm sm */}
        <div className="col-span-1 bg-surface dark:bg-zinc-800 rounded-2xl" />
        <div className="col-span-1 bg-surface dark:bg-zinc-800 rounded-2xl" />
      </div>
    </div>
  );
}

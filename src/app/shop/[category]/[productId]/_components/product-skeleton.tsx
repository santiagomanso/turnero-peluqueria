export default function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-5">
        <div className="h-2.5 w-10 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-2.5 w-2 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-2.5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-2.5 w-2 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-2.5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 lg:gap-12 items-start max-w-5xl">
        {/* Image */}
        <div className="aspect-square rounded-2xl bg-zinc-200 dark:bg-zinc-800" />

        {/* Details */}
        <div className="flex flex-col gap-5 pt-1">
          <div className="h-3 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="space-y-3">
            <div className="h-8 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            <div className="h-10 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            <div className="h-0.5 w-8 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-2.5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-3.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-3.5 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-3.5 w-4/6 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
          <div className="h-14 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl mt-2" />
        </div>
      </div>
    </div>
  );
}

export default function ProductSkeleton() {
  return (
    <div className="animate-pulse space-y-4 pb-8">
      {/* Back link placeholder */}
      <div className="h-3 w-32 bg-surface dark:bg-zinc-800 rounded" />

      {/* Image */}
      <div className="aspect-[4/3] rounded-2xl bg-surface dark:bg-zinc-800" />

      {/* Name + price */}
      <div className="space-y-2">
        <div className="h-6 w-3/4 bg-surface dark:bg-zinc-800 rounded-lg" />
        <div className="h-8 w-1/3 bg-surface dark:bg-zinc-800 rounded-lg" />
      </div>

      {/* Description lines */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-surface dark:bg-zinc-800 rounded" />
        <div className="h-3 w-5/6 bg-surface dark:bg-zinc-800 rounded" />
        <div className="h-3 w-4/6 bg-surface dark:bg-zinc-800 rounded" />
      </div>

      {/* Button */}
      <div className="h-12 w-full bg-surface dark:bg-zinc-800 rounded-xl" />
    </div>
  );
}

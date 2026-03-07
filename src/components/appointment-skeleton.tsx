export default function AppointmentSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl border border-border-subtle dark:border-zinc-700 shadow-sm p-4 animate-pulse">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-black/8 dark:bg-white/8 rounded" />
            <div className="space-y-1">
              <div className="h-2 w-10 bg-black/8 dark:bg-white/8 rounded" />
              <div className="h-3 w-16 bg-black/8 dark:bg-white/8 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-black/8 dark:bg-white/8 rounded" />
            <div className="space-y-1">
              <div className="h-2 w-10 bg-black/8 dark:bg-white/8 rounded" />
              <div className="h-3 w-12 bg-black/8 dark:bg-white/8 rounded" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-black/8 dark:bg-white/8 rounded" />
          <div className="space-y-1">
            <div className="h-2 w-12 bg-black/8 dark:bg-white/8 rounded" />
            <div className="h-3 w-20 bg-black/8 dark:bg-white/8 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="h-8 bg-black/5 dark:bg-white/5 rounded-lg" />
          <div className="h-8 bg-black/5 dark:bg-white/5 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

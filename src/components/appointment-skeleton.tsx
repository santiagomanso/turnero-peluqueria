export default function AppointmentSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-border-subtle shadow-sm p-4 animate-pulse">
      <div className="space-y-3">
        {/* Date and Time placeholders */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-black/8 rounded" />
            <div className="space-y-1">
              <div className="h-2 w-10 bg-black/8 rounded" />
              <div className="h-3 w-16 bg-black/8 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-black/8 rounded" />
            <div className="space-y-1">
              <div className="h-2 w-10 bg-black/8 rounded" />
              <div className="h-3 w-12 bg-black/8 rounded" />
            </div>
          </div>
        </div>

        {/* Phone placeholder */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-black/8 rounded" />
          <div className="space-y-1">
            <div className="h-2 w-12 bg-black/8 rounded" />
            <div className="h-3 w-20 bg-black/8 rounded" />
          </div>
        </div>

        {/* Buttons placeholder */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="h-8 bg-black/5 rounded-lg" />
          <div className="h-8 bg-black/5 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

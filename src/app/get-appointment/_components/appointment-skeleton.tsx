export default function AppointmentSkeleton() {
  return (
    <div className="shadow-md shadow-fuchsia-950 bg-white/5 rounded-lg p-3 border border-white/20 animate-pulse">
      <div className="space-y-3">
        {/* Date and Time placeholders */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white/20 rounded" />
            <div className="space-y-1">
              <div className="h-3 w-12 bg-white/20 rounded" />
              <div className="h-4 w-20 bg-white/20 rounded" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white/20 rounded" />
            <div className="space-y-1">
              <div className="h-3 w-12 bg-white/20 rounded" />
              <div className="h-4 w-16 bg-white/20 rounded" />
            </div>
          </div>
        </div>

        {/* Phone placeholder */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white/20 rounded" />
          <div className="space-y-1">
            <div className="h-3 w-16 bg-white/20 rounded" />
            <div className="h-4 w-24 bg-white/20 rounded" />
          </div>
        </div>

        {/* Buttons placeholder */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="h-10 bg-white/20 rounded" />
          <div className="h-10 bg-white/20 rounded" />
        </div>
      </div>
    </div>
  );
}

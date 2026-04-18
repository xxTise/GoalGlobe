"use client";

export function DetailSkeleton() {
  return (
    <div className="px-6 py-4 space-y-4 animate-pulse">
      {/* Stat bars skeleton */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex justify-between">
            <div className="h-3 w-6 bg-white/[0.04] rounded" />
            <div className="h-3 w-16 bg-white/[0.04] rounded" />
            <div className="h-3 w-6 bg-white/[0.04] rounded" />
          </div>
          <div className="h-1 bg-white/[0.04] rounded-full" />
        </div>
      ))}
    </div>
  );
}

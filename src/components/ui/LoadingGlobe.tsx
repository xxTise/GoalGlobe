"use client";

export function LoadingGlobe() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#06060f]">
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border border-zinc-800 border-t-emerald-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>
      <p className="text-zinc-600 text-xs tracking-[0.2em] uppercase">
        Loading matches
      </p>
    </div>
  );
}

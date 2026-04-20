"use client";

import { FollowableType } from "@/hooks/useFollowing";

interface FollowButtonProps {
  type: FollowableType;
  id: string;
  name: string;
  logo?: string;
  isFollowing: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  size?: "sm" | "md";
}

export function FollowButton({
  isFollowing,
  onFollow,
  onUnfollow,
  size = "sm",
}: FollowButtonProps) {
  const isSm = size === "sm";

  if (isFollowing) {
    return (
      <button
        onClick={onUnfollow}
        className={`inline-flex items-center gap-1.5 rounded-lg border font-medium transition-all cursor-pointer bg-emerald-500/15 border-emerald-500/25 text-emerald-400 hover:bg-red-500/15 hover:border-red-500/25 hover:text-red-400 group ${
          isSm ? "px-2.5 py-1 text-[10px]" : "px-3.5 py-1.5 text-[11px]"
        }`}
      >
        <svg
          width={isSm ? 10 : 12}
          height={isSm ? 10 : 12}
          viewBox="0 0 24 24"
          fill="currentColor"
          className="group-hover:hidden"
        >
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
        <svg
          width={isSm ? 10 : 12}
          height={isSm ? 10 : 12}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="hidden group-hover:block"
        >
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
        <span className="group-hover:hidden">Following</span>
        <span className="hidden group-hover:inline">Unfollow</span>
      </button>
    );
  }

  return (
    <button
      onClick={onFollow}
      className={`inline-flex items-center gap-1.5 rounded-lg border font-medium transition-all cursor-pointer bg-white/[0.04] border-white/[0.08] text-zinc-400 hover:bg-white/[0.08] hover:text-white ${
        isSm ? "px-2.5 py-1 text-[10px]" : "px-3.5 py-1.5 text-[11px]"
      }`}
    >
      <svg
        width={isSm ? 10 : 12}
        height={isSm ? 10 : 12}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
      Follow
    </button>
  );
}

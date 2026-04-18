"use client";

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  count?: number;
  color?: "default" | "green" | "amber" | "blue" | "red";
}

const COLOR_MAP = {
  default: {
    active: "bg-white/[0.1] text-white border-white/[0.12]",
    inactive: "bg-white/[0.03] text-zinc-500 border-white/[0.04] hover:bg-white/[0.06] hover:text-zinc-300",
  },
  green: {
    active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    inactive: "bg-white/[0.03] text-zinc-500 border-white/[0.04] hover:bg-emerald-500/10 hover:text-emerald-400",
  },
  amber: {
    active: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    inactive: "bg-white/[0.03] text-zinc-500 border-white/[0.04] hover:bg-amber-500/10 hover:text-amber-400",
  },
  blue: {
    active: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    inactive: "bg-white/[0.03] text-zinc-500 border-white/[0.04] hover:bg-blue-500/10 hover:text-blue-400",
  },
  red: {
    active: "bg-red-500/15 text-red-400 border-red-500/25",
    inactive: "bg-white/[0.03] text-zinc-500 border-white/[0.04] hover:bg-red-500/10 hover:text-red-400",
  },
};

export function FilterChip({
  label,
  active,
  onClick,
  icon,
  count,
  color = "default",
}: FilterChipProps) {
  const colors = COLOR_MAP[color];

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all duration-200 cursor-pointer whitespace-nowrap ${
        active ? colors.active : colors.inactive
      }`}
    >
      {icon}
      {label}
      {count != null && count > 0 && (
        <span className={`text-[9px] tabular-nums ${active ? "opacity-70" : "opacity-50"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

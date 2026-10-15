const COLORS = [
  "bg-rose-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-lime-600",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-sky-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-fuchsia-500",
];

const SIZES = {
  sm: "size-6 text-xs",
  md: "size-9 text-sm",
  lg: "size-10 text-base",
};

function colorFor(name: string) {
  let hash = 0;
  for (const char of name) {
    hash = (hash * 31 + char.codePointAt(0)!) >>> 0;
  }
  return COLORS[hash % COLORS.length];
}

export function Avatar({ name, size = "md" }: { name: string; size?: keyof typeof SIZES }) {
  const initial = Array.from(name.trim())[0]?.toUpperCase() ?? "?";
  return (
    <span
      aria-hidden
      className={`${colorFor(name)} ${SIZES[size]} inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white select-none`}
    >
      {initial}
    </span>
  );
}

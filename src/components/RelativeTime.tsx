const formatter = new Intl.RelativeTimeFormat("ja", { numeric: "auto" });

const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

// SQLite の datetime('now') は "YYYY-MM-DD HH:MM:SS" (UTC) 形式で保存される
function parseUtc(value: string) {
  return new Date(value.replace(" ", "T") + "Z");
}

function formatRelative(date: Date) {
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  for (const [unit, unitSeconds] of UNITS) {
    if (Math.abs(seconds) >= unitSeconds) {
      return formatter.format(Math.round(seconds / unitSeconds), unit);
    }
  }
  return "たった今";
}

export function RelativeTime({ value, className }: { value: string; className?: string }) {
  const date = parseUtc(value);
  return (
    <time
      dateTime={date.toISOString()}
      title={date.toLocaleString("ja-JP")}
      className={className}
      suppressHydrationWarning
    >
      {formatRelative(date)}
    </time>
  );
}

export function StatCard({
  num,
  label,
  dot,
  accent,
}: {
  num: number;
  label: string;
  dot?: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-xl border bg-surface p-4 shadow-card ${accent ? "border-accent" : "border-border"}`}>
      <div className="font-display text-[28px] normal-case text-primary">{num}</div>
      <div className="mt-0.5 flex items-center text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
        {dot && <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ background: dot }} />}
        {label}
      </div>
    </div>
  );
}

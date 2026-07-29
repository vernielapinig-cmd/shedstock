import Link from "next/link";
import { getItems, getHistory, getCurrentUserFirstName } from "@/lib/data";
import { StatCard } from "@/components/StatCard";
import { Icon, actionIcon } from "@/components/icons";
import { timeAgo } from "@/lib/utils";

export default async function DashboardPage() {
  const [items, history, firstName] = await Promise.all([
    getItems(),
    getHistory(6),
    getCurrentUserFirstName(),
  ]);
  
  const totalItems = items.length;
  const totalBrandNew = items.reduce(
    (sum, item) => sum + item.quantity_new,
    0
  );

const totalRefurbished = items.reduce(
  (sum, item) => sum + item.quantity_refurbished,
  0
);

  const locMap: Record<string, number> = {};
  items.forEach((i) => {
    locMap[i.location] = (locMap[i.location] || 0) + 1;
  });
  const topLocs = Object.entries(locMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      <div className="relative mb-6 overflow-hidden rounded-[14px] bg-primary p-6 text-white md:p-7">
        <div className="pegboard-dark absolute inset-0" />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div>
            <h2 className="text-[19px] normal-case text-white md:text-[24px]">Welcome back, {firstName}</h2>
            <p className="mt-1.5 max-w-[440px] text-[13px] normal-case text-[#C9D3D0]">
              Every tool has a place, and now every place is written down. {totalItems} item
              {totalItems === 1 ? "" : "s"} logged so far.
            </p>
          </div>
          <Link href="/inventory?add=1" className="btn-primary">
            <Icon name="plus" size={16} /> Add Item
          </Link>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3.5 md:grid-cols-5">
        <StatCard num={totalItems} label="Total Items" accent />
        <StatCard num={totalBrandNew} label="Brand New" />
        <StatCard num={totalRefurbished} label="Refurbished" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
          <h3 className="mb-3.5 text-[14px] tracking-wide text-primary">Recent Activity</h3>
          {history.length === 0 ? (
            <div className="py-4 text-center text-[13px] text-ink-faint">
              No activity yet — add your first item to get started.
            </div>
          ) : (
            history.map((h) => (
              <div key={h.id} className="flex gap-3 border-b border-border py-2.5 last:border-none">
                <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-lg bg-surface-2 text-primary">
                  <Icon name={actionIcon(h.action)} size={16} />
                </div>
                <div>
                  <div className="text-[13px] text-ink">
                    <b className="font-semibold">{h.item_name}</b> — {h.action}
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-ink-faint">
                    {timeAgo(h.created_at)} · {h.by_name}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
          <h3 className="mb-3.5 text-[14px] tracking-wide text-primary">Top Locations</h3>
          {topLocs.length === 0 ? (
            <div className="py-4 text-center text-[13px] text-ink-faint">No locations yet.</div>
          ) : (
            topLocs.map(([loc, count]) => (
              <div key={loc} className="flex items-center justify-between border-b border-border py-2.5 text-[13px] last:border-none">
                <Link href={`/inventory?location=${encodeURIComponent(loc)}`} className="flex items-center gap-1.5 font-semibold text-primary">
                  <Icon name="pin" size={14} /> {loc}
                </Link>
                <span className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-ink-soft">
                  {count}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

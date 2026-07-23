import Link from "next/link";
import { getItems } from "@/lib/data";
import { Icon } from "@/components/icons";

export default async function LocationsPage() {
  const items = await getItems();

  const locMap: Record<string, typeof items> = {};
  items.forEach((i) => {
    (locMap[i.location] ||= []).push(i);
  });
  const locs = Object.keys(locMap).sort();

  return (
    <div>
      <div className="mb-5">
        <div className="font-mono text-[11px] font-bold uppercase tracking-wide text-accent">Where things live</div>
        <h2 className="mt-1 text-[22px] text-primary md:text-[26px]">Locations</h2>
        <p className="mt-1 text-[14px] text-ink-soft">
          {locs.length} location{locs.length === 1 ? "" : "s"} in use around the house
        </p>
      </div>

      {locs.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-10 text-center shadow-card">
          <div className="flex justify-center text-ink-faint">
            <Icon name="pin" size={30} />
          </div>
          <h3 className="mt-3 text-[16px] text-primary">No locations yet</h3>
          <p className="mt-1.5 text-[13px] text-ink-soft">Locations appear here once you add items.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {locs.map((loc) => {
            const locItems = locMap[loc];
            const avail = locItems.filter((i) => i.status === "Available").length;
            const missing = locItems.filter((i) => i.status === "Missing").length;
            return (
              <Link
                key={loc}
                href={`/inventory?location=${encodeURIComponent(loc)}`}
                className="flex flex-col gap-2.5 rounded-xl border border-border bg-surface p-4 shadow-card transition-shadow hover:shadow-[0_4px_18px_rgba(20,26,24,0.12)]"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-[15px] font-bold text-ink">
                    <Icon name="pin" size={15} /> {loc}
                  </div>
                  <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                    {locItems.length} item{locItems.length === 1 ? "" : "s"} stored here
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px] text-ink-soft">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-teal" />
                    {avail} available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-rust" />
                    {missing} missing
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

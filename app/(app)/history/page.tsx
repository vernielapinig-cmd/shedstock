import { getHistory } from "@/lib/data";
import { Icon, actionIcon } from "@/components/icons";
import { fmtDate } from "@/lib/utils";

export default async function HistoryPage() {
  const history = await getHistory();

  return (
    <div>
      <div className="mb-5">
        <div className="font-mono text-[11px] font-bold uppercase tracking-wide text-accent">Audit trail</div>
        <h2 className="mt-1 text-[22px] text-primary md:text-[26px]">History Log</h2>
        <p className="mt-1 text-[14px] text-ink-soft">Every add, edit, and status change — newest first</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
        {history.length === 0 ? (
          <div className="py-4 text-center text-[13px] text-ink-faint">
            Nothing logged yet. Actions on your items will appear here.
          </div>
        ) : (
          history.map((h) => (
            <div key={h.id} className="flex gap-3.5 border-b border-border py-3.5 last:border-none">
              <div className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-lg bg-surface-2 text-primary">
                <Icon name={actionIcon(h.action)} size={16} />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="text-[13.5px] text-ink">
                    <b className="font-bold">{h.item_name}</b> — {h.action}
                  </div>
                  <div className="whitespace-nowrap font-mono text-[11px] text-ink-faint">{fmtDate(h.created_at)}</div>
                </div>
                {h.details && <div className="mt-0.5 text-[12.5px] text-ink-soft">{h.details}</div>}
                <div className="mt-0.5 text-[12.5px] text-ink-faint">by {h.by_name}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

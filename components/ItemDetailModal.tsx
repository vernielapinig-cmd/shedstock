"use client";

import { useTransition } from "react";
import { statusInfo, STATUSES } from "@/lib/constants";
import { itemCode, timeAgo } from "@/lib/utils";
import { Icon, actionIcon } from "@/components/icons";
import { useToast } from "@/components/ToastProvider";
import { updateItemStatus } from "@/actions/items";
import type { Item, HistoryEntry, ItemStatus } from "@/types/database";

export function ItemDetailModal({
  item,
  history,
  onClose,
  onEdit,
  onDelete,
}: {
  item: Item;
  history: HistoryEntry[];
  onClose: () => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}) {
  const s = statusInfo(item.status);
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const itemHist = history.filter((h) => h.item_name === item.name).slice(0, 5);

  function handleQuickStatus(newStatus: ItemStatus) {
    if (newStatus === item.status) return;
    startTransition(async () => {
      await updateItemStatus(item.id, newStatus);
      toast("Status updated");
      onClose();
    });
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(15,20,18,0.55)] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-[14px] bg-surface shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
        <div className="sticky top-0 z-[2] flex items-center justify-between border-b border-border bg-surface px-[22px] py-[18px]">
          <h3 className="text-[16px] text-primary">{item.name}</h3>
          <button onClick={onClose} className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-surface-2 text-ink-soft">
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="px-[22px] pb-[22px] pt-5">
          <div className="mb-3.5">
            <span className="inline-block rounded-[3px] bg-[#171B19] px-2 py-0.5 font-mono text-[10.5px] tracking-wide text-[#EDEFEA]">
              {itemCode(item.id)}
            </span>
            <span className={`ml-2 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide ${s.badgeBg} ${s.badgeText}`}>
              {item.status}
            </span>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-surface-2 px-3 py-2.5">
              <div className="text-[10.5px] font-bold uppercase tracking-wide text-ink-faint">Category</div>
              <div className="mt-0.5 text-[14px] font-semibold text-ink">{item.category}</div>
            </div>
            <div className="rounded-lg bg-surface-2 px-3 py-2.5">
              <div className="text-[10.5px] font-bold uppercase tracking-wide text-ink-faint">Quantity</div>
              <div className="mt-0.5 text-[14px] font-semibold text-ink">{item.quantity}</div>
            </div>
            <div className="rounded-lg bg-surface-2 px-3 py-2.5">
              <div className="text-[10.5px] font-bold uppercase tracking-wide text-ink-faint">Location</div>
              <div className="mt-0.5 flex items-center gap-1 text-[14px] font-semibold text-ink">
                <Icon name="pin" size={12} /> {item.location}
              </div>
            </div>
            <div className="rounded-lg bg-surface-2 px-3 py-2.5">
              <div className="text-[10.5px] font-bold uppercase tracking-wide text-ink-faint">Added</div>
              <div className="mt-0.5 text-[14px] font-semibold text-ink">
                {new Date(item.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {item.notes && (
            <div className="mb-4 rounded-lg bg-surface-2 p-3 text-[13.5px] leading-relaxed text-ink-soft">
              <b>Notes:</b> {item.notes}
            </div>
          )}

          <label className="mb-1.5 block text-[12px] font-semibold text-ink-soft">Quick status update</label>
          <div className="mb-4 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {STATUSES.map((st) => {
              const chosen = item.status === st.key;
              return (
                <button
                  key={st.key}
                  disabled={pending}
                  onClick={() => handleQuickStatus(st.key)}
                  className={`rounded-lg border-[1.5px] py-2 text-[11px] font-bold uppercase tracking-wide disabled:opacity-60 ${
                    chosen ? `${st.badgeBg} ${st.badgeText}` : "border-border bg-surface-2 text-ink-soft"
                  }`}
                  style={chosen ? { borderColor: st.dot } : undefined}
                >
                  {st.key}
                </button>
              );
            })}
          </div>

          <label className="mb-1.5 block text-[12px] font-semibold text-ink-soft">Recent history for this item</label>
          <div className="mb-4">
            {itemHist.length === 0 ? (
              <div className="py-2 text-center text-[13px] text-ink-faint">No history yet.</div>
            ) : (
              itemHist.map((h) => (
                <div key={h.id} className="flex gap-3 py-2">
                  <div className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-lg bg-surface-2 text-primary">
                    <Icon name={actionIcon(h.action)} size={13} />
                  </div>
                  <div>
                    <div className="text-[12.5px] text-ink">
                      {h.action}
                      {h.details ? ` — ${h.details}` : ""}
                    </div>
                    <div className="font-mono text-[11px] text-ink-faint">{timeAgo(h.created_at)}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={() => {
                onClose();
                onEdit(item);
              }}
              className="btn-ghost flex-1"
            >
              <Icon name="pencil" size={14} /> Edit
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(item);
              }}
              className="btn-danger flex-1"
            >
              <Icon name="trash" size={14} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

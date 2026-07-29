"use client";
import { itemCode } from "@/lib/utils";
import { Icon } from "@/components/icons";
import type { Item } from "@/types/database";

export function ItemCard({
  item,
  onOpen,
  onEdit,
  onDelete,
}: {
  item: Item;
  onOpen: (item: Item) => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}) {
  const total = item.quantity_new + item.quantity_refurbished;

  return (
    <div
      onClick={() => onOpen(item)}
      className="flex cursor-pointer flex-col gap-2.5 rounded-xl border border-border bg-surface p-4 shadow-card transition-shadow hover:shadow-[0_4px_18px_rgba(20,26,24,0.12)] active:scale-[0.995]"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[15px] font-bold leading-tight text-ink">{item.name}</div>
          <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            {item.category}
          </div>
        </div>
        <span className="whitespace-nowrap rounded-full bg-surface-2 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-ink-soft">
          Qty {total}
        </span>
      </div>

      <div className="inline-block self-start rounded-[3px] bg-[#171B19] px-2 py-0.5 font-mono text-[10.5px] tracking-wide text-[#EDEFEA]">
        {itemCode(item.id)}
      </div>

      <div className="flex flex-wrap gap-2">
        {item.quantity_new > 0 && (
          <span className="rounded-full bg-teal-bg px-2.5 py-1 text-[11px] font-bold text-teal">
            {item.quantity_new} Brand New
          </span>
        )}
        {item.quantity_refurbished > 0 && (
          <span className="rounded-full bg-amber-bg px-2.5 py-1 text-[11px] font-bold text-amber">
            {item.quantity_refurbished} Refurbished
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px] text-ink-soft">
        <span className="flex items-center gap-1">
          <Icon name="pin" size={13} /> {item.location}
        </span>
      </div>

      <div className="mt-0.5 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-surface-2 py-1.5 text-[12px] font-semibold text-ink-soft hover:bg-border"
        >
          <Icon name="pencil" size={13} /> Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item);
          }}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-surface-2 py-1.5 text-[12px] font-semibold text-ink-soft hover:bg-rust-bg hover:text-rust"
        >
          <Icon name="trash" size={13} /> Delete
        </button>
      </div>
    </div>
  );
}
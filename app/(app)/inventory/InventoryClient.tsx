"use client";

import { useMemo, useState, useEffect } from "react";
import { CATEGORIES, STATUSES } from "@/lib/constants";
import { Icon } from "@/components/icons";
import { ItemCard } from "@/components/ItemCard";
import { ItemFormModal } from "@/components/ItemFormModal";
import { DeleteItemModal } from "@/components/DeleteItemModal";
import { ItemDetailModal } from "@/components/ItemDetailModal";
import type { Item, HistoryEntry } from "@/types/database";

type Modal =
  | { kind: "none" }
  | { kind: "form"; item: Item | null }
  | { kind: "detail"; item: Item }
  | { kind: "delete"; item: Item };

export function InventoryClient({
  items,
  history,
  initialLocation,
  autoOpenAdd,
}: {
  items: Item[];
  history: HistoryEntry[];
  initialLocation: string;
  autoOpenAdd: boolean;
}) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState(initialLocation);
  const [status, setStatus] = useState("");
  const [modal, setModal] = useState<Modal>(autoOpenAdd ? { kind: "form", item: null } : { kind: "none" });

  // Keep detail/edit modals showing fresh data after a mutation triggers a re-fetch.
  useEffect(() => {
    if (modal.kind === "detail" || modal.kind === "delete") {
      const fresh = items.find((i) => i.id === modal.item.id);
      if (!fresh) setModal({ kind: "none" });
    }
  }, [items, modal]);

  const locations = useMemo(() => [...new Set(items.map((i) => i.location))].sort(), [items]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (q) {
        const hay = `${i.name} ${i.category} ${i.location} ${i.notes || ""}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      if (category && i.category !== category) return false;
      if (location && i.location !== location) return false;
      if (status && i.status !== status) return false;
      return true;
    });
  }, [items, q, category, location, status]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[11px] font-bold uppercase tracking-wide text-accent">Registry</div>
          <h2 className="mt-1 text-[22px] text-primary md:text-[26px]">Inventory</h2>
          <p className="mt-1 text-[14px] text-ink-soft">
            {items.length} item{items.length === 1 ? "" : "s"} tracked across the house
          </p>
        </div>
        <button onClick={() => setModal({ kind: "form", item: null })} className="btn-primary">
          <Icon name="plus" size={16} /> Add Item
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-[9px] border border-border bg-surface px-3 py-2.5 text-ink-soft">
          <Icon name="search" size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, category, location, notes…"
            className="flex-1 border-none bg-transparent text-[14px] text-ink outline-none"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="min-w-[130px] rounded-[9px] border border-border bg-surface px-3 py-2.5 text-[13px] text-ink"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="min-w-[130px] rounded-[9px] border border-border bg-surface px-3 py-2.5 text-[13px] text-ink"
        >
          <option value="">All Locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="min-w-[130px] rounded-[9px] border border-border bg-surface px-3 py-2.5 text-[13px] text-ink"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.key}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-10 text-center shadow-card">
          <div className="flex justify-center text-ink-faint">
            <Icon name={items.length > 0 ? "search" : "box"} size={30} />
          </div>
          <h3 className="mt-3 text-[16px] text-primary">
            {items.length > 0 ? "No items match your filters" : "Your registry is empty"}
          </h3>
          <p className="mt-1.5 text-[13px] text-ink-soft">
            {items.length > 0
              ? "Try clearing a filter or searching a different term."
              : "Add your first tool or piece of equipment to start tracking it."}
          </p>
          {items.length === 0 && (
            <button onClick={() => setModal({ kind: "form", item: null })} className="btn-dark mt-3.5">
              <Icon name="plus" size={16} /> Add Item
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onOpen={(i) => setModal({ kind: "detail", item: i })}
              onEdit={(i) => setModal({ kind: "form", item: i })}
              onDelete={(i) => setModal({ kind: "delete", item: i })}
            />
          ))}
        </div>
      )}

      {modal.kind === "form" && (
        <ItemFormModal item={modal.item} locations={locations} onClose={() => setModal({ kind: "none" })} />
      )}
      {modal.kind === "detail" && (
        <ItemDetailModal
          item={modal.item}
          history={history}
          onClose={() => setModal({ kind: "none" })}
          onEdit={(i) => setModal({ kind: "form", item: i })}
          onDelete={(i) => setModal({ kind: "delete", item: i })}
        />
      )}
      {modal.kind === "delete" && <DeleteItemModal item={modal.item} onClose={() => setModal({ kind: "none" })} />}
    </div>
  );
}

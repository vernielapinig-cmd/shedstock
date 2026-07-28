"use client";

import { useState, useTransition } from "react";
import { CATEGORIES, STATUSES } from "@/lib/constants";
import { Icon } from "@/components/icons";
import { useToast } from "@/components/ToastProvider";
import { addItem, updateItem } from "@/actions/items";
import type { Item, ItemStatus } from "@/types/database";

export function ItemFormModal({
  item,
  locations,
  onClose,
}: {
  item: Item | null;
  locations: string[];
  onClose: () => void;
}) {
  const editing = !!item;
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState(item?.name || "");
  const [category, setCategory] = useState(item?.category || CATEGORIES[0]);
  const [quantityText, setQuantityText] = useState(String(item?.quantity || 1));
  const quantityValue = Math.max(1, parseInt(quantityText, 10) || 1);
  const [location, setLocation] = useState(item?.location || "");
  const [status, setStatus] = useState<ItemStatus>(item?.status || "Available");
  const [notes, setNotes] = useState(item?.notes || "");
  const [error, setError] = useState<string | null>(null);

  function adjustQuantity(delta: number) {
  setQuantityText(String(Math.max(1, quantityValue + delta)));
}

function handleSave() {
  if (!name.trim() || !location.trim()) {
    setError("Please add a name and location.");
    return;
  }
  setError(null);
  const input = { name, category, quantity: quantityValue, location, status, notes };

  startTransition(async () => {
    try {
      if (editing && item) {
        await updateItem(item.id, input);
        toast("Item updated");
      } else {
        await addItem(input);
        toast("Item added to registry");
      }
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  });
}

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(15,20,18,0.55)] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-[14px] bg-surface shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
        <div className="sticky top-0 z-[2] flex items-center justify-between border-b border-border bg-surface px-[22px] py-[18px]">
          <h3 className="text-[16px] text-primary">{editing ? "Edit Item" : "Add New Item"}</h3>
          <button
            onClick={onClose}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-surface-2 text-ink-soft"
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="px-[22px] pb-[22px] pt-5">
          {error && (
            <div className="mb-3.5 flex items-start gap-2 rounded-lg bg-rust-bg px-3 py-2.5 text-[13px] text-rust">
              <Icon name="alert" size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-3.5">
            <label className="mb-1.5 block text-[12px] font-semibold text-ink-soft">Item Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cordless Drill"
              className="field-input"
            />
          </div>

          <div className="mb-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-ink-soft">Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                list="categoryList"
                placeholder="e.g. Tools"
                className="field-input"
              />
              <datalist id="categoryList">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
           <div>
  <label className="mb-1.5 block text-[12px] font-semibold text-ink-soft">Quantity</label>
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={() => adjustQuantity(-1)}
      disabled={quantityValue <= 1}
      className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg border border-border bg-surface-2 text-[16px] font-bold text-ink-soft disabled:opacity-40"
      aria-label="Decrease quantity"
    >
      −
    </button>
    <input
      type="number"
      inputMode="numeric"
      min={1}
      value={quantityText}
      onChange={(e) => setQuantityText(e.target.value)}
      onBlur={() => setQuantityText(String(quantityValue))}
      className="field-input text-center"
    />
    <button
      type="button"
      onClick={() => adjustQuantity(1)}
      className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg border border-border bg-surface-2 text-[16px] font-bold text-ink-soft"
      aria-label="Increase quantity"
    >
      +
    </button>
  </div>
</div>
          </div>

          <div className="mb-3.5">
            <label className="mb-1.5 block text-[12px] font-semibold text-ink-soft">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              list="locList"
              placeholder="e.g. Garage — Shelf 2"
              className="field-input"
            />
            <datalist id="locList">
              {locations.map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
          </div>

          <div className="mb-3.5">
            <label className="mb-1.5 block text-[12px] font-semibold text-ink-soft">Status</label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {STATUSES.map((s) => {
                const chosen = status === s.key;
                return (
                  <button
                    type="button"
                    key={s.key}
                    onClick={() => setStatus(s.key)}
                    className={`rounded-lg border-[1.5px] py-2.5 text-center text-[12.5px] font-bold uppercase tracking-wide ${
                      chosen ? `${s.badgeBg} ${s.badgeText}` : "border-border bg-surface-2 text-ink-soft"
                    }`}
                    style={chosen ? { borderColor: s.dot } : undefined}
                  >
                    {s.key}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-1">
            <label className="mb-1.5 block text-[12px] font-semibold text-ink-soft">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Brand, model, condition, borrowed by…"
              className="field-textarea"
            />
          </div>

          <div className="mt-4 flex gap-2.5">
            <button onClick={onClose} className="btn-ghost flex-1" disabled={pending}>
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary flex-1 disabled:opacity-70" disabled={pending}>
              {pending ? "Saving…" : editing ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
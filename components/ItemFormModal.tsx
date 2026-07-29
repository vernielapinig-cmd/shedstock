"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { addItem, updateItem, type ItemInput } from "@/actions/items";
import type { Item } from "@/types/database";

type ItemFormState = Omit<ItemInput, "quantity_new" | "quantity_refurbished"> & {
  quantity_new: string;
  quantity_refurbished: string;
}

export function ItemFormModal({
  item,
  locations,
  onClose,
}: {
  item: Item | null;
  locations: string[];
  onClose: () => void;
}) {
  const [form, setForm] = useState<ItemFormState>({
    name: item?.name ?? "",
    category: item?.category ?? "",
    quantity_new: item?.quantity_new?.toString() ?? "",
    quantity_refurbished: item?.quantity_refurbished?.toString() ?? "",
    location: item?.location ?? "",
    notes: item?.notes ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const payload:ItemInput = {
      ...form,
      quantity_new: Number(form.quantity_new) || 0,
      quantity_refurbished: Number(form.quantity_refurbished) || 0,
    }
    try {
      if (item) {
        await updateItem(item.id, payload);
      } else {
        await addItem(payload);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(15,20,18,0.55)] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-[14px] bg-surface shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
        <div className="sticky top-0 z-[2] flex items-center justify-between border-b border-border bg-surface px-[22px] py-[18px]">
          <h3 className="text-[16px] text-primary">
            {item ? "Edit Item" : "Add Item"}
          </h3>
          <button
            onClick={onClose}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-surface-2 text-ink-soft"
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3.5 px-[22px] pb-[22px] pt-5"
        >
          {error && (
            <div className="rounded-lg bg-rust-bg px-3 py-2 text-[13px] text-rust">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-[12px] font-semibold text-ink-soft">
              Name
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-[9px] border border-border bg-surface px-3 py-2.5 text-[14px] text-ink outline-none"
              placeholder="e.g. Cordless Drill"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-ink-soft">
                Category
              </label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-[9px] border border-border bg-surface px-3 py-2.5 text-[14px] text-ink outline-none"
                placeholder="e.g. Power Tools"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-ink-soft">
                Location
              </label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                list="locations-list"
                className="w-full rounded-[9px] border border-border bg-surface px-3 py-2.5 text-[14px] text-ink"
                placeholder="e.g. Garage"
                required
              />
              <datalist id="locations-list">
                {locations.map((l) => (
                  <option key={l} value={l} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-teal">
                Brand New Qty
              </label>
              <input
                type="number"
                min={0}
                value={form.quantity_new}
                onChange={(e) =>
                  setForm({ ...form, quantity_new: e.target.value, })
                }
                className="w-full rounded-[9px] border border-border bg-surface px-3 py-2.5 text-[14px] text-ink"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-amber">
                Refurbished Qty
              </label>
              <input
                type="number"
                min={0}
                value={form.quantity_refurbished}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantity_refurbished: e.target.value,
                  })
                }
                className="w-full rounded-[9px] border border-border bg-surface px-3 py-2.5 text-[14px] text-ink"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-semibold text-ink-soft">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-[9px] border border-border bg-surface px-3 py-2.5 text-[14px] text-ink"
              rows={3}
            />
          </div>

          <div className="mt-1.5 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1"
            >
              {submitting ? "Saving…" : item ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useTransition } from "react";
import { Icon } from "@/components/icons";
import { useToast } from "@/components/ToastProvider";
import { deleteItem } from "@/actions/items";
import type { Item } from "@/types/database";

export function DeleteItemModal({ item, onClose }: { item: Item; onClose: () => void }) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteItem(item.id);
      toast("Item removed");
      onClose();
    });
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(15,20,18,0.55)] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[400px] rounded-[14px] bg-surface text-center shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
        <div className="px-[22px] pb-[22px] pt-[26px]">
          <div className="mb-2.5 flex justify-center text-rust">
            <Icon name="alert" size={30} />
          </div>
          <h3 className="text-[16px] text-primary">Remove &ldquo;{item.name}&rdquo;?</h3>
          <p className="mt-2 text-[13px] text-ink-soft">
            This removes it from your registry. This can&apos;t be undone, but the action will stay in your history
            log.
          </p>
          <div className="mt-4 flex gap-2.5">
            <button onClick={onClose} className="btn-ghost flex-1" disabled={pending}>
              Cancel
            </button>
            <button onClick={handleDelete} className="btn-danger flex-1 disabled:opacity-70" disabled={pending}>
              {pending ? "Removing…" : "Delete Item"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

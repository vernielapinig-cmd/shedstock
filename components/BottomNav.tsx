"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";

const ITEMS = [
  { key: "dashboard", href: "/dashboard", label: "Home", icon: "grid" as const },
  { key: "inventory", href: "/inventory", label: "Items", icon: "box" as const },
  { key: "add", href: "/inventory?add=1", label: "", icon: "plus" as const },
  { key: "locations", href: "/locations", label: "Places", icon: "pin" as const },
  { key: "history", href: "/history", label: "Log", icon: "history" as const },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-surface px-1 pb-[calc(6px+env(safe-area-inset-bottom))] pt-1.5 md:hidden">
      <div className="flex justify-around">
        {ITEMS.map((item) => {
          if (item.key === "add") {
            return (
              <Link key={item.key} href={item.href} className="flex flex-col items-center gap-0.5 px-2.5 py-1.5">
                <span className="-mt-4 flex h-[38px] w-[38px] items-center justify-center rounded-full bg-accent text-accent-ink shadow-[0_4px_10px_rgba(228,160,59,0.5)]">
                  <Icon name="plus" size={18} />
                </span>
              </Link>
            );
          }
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide ${
                active ? "text-primary" : "text-ink-faint"
              }`}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

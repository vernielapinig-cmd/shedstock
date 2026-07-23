"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";
import { logout } from "@/actions/auth";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/inventory": "Inventory",
  "/locations": "Locations",
  "/history": "History",
};

export function TopBar() {
  const pathname = usePathname();
  const title = Object.entries(TITLES).find(([href]) => pathname.startsWith(href))?.[1] || "ShedStock";

  return (
    <div className="sticky top-0 z-20 flex items-center justify-between bg-primary px-4 py-3.5 text-white md:hidden">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 -rotate-[4deg] items-center justify-center rounded-md bg-accent text-accent-ink">
          <Icon name="wrench" size={15} />
        </div>
        <h1 className="text-[15px] normal-case text-white">{title}</h1>
      </div>
      <form action={logout}>
        <button
          type="submit"
          className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-white/[0.08] text-white"
          aria-label="Log out"
        >
          <Icon name="logout" size={16} />
        </button>
      </form>
    </div>
  );
}

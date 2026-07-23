"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { Icon } from "@/components/icons";
import { logout } from "@/actions/auth";

export function Sidebar({ fullName }: { fullName: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[230px] flex-shrink-0 flex-col bg-primary p-3.5 text-white md:flex">
      <div className="flex items-center gap-2.5 px-2 pb-[22px] pt-1.5">
        <div className="flex h-8 w-8 -rotate-[4deg] items-center justify-center rounded-[7px] bg-accent text-accent-ink">
          <Icon name="wrench" size={16} />
        </div>
        <h1 className="text-[16px] normal-case text-white">ShedStock</h1>
      </div>

      <nav className="flex-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`mb-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-semibold uppercase tracking-wide ${
                active ? "bg-accent text-accent-ink" : "text-[#C9D3D0] hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/[0.12] pt-3.5">
        <div className="mb-2 flex items-center gap-2.5 px-2 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-2 text-[13px] font-bold text-white">
            {fullName.trim().slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="text-[13px] font-semibold normal-case text-white">{fullName}</div>
            <div className="text-[11px] normal-case text-[#9FADA9]">Household member</div>
          </div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg bg-white/[0.06] px-2.5 py-2.5 text-[12px] font-semibold text-white"
          >
            <Icon name="logout" size={15} />
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}

import type { ItemStatus } from "@/types/database";

export const CATEGORIES = [
  "Power Tools",
  "Hand Tools",
  "Garden & Outdoor",
  "Electrical",
  "Plumbing",
  "Automotive",
  "Safety Equipment",
  "Measuring Tools",
  "Painting & Finishing",
  "Other",
] as const;

export interface StatusMeta {
  key: ItemStatus;
  cls: "available" | "inuse" | "repair" | "missing";
  dot: string;
  badgeBg: string;
  badgeText: string;
}

export const STATUSES: StatusMeta[] = [
  { key: "Available", cls: "available", dot: "#3F7C6E", badgeBg: "bg-teal-bg", badgeText: "text-teal" },
  { key: "In Use", cls: "inuse", dot: "#C4791E", badgeBg: "bg-amber-bg", badgeText: "text-amber" },
  { key: "Under Repair", cls: "repair", dot: "#4C6C8A", badgeBg: "bg-slate-bg", badgeText: "text-slate" },
  { key: "Missing", cls: "missing", dot: "#B33F35", badgeBg: "bg-rust-bg", badgeText: "text-rust" },
];

export function statusInfo(status: string): StatusMeta {
  return STATUSES.find((s) => s.key === status) ?? STATUSES[0];
}

export const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: "grid" as const },
  { key: "inventory", label: "Inventory", href: "/inventory", icon: "box" as const },
  { key: "locations", label: "Locations", href: "/locations", icon: "pin" as const },
  { key: "history", label: "History", href: "/history", icon: "history" as const },
];

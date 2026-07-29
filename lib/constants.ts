export interface ConditionMeta {
  key: "New" | "Refurbished";
  label: string;
  dot: string;
  badgeBg: string;
  badgeText: string;
}
export const CONDITIONS: ConditionMeta[] = [
  { key: "New", label: "Brand New", dot: "#3F7C6E", badgeBg: "bg-teal-bg", badgeText: "text-teal" },
  { key: "Refurbished", label: "Refurbished", dot: "#C4791E", badgeBg: "bg-amber-bg", badgeText: "text-amber" },
];

export const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: "grid" as const },
  { key: "inventory", label: "Inventory", href: "/inventory", icon: "box" as const },
  { key: "locations", label: "Locations", href: "/locations", icon: "pin" as const },
  { key: "history", label: "History", href: "/history", icon: "history" as const },
];
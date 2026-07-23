import { getItems, getHistory } from "@/lib/data";
import { InventoryClient } from "./InventoryClient";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: { add?: string; location?: string };
}) {
  const [items, history] = await Promise.all([getItems(), getHistory()]);

  return (
    <InventoryClient
      items={items}
      history={history}
      initialLocation={searchParams.location || ""}
      autoOpenAdd={searchParams.add === "1"}
    />
  );
}

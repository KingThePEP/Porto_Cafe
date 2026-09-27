import type { OrderStatus } from "@/lib/data/admin";
import { orderStatusMeta } from "@/lib/admin/order-status";
import { cn } from "@/lib/utils";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const meta = orderStatusMeta[status];

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.1em]",
        meta.className,
      )}
    >
      {meta.label}
    </span>
  );
}

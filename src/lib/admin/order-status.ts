export const ORDER_STATUSES = ["pending", "process", "done", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const orderStatusMeta: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "Menunggu", className: "bg-[#fdf1dd] text-[#8a5b12] border-[#f0d5a6]" },
  process: { label: "Diproses", className: "bg-[#e8f0fb] text-[#2a5599] border-[#bcd4f2]" },
  done: { label: "Selesai", className: "bg-[#eef7f0] text-[#2f6b41] border-[#b7d7c1]" },
  cancelled: { label: "Batal", className: "bg-[#fdeee9] text-[#a4462f] border-[#e2b7a8]" },
};

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

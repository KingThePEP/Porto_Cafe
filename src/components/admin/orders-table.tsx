"use client";

import { useState } from "react";
import { ChevronDown, Loader2, Trash2 } from "lucide-react";
import { deleteOrderAction, updateOrderStatusAction } from "@/lib/admin/actions/orders";
import { formatPrice } from "@/lib/menu-data";
import { siteConfig } from "@/lib/site-config";
import type { AdminOrder } from "@/lib/data/admin";
import { orderStatusMeta } from "@/lib/admin/order-status";
import { ActionFeedback } from "@/components/admin/action-feedback";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { useAdminAction } from "@/components/admin/use-admin-action";
import { adminCard, adminDangerButton } from "@/components/admin/ui";
import { formatDateTime } from "@/lib/utils";

export function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  const { run, isPending, feedback } = useAdminAction();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <ActionFeedback feedback={feedback} />

      {orders.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-[#d8c9b8] bg-[#fdfaf6] px-6 py-10 text-center text-sm text-[#7d5c4d]">
          Belum ada pesanan pada filter ini.
        </p>
      ) : (
        orders.map((order) => {
          const isOpen = expanded === order.id;
          const waLink = `${siteConfig.whatsapp.link}?text=${encodeURIComponent(
            `Halo ${order.customerName}, kami sudah menerima pesanan Gatchu Coffee (${formatPrice(order.total)}).`,
          )}`;

          return (
            <article key={order.id} className={adminCard}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-black tracking-[-0.02em] text-[#241c18]">
                      {order.customerName}
                    </h2>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="mt-1 text-xs text-[#7d5c4d]">
                    {formatDateTime(order.createdAt)} ·{" "}
                    {order.orderType === "pickup" ? "Takeaway" : "Delivery"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-black tracking-[-0.04em] text-[#a24931]">
                    {formatPrice(order.total)}
                  </p>
                  <p className="text-xs text-[#7d5c4d]">{order.items.length} item</p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#fdfaf6] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7d5c4d]">Kontak</p>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block text-sm font-semibold text-[#30251f] hover:text-[#a24931]"
                  >
                    {order.customerPhone}
                  </a>
                  {order.address ? (
                    <p className="mt-1 text-xs leading-relaxed text-[#6d5b50]">{order.address}</p>
                  ) : null}
                </div>

                <div className="rounded-2xl bg-[#fdfaf6] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7d5c4d]">
                    Catatan pelanggan
                  </p>
                  <p className="mt-1 text-sm text-[#6d5b50]">{order.notes?.trim() || "-"}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : order.id)}
                aria-expanded={isOpen}
                className="mt-4 inline-flex items-center text-xs font-bold uppercase tracking-[0.12em] text-[#a24931] hover:underline"
              >
                {isOpen ? "Sembunyikan" : "Lihat"} detail item
                <ChevronDown className={`ml-1 h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>

              {isOpen ? (
                <ul className="mt-3 divide-y divide-[#f0e6db] rounded-2xl border border-[#f0e6db]">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                      <span className="text-[#30251f]">
                        {item.productName} <span className="text-[#7d5c4d]">x{item.qty}</span>
                      </span>
                      <span className="whitespace-nowrap font-semibold text-[#4d3d33]">
                        {formatPrice(item.subtotal)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#f0e6db] pt-4">
                <label htmlFor={`status-${order.id}`} className="text-xs font-bold uppercase tracking-[0.14em] text-[#7d5c4d]">
                  Ubah status
                </label>
                <select
                  id={`status-${order.id}`}
                  value={order.status}
                  disabled={isPending}
                  onChange={(event) => {
                    const status = event.target.value;
                    void run(() => updateOrderStatusAction({ orderId: order.id, status }));
                  }}
                  className="rounded-full border border-[#d8c9b8] bg-white px-4 py-2 text-xs font-semibold text-[#30251f] outline-none focus:border-[#a24931] disabled:opacity-60"
                >
                  {Object.entries(orderStatusMeta).map(([value, meta]) => (
                    <option key={value} value={value}>
                      {meta.label}
                    </option>
                  ))}
                </select>

                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[#7d5c4d]" aria-hidden="true" />
                ) : null}
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    if (window.confirm("Hapus pesanan ini beserta detail itemnya?")) {
                      void run(() => deleteOrderAction(order.id));
                    }
                  }}
                  className={`${adminDangerButton} ml-auto`}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                  Hapus
                </button>
              </div>
            </article>
          );
        })
      )}
    </div>
  );
}

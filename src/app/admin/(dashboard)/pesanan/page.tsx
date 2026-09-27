import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { OrdersTable } from "@/components/admin/orders-table";
import { getOrders, type OrderStatus } from "@/lib/data/admin";
import { isOrderStatus, orderStatusMeta, ORDER_STATUSES } from "@/lib/admin/order-status";
import { requireAdmin } from "@/lib/supabase/admin";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  await requireAdmin();

  const status = searchParams.status && isOrderStatus(searchParams.status) ? (searchParams.status as OrderStatus) : undefined;
  const orders = await getOrders(status);

  return (
    <>
      <AdminPageHeader
        title="Pesanan"
        description="Ubah status pesanan dari menunggu ke diproses, selesai, atau batal."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/pesanan"
          className={cn(
            "rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors",
            !status
              ? "border-[#241c18] bg-[#241c18] text-white"
              : "border-[#d8c9b8] bg-white text-[#6d5b50] hover:border-[#c9674b]",
          )}
        >
          Semua
        </Link>
        {ORDER_STATUSES.map((value) => (
          <Link
            key={value}
            href={`/admin/pesanan?status=${value}`}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors",
              status === value
                ? "border-[#241c18] bg-[#241c18] text-white"
                : "border-[#d8c9b8] bg-white text-[#6d5b50] hover:border-[#c9674b]",
            )}
          >
            {orderStatusMeta[value].label}
          </Link>
        ))}
      </div>

      <OrdersTable orders={orders} />
    </>
  );
}

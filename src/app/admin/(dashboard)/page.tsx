import Link from "next/link";
import { ArrowUpRight, Coffee, Images, Mail, Newspaper, Receipt } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { getDashboardStats } from "@/lib/data/admin";
import { formatPrice } from "@/lib/menu-data";
import { isAdminConfigured } from "@/lib/supabase/admin";
import { adminCard, adminEmptyState, adminTableCell, adminTableHead } from "@/components/admin/ui";
import { formatDateTime } from "@/lib/utils";

const quickLinks = [
  { href: "/admin/pesanan", label: "Kelola pesanan", icon: Receipt },
  { href: "/admin/menu", label: "Kelola menu", icon: Coffee },
  { href: "/admin/artikel", label: "Tulis artikel", icon: Newspaper },
  { href: "/admin/pesan", label: "Baca pesan", icon: Mail },
  { href: "/admin/galeri", label: "Unggah galeri", icon: Images },
];

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  if (!isAdminConfigured()) {
    return (
      <>
        <AdminPageHeader title="Ringkasan" description="Pantau pesanan, menu, dan konten Gatchu Coffee." />
        <div className={adminEmptyState}>
          <p className="font-semibold text-[#6d5b50]">Supabase belum dikonfigurasi</p>
          <p className="mt-2">
            Isi <code>NEXT_PUBLIC_SUPABASE_URL</code> dan <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> di{" "}
            <code>.env.local</code>, lalu jalankan ulang <code>npm run dev</code>.
          </p>
        </div>
      </>
    );
  }

  const stats = await getDashboardStats();

  const cards = [
    { label: "Pesanan menunggu", value: stats.pendingOrders, icon: Receipt },
    { label: "Total pesanan", value: stats.totalOrders, icon: Receipt },
    { label: "Nilai pesanan aktif", value: formatPrice(stats.revenue), icon: Coffee },
    { label: "Pesan belum dibaca", value: stats.unreadMessages, icon: Mail },
    { label: "Produk", value: stats.products, icon: Coffee },
    { label: "Artikel", value: stats.posts, icon: Newspaper },
    { label: "Kategori", value: stats.categories, icon: Coffee },
    { label: "Foto galeri", value: stats.gallery, icon: Images },
  ];

  return (
    <>
      <AdminPageHeader
        title="Ringkasan"
        description="Pantau pesanan masuk, konten, dan aktivitas kedai dalam satu halaman."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.label} className={adminCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#a27b68]">
                  {card.label}
                </span>
                <Icon className="h-4 w-4 text-[#c9b6a5]" aria-hidden="true" />
              </div>
              <p className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#241c18]">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className={adminCard}>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-black tracking-[-0.02em] text-[#241c18]">Pesanan terbaru</h2>
            <Link
              href="/admin/pesanan"
              className="inline-flex items-center text-xs font-bold uppercase tracking-[0.12em] text-[#c9674b] hover:underline"
            >
              Semua pesanan
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className={`mt-4 ${adminEmptyState}`}>Belum ada pesanan masuk.</p>
          ) : (
            <div className="mt-4 -mx-2 overflow-x-auto">
              <table className="w-full min-w-[32rem]">
                <thead>
                  <tr>
                    <th className={adminTableHead}>Pelanggan</th>
                    <th className={adminTableHead}>Waktu</th>
                    <th className={adminTableHead}>Total</th>
                    <th className={adminTableHead}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="border-t border-[#f0e6db]">
                      <td className={adminTableCell}>
                        <span className="block font-semibold text-[#30251f]">{order.customerName}</span>
                        <span className="block text-xs text-[#a27b68]">{order.customerPhone}</span>
                      </td>
                      <td className={`${adminTableCell} whitespace-nowrap text-xs`}>
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className={`${adminTableCell} whitespace-nowrap font-semibold`}>
                        {formatPrice(order.total)}
                      </td>
                      <td className={adminTableCell}>
                        <OrderStatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className={adminCard}>
          <h2 className="text-lg font-black tracking-[-0.02em] text-[#241c18]">Aksi cepat</h2>
          <div className="mt-4 flex flex-col gap-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-2xl border border-[#eee1d3] px-4 py-3 text-sm font-semibold text-[#4d3d33] transition-colors hover:border-[#c9674b] hover:text-[#c9674b]"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {link.label}
                  <ArrowUpRight className="ml-auto h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

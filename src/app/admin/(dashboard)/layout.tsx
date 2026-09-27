import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdmin } from "@/lib/supabase/admin";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  const email = user.email ?? "admin";

  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-[#e3d6c7] bg-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <AdminSidebar email={email} />
      </aside>
      <main className="px-4 py-8 sm:px-8 lg:px-10">{children}</main>
    </div>
  );
}

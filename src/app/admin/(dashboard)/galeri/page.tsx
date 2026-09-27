import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { getGallery } from "@/lib/data/admin";
import { requireAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  await requireAdmin();
  const items = await getGallery();

  return (
    <>
      <AdminPageHeader
        title="Galeri"
        description="Kelola foto outlet, produk, dan suasana kedai yang tampil di halaman /galeri."
      />
      <GalleryManager items={items} />
    </>
  );
}

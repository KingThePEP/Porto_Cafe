import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CategoryManager } from "@/components/admin/category-manager";
import { ProductManager } from "@/components/admin/product-manager";
import { getCategories, getProducts } from "@/lib/data/admin";
import { requireAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  await requireAdmin();

  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <>
      <AdminPageHeader
        title="Menu & Produk"
        description="Kelola kategori, harga per ukuran, gambar, dan ketersediaan menu."
      />

      <div className="space-y-6">
        <CategoryManager categories={categories} />
        <ProductManager products={products} categories={categories} />
      </div>
    </>
  );
}

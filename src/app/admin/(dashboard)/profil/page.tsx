import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BrandProfileForm } from "@/components/admin/brand-profile-form";
import { getBrandProfile } from "@/lib/data/admin";
import { requireAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminBrandPage() {
  await requireAdmin();
  const profile = await getBrandProfile();

  return (
    <>
      <AdminPageHeader
        title="Profil Brand"
        description="Perbarui nama, tagline, alamat, jam buka, dan tautan sosial brand."
      />
      <BrandProfileForm profile={profile} />
    </>
  );
}

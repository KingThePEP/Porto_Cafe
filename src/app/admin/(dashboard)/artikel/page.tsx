import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PostManager } from "@/components/admin/post-manager";
import { getPosts } from "@/lib/data/admin";
import { requireAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  await requireAdmin();
  const posts = await getPosts();

  return (
    <>
      <AdminPageHeader
        title="Artikel"
        description="Tulis, ubah, dan publikasikan artikel yang tampil di halaman /blog."
      />
      <PostManager posts={posts} />
    </>
  );
}

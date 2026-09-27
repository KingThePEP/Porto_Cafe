import { redirect } from "next/navigation";
import { Coffee } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { getCurrentUser } from "@/lib/supabase/admin";
import { isAdminUser } from "@/lib/supabase/auth-utils";
import { siteConfig } from "@/lib/site-config";

const errorMessages: Record<string, string> = {
  forbidden: "Akun yang dipakai bukan akun admin.",
  "not-configured":
    "Supabase belum dikonfigurasi. Isi variabel lingkungan di .env.local lalu jal ulang server.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string };
}) {
  const user = await getCurrentUser();

  if (user && isAdminUser(user)) {
    redirect(searchParams.next?.startsWith("/admin") ? searchParams.next : "/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-[#e3d6c7] bg-white p-8 shadow-[0_24px_70px_rgba(71,48,35,0.12)]">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#241c18] text-white">
          <Coffee className="h-5 w-5" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-2xl font-black tracking-[-0.04em] text-[#241c18]">
          Dashboard {siteConfig.name}
        </h1>
        <p className="mt-2 text-sm text-[#6d5b50]">
          Masuk untuk mengelola menu, pesanan, artikel, dan pesan pelanggan.
        </p>

        <LoginForm next={searchParams.next} initialError={searchParams.error ? errorMessages[searchParams.error] : undefined} />

        <p className="mt-6 rounded-2xl bg-[#f7f1ea] px-4 py-3 text-xs leading-relaxed text-[#6d5b50]">
          Akun admin dibuat di Supabase Dashboard, lalu peran <code>admin</code> diisi pada{" "}
          <code>app_metadata</code> user agar bisa mengakses dashboard ini.
        </p>
      </div>
    </div>
  );
}

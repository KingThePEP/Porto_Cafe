"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import {
  Coffee,
  ExternalLink,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  Newspaper,
  Receipt,
  Settings2,
} from "lucide-react";
import { signOutAction } from "@/lib/admin/actions/auth";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

const navItems = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/admin/pesanan", label: "Pesanan", icon: Receipt },
  { href: "/admin/menu", label: "Menu & Produk", icon: Coffee },
  { href: "/admin/artikel", label: "Artikel", icon: Newspaper },
  { href: "/admin/pesan", label: "Pesan & Reservasi", icon: Mail },
  { href: "/admin/galeri", label: "Galeri", icon: Images },
  { href: "/admin/profil", label: "Profil Brand", icon: Settings2 },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex h-full flex-col gap-6 px-4 py-6">
      <Link href="/admin" className="flex items-center gap-3 px-2">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#241c18] text-sm font-black tracking-tight text-white">
          GC
        </span>
        <span>
          <span className="block text-sm font-black uppercase tracking-[0.18em] text-[#241c18]">
            {siteConfig.shortName}
          </span>
          <span className="block text-xs text-[#a27b68]">Admin dashboard</span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-[#241c18] text-white"
                  : "text-[#6d5b50] hover:bg-[#f0e6db] hover:text-[#241c18]",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-2 border-t border-[#e3d6c7] pt-4">
        <p className="truncate px-4 text-xs text-[#a27b68]">{email}</p>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#6d5b50] transition-colors hover:bg-[#f0e6db] hover:text-[#241c18]"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Lihat situs
        </a>
        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => void signOutAction())}
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#a4462f] transition-colors hover:bg-[#fdeee9] disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          {isPending ? "Keluar..." : "Keluar"}
        </button>
      </div>
    </div>
  );
}

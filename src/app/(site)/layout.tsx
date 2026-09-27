import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#konten-utama" className="skip-link">
        Lompat ke konten utama
      </a>
      <SiteHeader />
      <div id="konten-utama" tabIndex={-1} className="focus:outline-none">
        {children}
      </div>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from "next";
import { BlogBrowser } from "@/components/blog-browser";
import { getPostTags, getPublishedPosts } from "@/lib/data/blog";
import { JsonLd } from "@/components/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Journal",
  description: `Catatan kopi, cerita kedai, dan kabar terbaru dari ${siteConfig.name}.`,
  alternates: {
    canonical: "/blog",
  },
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const [posts, tags] = await Promise.all([getPublishedPosts(), getPostTags()]);

  return (
    <>
    <JsonLd data={buildBreadcrumbJsonLd([{"name": "Beranda", "path": "/"}, {"name": "Blog", "path": "/blog"}])} />
    <main className="pt-32 sm:pt-36">
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <p className="animate-fade-up flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#a27b68]">
          <span className="h-px w-8 bg-[#c9674b]" />
          Journal
        </p>
        <h1 className="animate-fade-up delay-1 mt-5 max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-[-0.06em] text-[#241c18] sm:text-6xl">
          Cerita di balik <span className="text-[#c9674b]">cangkir kopi.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[#6d5b50]">
          Catatan tentang kopi, proses di bar, dan kabar terbaru dari Gatchu.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">
        <BlogBrowser posts={posts} tags={tags} />
      </section>
    </main>
    </>
  );
}

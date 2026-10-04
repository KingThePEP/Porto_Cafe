import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { MarkdownContent } from "@/components/markdown-content";
import { getPublishedPost, getPublishedPosts } from "@/lib/data/blog";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";
import { formatDate } from "@/lib/utils";

type PostParams = { slug: string };

export async function generateStaticParams(): Promise<PostParams[]> {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: PostParams }): Promise<Metadata> {
  const post = await getPublishedPost(params.slug);

  if (!post) {
    return { title: "Artikel tidak ditemukan" };
  }

  return {
    title: post.title,
    description: post.excerpt || siteConfig.description,
    keywords: post.tags,
    authors: [{ name: siteConfig.name }],
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      locale: "id_ID",
      url: `/blog/${post.slug}`,
      siteName: siteConfig.name,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      images: post.coverImage
        ? [{ url: post.coverImage, alt: post.title }]
        : [{ url: siteConfig.menuBoard, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage ?? siteConfig.menuBoard],
    },
  };
}

export const dynamicParams = true;
export const revalidate = 300;

export default async function BlogDetailPage({ params }: { params: PostParams }) {
  const post = await getPublishedPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="pt-32 sm:pt-36">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Beranda", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          image: post.coverImage ? [post.coverImage] : undefined,
          datePublished: post.createdAt,
          dateModified: post.updatedAt,
          keywords: post.tags.join(", "),
          inLanguage: "id-ID",
          author: { "@type": "Organization", name: siteConfig.name },
          publisher: { "@type": "Organization", name: siteConfig.name },
          mainEntityOfPage: `/blog/${post.slug}`,
        }}
      />
      <article className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-xs font-bold uppercase tracking-[0.16em] text-[#7d5c4d] transition-colors hover:text-[#a24931]"
        >
          <ArrowLeft className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
          Semua artikel
        </Link>

        <header className="mt-6">
          {post.tags.length > 0 ? (
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a24931]">
              {post.tags.join(" · ")}
            </p>
          ) : null}
          <h1 className="animate-fade-up delay-1 mt-4 text-balance text-3xl font-semibold leading-tight tracking-[-0.05em] text-[#241c18] sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[#7d5c4d]">
            {formatDate(post.createdAt)} · {siteConfig.name}
          </p>
        </header>

        {post.coverImage ? (
          <div className="mt-8 overflow-hidden rounded-[2rem] border border-[#e2d5c7]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImage} alt="" className="h-64 w-full object-cover sm:h-96" />
          </div>
        ) : null}

        {post.excerpt ? (
          <p className="mt-8 border-l-2 border-[#a24931] pl-5 text-lg leading-8 text-[#6d5b50]">
            {post.excerpt}
          </p>
        ) : null}

        <div className="mt-10">
          <MarkdownContent content={post.content} />
        </div>
      </article>
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { PublicPostSummary } from "@/lib/data/blog";
import { cn } from "@/lib/utils";

export function BlogBrowser({
  posts,
  tags,
}: {
  posts: PublicPostSummary[];
  tags: { tag: string; count: number }[];
}) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesTag = !activeTag || post.tags.includes(activeTag);

      if (!normalized) {
        return matchesTag;
      }

      const haystack = `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase();
      return matchesTag && haystack.includes(normalized);
    });
  }, [posts, query, activeTag]);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a27b68]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari artikel, tag, atau topik..."
            aria-label="Cari artikel"
            className="w-full rounded-full border border-[#d8c9b8] bg-white py-3 pl-11 pr-4 text-sm text-[#30251f] outline-none transition-colors placeholder:text-[#a27b68] focus:border-[#c9674b]"
          />
        </div>

        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              aria-pressed={activeTag === null}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors",
                activeTag === null
                  ? "border-[#241c18] bg-[#241c18] text-white"
                  : "border-[#d8c9b8] bg-white text-[#6d5b50] hover:border-[#c9674b]",
              )}
            >
              Semua
            </button>
            {tags.map((tag) => (
              <button
                key={tag.tag}
                type="button"
                onClick={() => setActiveTag(activeTag === tag.tag ? null : tag.tag)}
                aria-pressed={activeTag === tag.tag}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors",
                  activeTag === tag.tag
                    ? "border-[#241c18] bg-[#241c18] text-white"
                    : "border-[#d8c9b8] bg-white text-[#6d5b50] hover:border-[#c9674b]",
                )}
              >
                {tag.tag} ({tag.count})
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-[2rem] border border-dashed border-[#d8c9b8] bg-[#fdfaf6] px-6 py-12 text-center text-sm text-[#a27b68]">
          Belum ada artikel yang cocok. Coba kata kunci lain atau lihat semua artikel.
        </p>
      ) : (
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <li key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#e2d5c7] bg-white transition-transform hover:-translate-y-1"
              >
                {post.coverImage ? (
                  <span className="block h-48 overflow-hidden bg-[#f2e6da]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.coverImage}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </span>
                ) : null}
                <span className="flex flex-1 flex-col p-6">
                  {post.tags.length > 0 ? (
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c9674b]">
                      {post.tags.join(" · ")}
                    </span>
                  ) : null}
                  <span className="mt-3 text-lg font-semibold leading-snug tracking-[-0.03em] text-[#241c18] group-hover:text-[#c9674b]">
                    {post.title}
                  </span>
                  <span className="mt-3 line-clamp-3 text-sm leading-7 text-[#6d5b50]">
                    {post.excerpt}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

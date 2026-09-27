import "server-only";

import { cache } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";

export type PublicPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type PublicPostSummary = Omit<PublicPost, "content">;

const POST_COLUMNS =
  "id, title, slug, excerpt, content, cover_image, tags, created_at, updated_at";

type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
};

function mapPost(row: PostRow): PublicPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image,
    tags: row.tags ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const getPublishedPosts = cache(async (): Promise<PublicPostSummary[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const client = createPublicClient();
  const { data } = await client
    .from("posts")
    .select(POST_COLUMNS)
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => {
    const { content, ...summary } = mapPost(row as PostRow);
    void content;
    return summary;
  });
});

export const getPublishedPost = cache(async (slug: string): Promise<PublicPost | null> => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const client = createPublicClient();
  const { data } = await client
    .from("posts")
    .select(POST_COLUMNS)
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();

  return data ? mapPost(data as PostRow) : null;
});

export const getPostTags = cache(async (): Promise<{ tag: string; count: number }[]> => {
  const posts = await getPublishedPosts();
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
});

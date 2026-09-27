import "server-only";

import { cache } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";

export type PublicGalleryItem = {
  id: string;
  imageUrl: string;
  caption: string | null;
};

export const getPublicGallery = cache(async (): Promise<PublicGalleryItem[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const client = createPublicClient();
  const { data } = await client
    .from("gallery")
    .select("id, image_url, caption")
    .order("created_at", { ascending: false })
    .limit(24);

  return (data ?? []).map((row) => ({
    id: row.id,
    imageUrl: row.image_url,
    caption: row.caption,
  }));
});

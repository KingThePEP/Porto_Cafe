import { cache } from "react";
import { menuGroups, slugifyMenuItem, type MenuGroup, type MenuItem } from "@/lib/menu-data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";

export { slugifyMenuItem };

export type MenuEntry = MenuItem & {
  slug: string;
  groupId: string;
  groupName: string;
  description?: string;
  isAvailable: boolean;
  signature: boolean;
  imageUrl: string | null;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string | null;
  sort_order: number;
  products: {
    name: string;
    slug: string | null;
    description: string | null;
    price: number | string;
    price_large: number | string | null;
    price_liter: number | string | null;
    note: string | null;
    is_available: boolean;
    is_signature: boolean;
    image_url: string | null;
  }[] | null;
};

function fromLocalData(): MenuGroup[] {
  return menuGroups;
}

function flatten(groups: MenuGroup[]): MenuEntry[] {
  return groups.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      slug: slugifyMenuItem(item.name),
      groupId: group.id,
      groupName: group.name,
      isAvailable: true,
      signature: group.id === "kopi-susu-gatchu",
      imageUrl: null,
    })),
  );
}

export const getMenuGroups = cache(async (): Promise<MenuGroup[]> => {
  if (!isSupabaseConfigured()) {
    return fromLocalData();
  }

  try {
    const client = createPublicClient();
    const { data, error } = await client
      .from("categories")
      .select(
        "id, name, slug, sort_order, products(name, slug, description, price, price_large, price_liter, note, is_available, is_signature, image_url)",
      )
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return fromLocalData();
    }

    const groups = (data as unknown as CategoryRow[]).map((category) => {
      const products = Array.isArray(category.products) ? category.products : [];
      const items: MenuItem[] = products.map((product) => ({
        name: product.name,
        regular: Number(product.price),
        large: product.price_large === null ? undefined : Number(product.price_large),
        liter: product.price_liter === null ? undefined : Number(product.price_liter),
        note: product.note ?? undefined,
      }));

      return {
        id: String(category.slug ?? category.id),
        name: category.name,
        description: products.length > 0 ? `${products.length} menu tersedia` : "Segera hadir",
        items,
      } satisfies MenuGroup;
    });

    return groups.some((group) => group.items.length > 0) ? groups : fromLocalData();
  } catch {
    return fromLocalData();
  }
});

export const getMenuEntries = cache(async (): Promise<MenuEntry[]> => flatten(await getMenuGroups()));

export const getMenuEntry = cache(async (slug: string): Promise<MenuEntry | null> => {
  const entries = await getMenuEntries();
  return entries.find((entry) => entry.slug === slug) ?? null;
});

export const getSignatureEntries = cache(async (): Promise<MenuEntry[]> => {
  const groups = await getMenuGroups();
  return flatten(groups).filter((entry) => entry.groupId === "kopi-susu-gatchu");
});

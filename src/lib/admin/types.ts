export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

export const actionOk = (message?: string): ActionResult => ({ ok: true, message });
export const actionError = (error: string): ActionResult => ({ ok: false, error });

export type Feedback = { tone: "success" | "error"; text: string } | null;

export const STORAGE_BUCKETS = {
  product: "product-images",
  gallery: "gallery",
  post: "post-covers",
} as const;

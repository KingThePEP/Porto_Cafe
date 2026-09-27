"use client";

import { useState } from "react";
import { Eye, EyeOff, Plus, Save, Trash2 } from "lucide-react";
import {
  deleteProductAction,
  saveProductAction,
  toggleProductAvailabilityAction,
} from "@/lib/admin/actions/catalog";
import type { AdminCategory, AdminProduct } from "@/lib/data/admin";
import { ActionFeedback } from "@/components/admin/action-feedback";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { useAdminAction } from "@/components/admin/use-admin-action";
import {
  adminCard,
  adminDangerButton,
  adminInput,
  adminLabel,
  adminSecondaryButton,
  adminTextarea,
} from "@/components/admin/ui";
import { formatPrice, slugifyMenuItem } from "@/lib/menu-data";
import { STORAGE_BUCKETS } from "@/lib/admin/types";

type ProductDraft = {
  id?: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  note: string;
  price: string;
  priceLarge: string;
  priceLiter: string;
  imageUrl: string;
  isAvailable: boolean;
  isSignature: boolean;
};

function emptyDraft(categoryId: string): ProductDraft {
  return {
    categoryId,
    name: "",
    slug: "",
    description: "",
    note: "",
    price: "",
    priceLarge: "",
    priceLiter: "",
    imageUrl: "",
    isAvailable: true,
    isSignature: false,
  };
}

function toDraft(product: AdminProduct): ProductDraft {
  return {
    id: product.id,
    categoryId: product.categoryId ?? "",
    name: product.name,
    slug: product.slug,
    description: product.description,
    note: "",
    price: String(product.price),
    priceLarge: product.priceLarge === null ? "" : String(product.priceLarge),
    priceLiter: product.priceLiter === null ? "" : String(product.priceLiter),
    imageUrl: product.imageUrl ?? "",
    isAvailable: product.isAvailable,
    isSignature: product.isSignature,
  };
}

function toNumber(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export function ProductManager({
  products,
  categories,
}: {
  products: AdminProduct[];
  categories: AdminCategory[];
}) {
  const { run, isPending, feedback } = useAdminAction();
  const [draft, setDraft] = useState<ProductDraft>(() => emptyDraft(categories[0]?.id ?? ""));
  const [isEditing, setIsEditing] = useState(false);

  function reset() {
    setDraft(emptyDraft(categories[0]?.id ?? ""));
    setIsEditing(false);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    void run(
      () =>
        saveProductAction({
          id: draft.id,
          categoryId: draft.categoryId,
          name: draft.name,
          slug: draft.slug,
          description: draft.description,
          note: draft.note,
          price: toNumber(draft.price) ?? 0,
          priceLarge: toNumber(draft.priceLarge),
          priceLiter: toNumber(draft.priceLiter),
          imageUrl: draft.imageUrl,
          isAvailable: draft.isAvailable,
          isSignature: draft.isSignature,
        }),
      { onSuccess: reset },
    );
  }

  return (
    <section className={adminCard}>
      <h2 className="text-lg font-black tracking-[-0.02em] text-[#241c18]">Menu & Produk</h2>
      <p className="mt-1 text-sm text-[#6d5b50]">
        Harga ukuran R wajib diisi. Isi L atau 1 Liter bila tersedia.
      </p>

      <ActionFeedback feedback={feedback} />

      <ul className="mt-5 divide-y divide-[#f0e6db] rounded-2xl border border-[#f0e6db]">
        {products.length === 0 ? (
          <li className="px-4 py-6 text-center text-sm text-[#a27b68]">
            Belum ada produk. Tambahkan lewat form di bawah.
          </li>
        ) : (
          products.map((product) => (
            <li key={product.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.imageUrl}
                  alt=""
                  className="h-10 w-10 rounded-xl border border-[#eee1d3] object-cover"
                />
              ) : null}
              <div className="min-w-0">
                <p className="truncate font-semibold text-[#30251f]">
                  {product.name}
                  {product.isSignature ? (
                    <span className="ml-2 rounded-full bg-[#fdeee9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#c9674b]">
                      Signature
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-[#a27b68]">
                  {formatPrice(product.price)}
                  {product.priceLarge ? ` · L ${formatPrice(product.priceLarge)}` : ""}
                  {product.priceLiter ? ` · 1L ${formatPrice(product.priceLiter)}` : ""}
                </p>
              </div>

              <div className="ml-auto flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    void run(() =>
                      toggleProductAvailabilityAction({
                        productId: product.id,
                        isAvailable: !product.isAvailable,
                      }),
                    )
                  }
                  className={adminSecondaryButton}
                >
                  {product.isAvailable ? (
                    <>
                      <EyeOff className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                      Sembunyikan
                    </>
                  ) : (
                    <>
                      <Eye className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                      Tampilkan
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(toDraft(product));
                    setIsEditing(true);
                  }}
                  className={adminSecondaryButton}
                >
                  Ubah
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    if (window.confirm(`Hapus produk "${product.name}"?`)) {
                      void run(() => deleteProductAction(product.id));
                    }
                  }}
                  className={adminDangerButton}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  Hapus
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="productName" className={adminLabel}>
              Nama menu
            </label>
            <input
              id="productName"
              required
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              placeholder="Kopi Susu Gatchu"
              className={`mt-2 ${adminInput}`}
            />
          </div>

          <div>
            <label htmlFor="productSlug" className={adminLabel}>
              Slug URL
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="productSlug"
                required
                value={draft.slug}
                onChange={(event) => setDraft({ ...draft, slug: event.target.value })}
                placeholder="kopi-susu-gatchu"
                className={adminInput}
              />
              <button
                type="button"
                onClick={() => setDraft({ ...draft, slug: slugifyMenuItem(draft.name) })}
                className={adminSecondaryButton}
              >
                Oto
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="productCategory" className={adminLabel}>
              Kategori
            </label>
            <select
              id="productCategory"
              required
              value={draft.categoryId}
              onChange={(event) => setDraft({ ...draft, categoryId: event.target.value })}
              className={`mt-2 ${adminInput}`}
            >
              <option value="">Pilih kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="productNote" className={adminLabel}>
              Catatan singkat (opsional)
            </label>
            <input
              id="productNote"
              value={draft.note}
              onChange={(event) => setDraft({ ...draft, note: event.target.value })}
              placeholder="Tersedia ukuran R"
              className={`mt-2 ${adminInput}`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="productDescription" className={adminLabel}>
            Deskripsi
          </label>
          <textarea
            id="productDescription"
            rows={3}
            value={draft.description}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            placeholder="Espresso dengan susu steamed yang lembut."
            className={`mt-2 ${adminTextarea}`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="productPrice" className={adminLabel}>
              Harga ukuran R
            </label>
            <input
              id="productPrice"
              required
              type="number"
              min={0}
              step={500}
              value={draft.price}
              onChange={(event) => setDraft({ ...draft, price: event.target.value })}
              placeholder="15000"
              className={`mt-2 ${adminInput}`}
            />
          </div>
          <div>
            <label htmlFor="productPriceLarge" className={adminLabel}>
              Harga ukuran L
            </label>
            <input
              id="productPriceLarge"
              type="number"
              min={0}
              step={500}
              value={draft.priceLarge}
              onChange={(event) => setDraft({ ...draft, priceLarge: event.target.value })}
              placeholder="20000"
              className={`mt-2 ${adminInput}`}
            />
          </div>
          <div>
            <label htmlFor="productPriceLiter" className={adminLabel}>
              Harga 1 liter
            </label>
            <input
              id="productPriceLiter"
              type="number"
              min={0}
              step={1000}
              value={draft.priceLiter}
              onChange={(event) => setDraft({ ...draft, priceLiter: event.target.value })}
              placeholder="60000"
              className={`mt-2 ${adminInput}`}
            />
          </div>
        </div>

        <ImageUploadField
          id="productImage"
          label="Gambar produk"
          bucket={STORAGE_BUCKETS.product}
          folder="products"
          value={draft.imageUrl}
          onChange={(url) => setDraft({ ...draft, imageUrl: url })}
        />

        <div className="flex flex-wrap gap-6">
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-[#4d3d33]">
            <input
              type="checkbox"
              checked={draft.isAvailable}
              onChange={(event) => setDraft({ ...draft, isAvailable: event.target.checked })}
              className="h-4 w-4 rounded border-[#d8c9b8] text-[#c9674b] focus:ring-[#c9674b]"
            />
            Tampilkan di halaman publik
          </label>
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-[#4d3d33]">
            <input
              type="checkbox"
              checked={draft.isSignature}
              onChange={(event) => setDraft({ ...draft, isSignature: event.target.checked })}
              className="h-4 w-4 rounded border-[#d8c9b8] text-[#c9674b] focus:ring-[#c9674b]"
            />
            Tandai sebagai menu signature
          </label>
        </div>

        <div className="flex items-center gap-2">
          <SubmitButton isPending={isPending}>
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                Simpan perubahan
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                Tambah produk
              </>
            )}
          </SubmitButton>
          {isEditing ? (
            <button type="button" onClick={reset} className={adminSecondaryButton}>
              Batal
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

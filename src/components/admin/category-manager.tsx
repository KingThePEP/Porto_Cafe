"use client";

import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import {
  deleteCategoryAction,
  saveCategoryAction,
} from "@/lib/admin/actions/catalog";
import type { AdminCategory } from "@/lib/data/admin";
import { ActionFeedback } from "@/components/admin/action-feedback";
import { SubmitButton } from "@/components/admin/submit-button";
import { useAdminAction } from "@/components/admin/use-admin-action";
import { adminCard, adminDangerButton, adminInput, adminLabel, adminSecondaryButton } from "@/components/admin/ui";
import { slugifyMenuItem } from "@/lib/menu-data";

type CategoryDraft = {
  id?: string;
  name: string;
  slug: string;
  sortOrder: number;
};

const emptyDraft: CategoryDraft = { name: "", slug: "", sortOrder: 0 };

export function CategoryManager({ categories }: { categories: AdminCategory[] }) {
  const { run, isPending, feedback } = useAdminAction();
  const [draft, setDraft] = useState<CategoryDraft>(emptyDraft);

  function editCategory(category: AdminCategory) {
    setDraft({
      id: category.id,
      name: category.name,
      slug: category.slug,
      sortOrder: category.sortOrder,
    });
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    void run(
      () =>
        saveCategoryAction({
          id: draft.id,
          name: draft.name,
          slug: draft.slug,
          sortOrder: draft.sortOrder,
        }),
      {
        onSuccess: () => setDraft(emptyDraft),
      },
    );
  }

  return (
    <section className={adminCard}>
      <h2 className="text-lg font-black tracking-[-0.02em] text-[#241c18]">Kategori</h2>
      <p className="mt-1 text-sm text-[#6d5b50]">
        Kategori mengelompokkan menu di halaman publik. Urutan menentukan urutan tampil.
      </p>

      <ActionFeedback feedback={feedback} />

      <ul className="mt-5 divide-y divide-[#f0e6db] rounded-2xl border border-[#f0e6db]">
        {categories.length === 0 ? (
          <li className="px-4 py-6 text-center text-sm text-[#a27b68]">Belum ada kategori.</li>
        ) : (
          categories.map((category) => (
            <li key={category.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <span className="font-semibold text-[#30251f]">{category.name}</span>
              <span className="text-xs text-[#a27b68]">
                /{category.slug} · {category.productCount} produk · urutan {category.sortOrder}
              </span>
              <div className="ml-auto flex gap-2">
                <button type="button" onClick={() => editCategory(category)} className={adminSecondaryButton}>
                  Ubah
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    if (window.confirm(`Hapus kategori "${category.name}"?`)) {
                      void run(() => deleteCategoryAction(category.id));
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

      <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="categoryName" className={adminLabel}>
            Nama kategori
          </label>
          <input
            id="categoryName"
            required
            value={draft.name}
            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            placeholder="Kopi Susu Gatchu"
            className={`mt-2 ${adminInput}`}
          />
        </div>

        <div>
          <label htmlFor="categorySlug" className={adminLabel}>
            Slug URL
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="categorySlug"
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
          <label htmlFor="categorySortOrder" className={adminLabel}>
            Urutan tampil
          </label>
          <input
            id="categorySortOrder"
            type="number"
            min={0}
            value={draft.sortOrder}
            onChange={(event) => setDraft({ ...draft, sortOrder: Number(event.target.value) })}
            className={`mt-2 ${adminInput}`}
          />
        </div>

        <div className="flex items-end gap-2">
          <SubmitButton isPending={isPending}>
            {draft.id ? (
              <>
                <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                Simpan perubahan
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                Tambah kategori
              </>
            )}
          </SubmitButton>
          {draft.id ? (
            <button type="button" onClick={() => setDraft(emptyDraft)} className={adminSecondaryButton}>
              Batal
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

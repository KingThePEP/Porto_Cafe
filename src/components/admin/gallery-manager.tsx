"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { deleteGalleryItemAction, saveGalleryItemAction } from "@/lib/admin/actions/gallery";
import type { AdminGalleryItem } from "@/lib/data/admin";
import { STORAGE_BUCKETS } from "@/lib/admin/types";
import { ActionFeedback } from "@/components/admin/action-feedback";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { useAdminAction } from "@/components/admin/use-admin-action";
import { adminCard, adminDangerButton, adminInput, adminLabel } from "@/components/admin/ui";
import { formatDateTime } from "@/lib/utils";

export function GalleryManager({ items }: { items: AdminGalleryItem[] }) {
  const { run, isPending, feedback } = useAdminAction();
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");

  function reset() {
    setImageUrl("");
    setCaption("");
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    void run(() => saveGalleryItemAction({ imageUrl, caption }), { onSuccess: reset });
  }

  return (
    <div className="space-y-6">
      <section className={adminCard}>
        <h2 className="text-lg font-black tracking-[-0.02em] text-[#241c18]">Unggah foto</h2>
        <p className="mt-1 text-sm text-[#6d5b50]">
          Foto galeri tampil di halaman /galeri. Maksimal 5 MB per file.
        </p>

        <ActionFeedback feedback={feedback} />

        <form onSubmit={submit} className="mt-5 space-y-4">
          <ImageUploadField
            id="galleryImage"
            label="Foto"
            bucket={STORAGE_BUCKETS.gallery}
            folder="gallery"
            value={imageUrl}
            onChange={setImageUrl}
          />

          <div>
            <label htmlFor="galleryCaption" className={adminLabel}>
              Keterangan (opsional)
            </label>
            <input
              id="galleryCaption"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              placeholder="Sudut bar di sore hari"
              className={`mt-2 ${adminInput}`}
            />
          </div>

          <SubmitButton isPending={isPending}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Simpan foto
          </SubmitButton>
        </form>
      </section>

      <section className={adminCard}>
        <h2 className="text-lg font-black tracking-[-0.02em] text-[#241c18]">Foto tersimpan</h2>

        {items.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-[#d8c9b8] bg-[#fdfaf6] px-6 py-8 text-center text-sm text-[#a27b68]">
            Belum ada foto galeri.
          </p>
        ) : (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.id} className="overflow-hidden rounded-2xl border border-[#eee1d3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.caption ?? "Foto galeri Gatchu Coffee"}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <p className="truncate text-sm font-semibold text-[#30251f]">
                    {item.caption ?? "Tanpa keterangan"}
                  </p>
                  <p className="mt-1 text-xs text-[#a27b68]">{formatDateTime(item.createdAt)}</p>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      if (window.confirm("Hapus foto ini dari galeri?")) {
                        void run(() => deleteGalleryItemAction(item.id));
                      }
                    }}
                    className={`${adminDangerButton} mt-3`}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

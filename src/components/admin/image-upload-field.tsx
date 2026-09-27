"use client";

import { useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { adminInput, adminLabel } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

type UploadResult = { ok: true; url: string } | { ok: false; error: string };

async function uploadToBucket(file: File, bucket: string, folder: string): Promise<UploadResult> {
  if (file.size === 0) {
    return { ok: false, error: "Pilih file gambar terlebih dahulu." };
  }

  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "File harus berupa gambar." };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { ok: false, error: "Ukuran gambar maksimal 5 MB." };
  }

  try {
    const supabase = createClient();
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

    const { error } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: "3600" });

    if (error) {
      return { ok: false, error: `Upload gagal: ${error.message}` };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return { ok: true, url: data.publicUrl };
  } catch {
    return { ok: false, error: "Supabase belum dikonfigurasi, gambar tidak bisa diunggah." };
  }
}

export function ImageUploadField({
  id,
  label,
  bucket,
  folder,
  value,
  onChange,
  previewClassName,
}: {
  id: string;
  label: string;
  bucket: string;
  folder: string;
  value: string;
  onChange: (url: string) => void;
  previewClassName?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setError(null);
    setIsUploading(true);

    const result = await uploadToBucket(file, bucket, folder);
    setIsUploading(false);

    if (result.ok) {
      onChange(result.url);
      return;
    }

    setError(result.error);
  }

  return (
    <div>
      <label htmlFor={id} className={adminLabel}>
        {label}
      </label>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        {value ? (
          <span
            className={cn(
              "h-16 w-16 overflow-hidden rounded-2xl border border-[#d8c9b8] bg-[#f7f1ea]",
              previewClassName,
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="h-full w-full object-cover" />
          </span>
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-[#d8c9b8] text-[#c9b6a5]">
            <ImagePlus className="h-5 w-5" aria-hidden="true" />
          </span>
        )}

        <label
          htmlFor={id}
          className="inline-flex cursor-pointer items-center rounded-full border border-[#d8c9b8] bg-white px-4 py-2 text-xs font-semibold text-[#30251f] transition-colors hover:border-[#c9674b] hover:text-[#c9674b]"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              Mengunggah...
            </>
          ) : value ? (
            "Ganti gambar"
          ) : (
            "Unggah gambar"
          )}
        </label>
        <input
          id={id}
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={isUploading}
          className="sr-only"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs font-semibold text-[#a4462f] underline underline-offset-4"
          >
            Hapus gambar
          </button>
        ) : null}
      </div>

      <input
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="https://... (bisa diisi manual)"
        className={cn(adminInput, "mt-3")}
        aria-label={`${label} URL`}
      />

      {error ? <p className="mt-2 text-xs text-[#a4462f]">{error}</p> : null}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { saveBrandProfileAction } from "@/lib/admin/actions/brand";
import type { BrandProfile } from "@/lib/data/admin";
import { STORAGE_BUCKETS } from "@/lib/admin/types";
import { ActionFeedback } from "@/components/admin/action-feedback";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { useAdminAction } from "@/components/admin/use-admin-action";
import { adminCard, adminInput, adminLabel, adminTextarea } from "@/components/admin/ui";
import { siteConfig } from "@/lib/site-config";

type BrandDraft = {
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  address: string;
  mapsUrl: string;
  instagram: string;
  tiktok: string;
  whatsapp: string;
  hours: string;
};

function readLink(links: Record<string, unknown>, key: string) {
  const value = links[key];
  return typeof value === "string" ? value : "";
}

function toDraft(profile: BrandProfile | null): BrandDraft {
  const links = profile?.socialLinks ?? {};

  return {
    name: profile?.name ?? siteConfig.name,
    tagline: profile?.tagline ?? siteConfig.tagline,
    description: profile?.description ?? siteConfig.description,
    logoUrl: profile?.logoUrl ?? "",
    address: profile?.address ?? siteConfig.address.full,
    mapsUrl: profile?.mapsUrl ?? siteConfig.mapsUrl,
    instagram: readLink(links, "instagram") || siteConfig.social.instagram,
    tiktok: readLink(links, "tiktok") || siteConfig.social.tiktok,
    whatsapp: readLink(links, "whatsapp") || siteConfig.whatsapp.link,
    hours: readLink(links, "hours") || siteConfig.hours.label,
  };
}

export function BrandProfileForm({ profile }: { profile: BrandProfile | null }) {
  const { run, isPending, feedback } = useAdminAction();
  const [draft, setDraft] = useState<BrandDraft>(() => toDraft(profile));

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(() => saveBrandProfileAction(draft));
  }

  return (
    <form onSubmit={submit} className={`space-y-6 ${adminCard}`}>
      <div>
        <h2 className="text-lg font-black tracking-[-0.02em] text-[#241c18]">Profil brand</h2>
        <p className="mt-1 text-sm text-[#6d5b50]">
          Data ini dipakai halaman About, footer, dan metadata SEO. Nilai bawaan diambil dari file
          konfigurasi situs bila brand profile kosong di database.
        </p>
      </div>

      <ActionFeedback feedback={feedback} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="brandName" className={adminLabel}>
            Nama brand
          </label>
          <input
            id="brandName"
            required
            value={draft.name}
            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            className={`mt-2 ${adminInput}`}
          />
        </div>

        <div>
          <label htmlFor="brandTagline" className={adminLabel}>
            Tagline
          </label>
          <input
            id="brandTagline"
            required
            value={draft.tagline}
            onChange={(event) => setDraft({ ...draft, tagline: event.target.value })}
            className={`mt-2 ${adminInput}`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="brandDescription" className={adminLabel}>
          Deskripsi brand
        </label>
        <textarea
          id="brandDescription"
          rows={4}
          required
          value={draft.description}
          onChange={(event) => setDraft({ ...draft, description: event.target.value })}
          className={`mt-2 ${adminTextarea}`}
        />
      </div>

      <div>
        <label htmlFor="brandAddress" className={adminLabel}>
          Alamat outlet
        </label>
        <textarea
          id="brandAddress"
          rows={2}
          required
          value={draft.address}
          onChange={(event) => setDraft({ ...draft, address: event.target.value })}
          className={`mt-2 ${adminTextarea}`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="brandMapsUrl" className={adminLabel}>
            Link Google Maps
          </label>
          <input
            id="brandMapsUrl"
            type="url"
            value={draft.mapsUrl}
            onChange={(event) => setDraft({ ...draft, mapsUrl: event.target.value })}
            className={`mt-2 ${adminInput}`}
          />
        </div>

        <div>
          <label htmlFor="brandHours" className={adminLabel}>
            Jam buka
          </label>
          <input
            id="brandHours"
            value={draft.hours}
            onChange={(event) => setDraft({ ...draft, hours: event.target.value })}
            className={`mt-2 ${adminInput}`}
          />
        </div>

        <div>
          <label htmlFor="brandInstagram" className={adminLabel}>
            Instagram
          </label>
          <input
            id="brandInstagram"
            type="url"
            value={draft.instagram}
            onChange={(event) => setDraft({ ...draft, instagram: event.target.value })}
            className={`mt-2 ${adminInput}`}
          />
        </div>

        <div>
          <label htmlFor="brandTiktok" className={adminLabel}>
            TikTok
          </label>
          <input
            id="brandTiktok"
            type="url"
            value={draft.tiktok}
            onChange={(event) => setDraft({ ...draft, tiktok: event.target.value })}
            className={`mt-2 ${adminInput}`}
          />
        </div>

        <div>
          <label htmlFor="brandWhatsapp" className={adminLabel}>
            WhatsApp
          </label>
          <input
            id="brandWhatsapp"
            type="url"
            value={draft.whatsapp}
            onChange={(event) => setDraft({ ...draft, whatsapp: event.target.value })}
            className={`mt-2 ${adminInput}`}
          />
        </div>
      </div>

      <ImageUploadField
        id="brandLogo"
        label="Logo brand"
        bucket={STORAGE_BUCKETS.product}
        folder="brand"
        value={draft.logoUrl}
        onChange={(url) => setDraft({ ...draft, logoUrl: url })}
      />

      <SubmitButton isPending={isPending}>
        <Save className="mr-2 h-4 w-4" aria-hidden="true" />
        Simpan profil brand
      </SubmitButton>
    </form>
  );
}

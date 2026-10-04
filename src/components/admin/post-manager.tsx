"use client";

import { useState } from "react";
import { Eye, EyeOff, Plus, Save, Trash2 } from "lucide-react";
import { deletePostAction, savePostAction, togglePostPublishedAction } from "@/lib/admin/actions/posts";
import type { AdminPost } from "@/lib/data/admin";
import { STORAGE_BUCKETS } from "@/lib/admin/types";
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
import { slugifyMenuItem } from "@/lib/menu-data";
import { formatDateTime } from "@/lib/utils";

type PostDraft = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tagsInput: string;
  published: boolean;
};

const emptyDraft: PostDraft = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  tagsInput: "",
  published: false,
};

function toDraft(post: AdminPost): PostDraft {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage ?? "",
    tagsInput: post.tags.join(", "),
    published: post.published,
  };
}

function parseTags(value: string) {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

export function PostManager({ posts }: { posts: AdminPost[] }) {
  const { run, isPending, feedback } = useAdminAction();
  const [draft, setDraft] = useState<PostDraft>(emptyDraft);
  const [isEditing, setIsEditing] = useState(false);

  function reset() {
    setDraft(emptyDraft);
    setIsEditing(false);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    void run(
      () =>
        savePostAction({
          id: draft.id,
          title: draft.title,
          slug: draft.slug,
          excerpt: draft.excerpt,
          content: draft.content,
          coverImage: draft.coverImage,
          tags: parseTags(draft.tagsInput),
          published: draft.published,
        }),
      { onSuccess: reset },
    );
  }

  return (
    <div className="space-y-6">
      <section className={adminCard}>
        <h2 className="text-lg font-black tracking-[-0.02em] text-[#241c18]">Daftar artikel</h2>
        <ActionFeedback feedback={feedback} />

        <ul className="mt-5 divide-y divide-[#f0e6db] rounded-2xl border border-[#f0e6db]">
          {posts.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-[#7d5c4d]">
              Belum ada artikel. Tulis artikel pertama lewat form di bawah.
            </li>
          ) : (
            posts.map((post) => (
              <li key={post.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#30251f]">{post.title}</p>
                  <p className="text-xs text-[#7d5c4d]">
                    /blog/{post.slug} · {formatDateTime(post.createdAt)}
                    {post.tags.length > 0 ? ` · ${post.tags.join(", ")}` : ""}
                  </p>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${
                    post.published
                      ? "border-[#b7d7c1] bg-[#eef7f0] text-[#2f6b41]"
                      : "border-[#f0d5a6] bg-[#fdf1dd] text-[#895a12]"
                  }`}
                >
                  {post.published ? "Published" : "Draft"}
                </span>

                <div className="ml-auto flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      void run(() =>
                        togglePostPublishedAction({ postId: post.id, published: !post.published }),
                      )
                    }
                    className={adminSecondaryButton}
                  >
                    {post.published ? (
                      <>
                        <EyeOff className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                        Jadi draft
                      </>
                    ) : (
                      <>
                        <Eye className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                        Publish
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDraft(toDraft(post));
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
                      if (window.confirm(`Hapus artikel "${post.title}"?`)) {
                        void run(() => deletePostAction(post.id));
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
      </section>

      <section className={adminCard}>
        <h2 className="text-lg font-black tracking-[-0.02em] text-[#241c18]">
          {isEditing ? "Ubah artikel" : "Tulis artikel baru"}
        </h2>
        <p className="mt-1 text-sm text-[#6d5b50]">
          Isi artikel ditulis dengan Markdown: <code>#</code> judul, <code>##</code> subjudul,{" "}
          <code>-</code> daftar, <code>**tebal**</code>.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="postTitle" className={adminLabel}>
                Judul artikel
              </label>
              <input
                id="postTitle"
                required
                value={draft.title}
                onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                placeholder="Tips memilih biji kopi"
                className={`mt-2 ${adminInput}`}
              />
            </div>

            <div>
              <label htmlFor="postSlug" className={adminLabel}>
                Slug URL
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="postSlug"
                  required
                  value={draft.slug}
                  onChange={(event) => setDraft({ ...draft, slug: event.target.value })}
                  placeholder="tips-memilih-biji-kopi"
                  className={adminInput}
                />
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, slug: slugifyMenuItem(draft.title) })}
                  className={adminSecondaryButton}
                >
                  Oto
                </button>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="postExcerpt" className={adminLabel}>
              Ringkasan
            </label>
            <textarea
              id="postExcerpt"
              rows={2}
              value={draft.excerpt}
              onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })}
              placeholder="Satu paragraf singkat yang tampil di daftar artikel."
              className={`mt-2 ${adminTextarea}`}
            />
          </div>

          <div>
            <label htmlFor="postContent" className={adminLabel}>
              Isi artikel (Markdown)
            </label>
            <textarea
              id="postContent"
              rows={14}
              required
              value={draft.content}
              onChange={(event) => setDraft({ ...draft, content: event.target.value })}
              placeholder={"## Kenapa biji kopi penting?\n\nTulis isi artikel di sini."}
              className={`mt-2 font-mono text-sm ${adminTextarea}`}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="postTags" className={adminLabel}>
                Tag (pisahkan dengan koma)
              </label>
              <input
                id="postTags"
                value={draft.tagsInput}
                onChange={(event) => setDraft({ ...draft, tagsInput: event.target.value })}
                placeholder="kopi, brewing, gatchu"
                className={`mt-2 ${adminInput}`}
              />
            </div>

            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-[#4d3d33]">
                <input
                  type="checkbox"
                  checked={draft.published}
                  onChange={(event) => setDraft({ ...draft, published: event.target.checked })}
                  className="h-4 w-4 rounded border-[#d8c9b8] text-[#a24931] focus:ring-[#a24931]"
                />
                Publikasikan langsung
              </label>
            </div>
          </div>

          <ImageUploadField
            id="postCover"
            label="Gambar cover"
            bucket={STORAGE_BUCKETS.post}
            folder="posts"
            value={draft.coverImage}
            onChange={(url) => setDraft({ ...draft, coverImage: url })}
          />

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
                  Simpan artikel
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
    </div>
  );
}

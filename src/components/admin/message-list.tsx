"use client";

import { Mail, Phone, Trash2 } from "lucide-react";
import { deleteMessageAction, setMessageReadAction } from "@/lib/admin/actions/messages";
import type { AdminMessage } from "@/lib/data/admin";
import { ActionFeedback } from "@/components/admin/action-feedback";
import { useAdminAction } from "@/components/admin/use-admin-action";
import { adminCard, adminDangerButton, adminSecondaryButton } from "@/components/admin/ui";
import { cn, formatDateTime } from "@/lib/utils";

const typeMeta: Record<AdminMessage["type"], { label: string; className: string }> = {
  contact: { label: "Kontak", className: "border-[#bcd4f2] bg-[#e8f0fb] text-[#2a5599]" },
  reservation: { label: "Reservasi", className: "border-[#b7d7c1] bg-[#eef7f0] text-[#2f6b41]" },
};

export function MessageList({ messages }: { messages: AdminMessage[] }) {
  const { run, isPending, feedback } = useAdminAction();

  if (messages.length === 0) {
    return (
      <p className="rounded-3xl border border-dashed border-[#d8c9b8] bg-[#fdfaf6] px-6 py-10 text-center text-sm text-[#7d5c4d]">
        Belum ada pesan masuk.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <ActionFeedback feedback={feedback} />

      {messages.map((message) => {
        const meta = typeMeta[message.type];
        const waLink = message.phone
          ? `https://wa.me/62${message.phone.replace(/^0/, "").replace(/[^0-9]/g, "")}`
          : null;

        return (
          <article
            key={message.id}
            className={cn(adminCard, !message.isRead && "border-[#a24931] bg-[#fffaf7]")}
          >
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-black tracking-[-0.02em] text-[#241c18]">{message.name}</h2>
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em]",
                  meta.className,
                )}
              >
                {meta.label}
              </span>
              {!message.isRead ? (
                <span className="rounded-full bg-[#a24931] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                  Baru
                </span>
              ) : null}
            </div>

            <p className="mt-1 text-xs text-[#7d5c4d]">
              {formatDateTime(message.createdAt)}
              {message.subject ? ` · ${message.subject}` : ""}
            </p>

            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-[#4d3d33]">
              {message.message}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#f0e6db] pt-4">
              {message.email ? (
                <a
                  href={`mailto:${message.email}`}
                  className="inline-flex items-center text-xs font-semibold text-[#a24931] hover:underline"
                >
                  <Mail className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  {message.email}
                </a>
              ) : null}
              {message.phone ? (
                <a
                  href={waLink ?? `tel:${message.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-xs font-semibold text-[#a24931] hover:underline"
                >
                  <Phone className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  {message.phone}
                </a>
              ) : null}

              <div className="ml-auto flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    void run(() =>
                      setMessageReadAction({ messageId: message.id, isRead: !message.isRead }),
                    )
                  }
                  className={adminSecondaryButton}
                >
                  {message.isRead ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    if (window.confirm(`Hapus pesan dari ${message.name}?`)) {
                      void run(() => deleteMessageAction(message.id));
                    }
                  }}
                  className={adminDangerButton}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  Hapus
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowUpRight, CalendarCheck, Loader2, MessageCircle, Send } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const contactSchema = z
  .object({
    type: z.enum(["contact", "reservation"]),
    name: z.string().trim().min(3, "Nama minimal 3 karakter"),
    email: z.string().trim().email("Email tidak valid").optional().or(z.literal("")),
    phone: z
      .string()
      .trim()
      .regex(/^[0-9+\-\s]*$/, "Nomor hanya boleh berisi angka, spasi, atau tanda -")
      .optional()
      .or(z.literal("")),
    subject: z.string().trim().max(160).optional().or(z.literal("")),
    message: z.string().trim().min(10, "Pesan minimal 10 karakter").max(1500),
  })
  .refine((values) => Boolean(values.email || values.phone), {
    message: "Isi email atau nomor WhatsApp agar kami bisa membalas",
    path: ["phone"],
  });

export type ContactFormValues = z.infer<typeof contactSchema>;

const fieldClass =
  "w-full rounded-2xl border border-[#d8c9b8] bg-white px-4 py-3 text-sm text-[#30251f] outline-none transition-colors placeholder:text-[#a27b68] focus:border-[#c9674b]";

export function ContactForm() {
  const [serverState, setServerState] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      type: "contact",
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const type = watch("type");
  const values = watch();

  const onSubmit = handleSubmit(async (formValues) => {
    setServerState(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setServerState({
          tone: "error",
          text: payload.error ?? "Pesan gagal dikirim. Coba lagi sebentar.",
        });
        return;
      }

      setServerState({
        tone: "success",
        text:
          formValues.type === "reservation"
            ? "Reservasi terkirim. Kami akan konfirmasi lewat WhatsApp."
            : "Pesan terkirim. Terima kasih sudah menghubungi Gatchu.",
      });
      reset({ type: formValues.type, name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setServerState({ tone: "error", text: "Koneksi bermasalah. Coba lagi atau hubungi WhatsApp kami." });
    } finally {
      setIsSubmitting(false);
    }
  });

  const whatsappHref = `${siteConfig.whatsapp.link}?text=${encodeURIComponent(
    values.message
      ? `Halo ${siteConfig.name},\n\n${values.message}`
      : `Halo ${siteConfig.name}, saya mau bertanya soal menu dan reservasi.`,
  )}`;

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-2">
        {[
          { value: "contact", label: "Kontak", icon: MessageCircle },
          { value: "reservation", label: "Reservasi", icon: CalendarCheck },
        ].map((option) => {
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue("type", option.value as "contact" | "reservation")}
              aria-pressed={type === option.value}
              className={cn(
                "flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors",
                type === option.value
                  ? "border-[#241c18] bg-[#241c18] text-white"
                  : "border-[#d8c9b8] bg-white text-[#4d3d33] hover:border-[#c9674b]",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {option.label}
            </button>
          );
        })}
      </div>

      {type === "reservation" ? (
        <div className="rounded-2xl bg-[#f2e6da] px-4 py-3 text-xs leading-relaxed text-[#6d5b50]">
          Tulis jumlah orang, tanggal, dan jam datang di kolom pesan. Meja dikonfirmasi lewat
          WhatsApp {siteConfig.whatsapp.display}.
        </div>
      ) : null}

      <div>
        <label htmlFor="contactName" className="block text-xs font-bold uppercase tracking-[0.16em] text-[#a27b68]">
          Nama
        </label>
        <input
          id="contactName"
          type="text"
          placeholder="Nama lengkap"
          className={cn(fieldClass, "mt-2")}
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
        {errors.name ? <p className="mt-1 text-xs text-[#c9674b]">{errors.name.message}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contactPhone" className="block text-xs font-bold uppercase tracking-[0.16em] text-[#a27b68]">
            WhatsApp
          </label>
          <input
            id="contactPhone"
            type="tel"
            inputMode="tel"
            placeholder="08xx-xxxx-xxxx"
            className={cn(fieldClass, "mt-2")}
            aria-invalid={Boolean(errors.phone)}
            {...register("phone")}
          />
          {errors.phone ? <p className="mt-1 text-xs text-[#c9674b]">{errors.phone.message}</p> : null}
        </div>

        <div>
          <label htmlFor="contactEmail" className="block text-xs font-bold uppercase tracking-[0.16em] text-[#a27b68]">
            Email
          </label>
          <input
            id="contactEmail"
            type="email"
            placeholder="nama@email.com"
            className={cn(fieldClass, "mt-2")}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email ? <p className="mt-1 text-xs text-[#c9674b]">{errors.email.message}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="contactSubject" className="block text-xs font-bold uppercase tracking-[0.16em] text-[#a27b68]">
          Topik <span className="font-normal normal-case tracking-normal">(opsional)</span>
        </label>
        <input
          id="contactSubject"
          type="text"
          placeholder="Reservasi ulang tahun, pertanyaan menu, kerja sama..."
          className={cn(fieldClass, "mt-2")}
          {...register("subject")}
        />
      </div>

      <div>
        <label htmlFor="contactMessage" className="block text-xs font-bold uppercase tracking-[0.16em] text-[#a27b68]">
          Pesan
        </label>
        <textarea
          id="contactMessage"
          rows={5}
          placeholder="Ceritakan yang ingin kamu tanyakan atau pesan."
          className={cn(fieldClass, "mt-2 resize-none")}
          aria-invalid={Boolean(errors.message)}
          {...register("message")}
        />
        {errors.message ? <p className="mt-1 text-xs text-[#c9674b]">{errors.message.message}</p> : null}
      </div>

      {serverState ? (
        <p
          role="status"
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm",
            serverState.tone === "success"
              ? "border-[#b7d7c1] bg-[#eef7f0] text-[#2f6b41]"
              : "border-[#e2b7a8] bg-[#fdeee9] text-[#a4462f]",
          )}
        >
          {serverState.text}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex flex-1 items-center justify-center rounded-full bg-[#241c18] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#c9674b] disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Mengirim...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" aria-hidden="true" />
              Kirim {type === "reservation" ? "reservasi" : "pesan"}
            </>
          )}
        </button>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center justify-center rounded-full border border-[#d8c9b8] bg-white px-5 py-3.5 text-sm font-semibold text-[#30251f] transition-colors hover:border-[#c9674b] hover:text-[#c9674b]"
        >
          <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
          Kirat via WhatsApp
          <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </form>
  );
}

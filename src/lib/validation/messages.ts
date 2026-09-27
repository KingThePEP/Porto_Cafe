import { z } from "zod";

const optionalEmail = z
  .string()
  .trim()
  .max(160, "Email terlalu panjang")
  .email("Email tidak valid")
  .optional()
  .or(z.literal(""));

const optionalPhone = z
  .string()
  .trim()
  .max(30, "Nomor terlalu panjang")
  .regex(/^[0-9+\-\s]*$/, "Nomor hanya boleh berisi angka, spasi, atau tanda -")
  .optional()
  .or(z.literal(""));

export const messagePayloadSchema = z
  .object({
    type: z.enum(["contact", "reservation"]).default("contact"),
    name: z.string().trim().min(3, "Nama minimal 3 karakter").max(120),
    email: optionalEmail,
    phone: optionalPhone,
    subject: z.string().trim().max(160, "Topik terlalu panjang").optional().or(z.literal("")),
    message: z.string().trim().min(10, "Pesan minimal 10 karakter").max(1500, "Pesan terlalu panjang"),
  })
  .refine((values) => Boolean(values.email || values.phone), {
    message: "Isi email atau nomor WhatsApp agar kami bisa membalas",
    path: ["phone"],
  });

export type MessagePayload = z.infer<typeof messagePayloadSchema>;

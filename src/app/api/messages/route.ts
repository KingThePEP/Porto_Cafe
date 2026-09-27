import { NextResponse } from "next/server";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site-config";
import { notifyMessage } from "@/lib/notify";
import { messagePayloadSchema } from "@/lib/validation/messages";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload tidak valid." }, { status: 400 });
  }

  const parsed = messagePayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data pesan tidak lengkap." },
      { status: 400 },
    );
  }

  const { email, phone, subject, ...rest } = parsed.data;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error: `Pesan belum tersimpan karena database belum terhubung. Hubungi kami langsung di WhatsApp ${siteConfig.whatsapp.display}.`,
        code: "SUPABASE_NOT_CONFIGURED",
      },
      { status: 503 },
    );
  }

  const supabase = createClient();
  const { error } = await supabase.from("messages").insert({
    name: rest.name,
    message: rest.message,
    type: rest.type,
    email: email || null,
    phone: phone || null,
    subject: subject || null,
  });

  if (error) {
    return NextResponse.json({ error: "Pesan gagal dikirim. Coba lagi sebentar." }, { status: 500 });
  }

  const notification = await notifyMessage({
    kind: "message",
    name: rest.name,
    message: rest.message,
    type: rest.type,
    email: email || null,
    phone: phone || null,
    subject: subject || null,
  });

  if (notification.error) {
    console.error("[notify] pesan:", notification.error);
  }

  return NextResponse.json({ ok: true, notified: Boolean(notification.delivered) }, { status: 201 });
}

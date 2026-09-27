// Edge Function: kirim notifikasi admin untuk pesanan baru dan pesan kontak.
//
// Deploy:
//   supabase functions deploy notify-admin
// Secrets (wajib):
//   NOTIFY_SECRET   token random yang sama dengan NOTIFY_SECRET di server Next
// Opsional:
//   RESEND_API_KEY  tanpa key ini fungsi tetap jalan tapi statusnya "skipped"
//   RESEND_FROM     alamat pengirim, default "Gatchu Coffee <onboarding@resend.dev>"
//   ADMIN_EMAIL     tujuan notifikasi admin

const RESEND_ENDPOINT = "https://api.resend.com/emails";

type OrderPayload = {
  kind: "order";
  orderId: string;
  customerName: string;
  customerPhone: string;
  orderType: string;
  address?: string | null;
  notes?: string | null;
  total: number;
  items: { productName: string; sizeLabel: string; price: number; qty: number }[];
};

type MessagePayload = {
  kind: "message";
  name: string;
  message: string;
  type: string;
  email?: string | null;
  phone?: string | null;
  subject?: string | null;
};

type NotifyPayload = OrderPayload | MessagePayload;

const ORDER_STATUS_LABELS: Record<string, string> = {
  pickup: "Takeaway / ambil di outlet",
  delivery: "Delivery",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function safe(value: string | null | undefined) {
  return escapeHtml(value ?? "");
}

function subjectSafe(value: string) {
  return value.replace(/[\r\n\u0000-\u001f]/g, " ").slice(0, 120);
}

function buildOrderEmail(payload: OrderPayload) {
  const lines = payload.items
    .map(
      (item) =>
        `<tr><td style="padding:6px 0">${safe(item.productName)} (${safe(item.sizeLabel)}) &times; ${item.qty}</td><td style="padding:6px 0;text-align:right">${formatPrice(
          item.price * item.qty,
        )}</td></tr>`,
    )
    .join("");

  return {
    subject: subjectSafe(`Pesanan baru dari ${payload.customerName}`),
    heading: "Pesanan baru masuk",
    blocks: `
      <p><strong>Nama:</strong> ${safe(payload.customerName)}<br />
      <strong>WhatsApp:</strong> ${safe(payload.customerPhone)}<br />
      <strong>Tipe:</strong> ${safe(ORDER_STATUS_LABELS[payload.orderType] ?? payload.orderType)}<br />
      ${payload.address ? `<strong>Alamat:</strong> ${safe(payload.address)}<br />` : ""}
      ${payload.notes ? `<strong>Catatan:</strong> ${safe(payload.notes)}<br />` : ""}
      <strong>ID Pesanan:</strong> ${safe(payload.orderId)}</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px">${lines}
        <tr><td style="padding:8px 0;border-top:2px solid #eee"><strong>Total</strong></td>
        <td style="padding:8px 0;border-top:2px solid #eee;text-align:right"><strong>${formatPrice(
          payload.total,
        )}</strong></td></tr>
      </table>`,
  };
}

function buildMessageEmail(payload: MessagePayload) {
  return {
    subject: subjectSafe(`Pesan baru dari ${payload.name}`),
    heading: payload.type === "reservation" ? "Reservasi baru" : "Pesan baru dari form kontak",
    blocks: `
      <p><strong>Nama:</strong> ${safe(payload.name)}<br />
      ${payload.email ? `<strong>Email:</strong> ${safe(payload.email)}<br />` : ""}
      ${payload.phone ? `<strong>WhatsApp:</strong> ${safe(payload.phone)}<br />` : ""}
      ${payload.subject ? `<strong>Subjek:</strong> ${safe(payload.subject)}<br />` : ""}</p>
      <p style="white-space:pre-wrap">${safe(payload.message)}</p>`,
  };
}

function buildHtml(heading: string, blocks: string) {
  return `<!doctype html>
<html lang="id">
  <body style="margin:0;padding:24px;background:#faf6f1;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#241c18">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;padding:28px;border:1px solid #e2d5c7">
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#c9674b">Gatchu Coffee</p>
      <h1 style="margin:0 0 16px;font-size:20px">${escapeHtml(heading)}</h1>
      <div style="font-size:14px;line-height:1.7">${blocks}</div>
      <p style="margin:24px 0 0;font-size:12px;color:#a27b68">Notifikasi otomatis dari sistem pre-order Gatchu Coffee.</p>
    </div>
  </body>
</html>`;
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const secret = Deno.env.get("NOTIFY_SECRET");

  if (!secret) {
    return Response.json({ error: "NOTIFY_SECRET belum diatur di Edge Function." }, { status: 500 });
  }

  if (request.headers.get("x-notify-secret") !== secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: NotifyPayload;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Payload tidak valid." }, { status: 400 });
  }

  const resendKey = Deno.env.get("RESEND_API_KEY");
  const adminEmail = Deno.env.get("ADMIN_EMAIL");

  if (!resendKey || !adminEmail) {
    return Response.json({ skipped: true, reason: "RESEND_API_KEY atau ADMIN_EMAIL belum diatur." }, { status: 200 });
  }

  const content = payload.kind === "order" ? buildOrderEmail(payload) : buildMessageEmail(payload);

  const resendResponse = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: Deno.env.get("RESEND_FROM") ?? "Gatchu Coffee <onboarding@resend.dev>",
      to: [adminEmail],
      subject: content.subject,
      html: buildHtml(content.heading, content.blocks),
    }),
  });

  if (!resendResponse.ok) {
    const detail = await resendResponse.text();
    return Response.json(
      { error: "Resend menolak permintaan.", detail },
      { status: 502 },
    );
  }

  const result = (await resendResponse.json()) as { id?: string };

  return Response.json({ delivered: true, id: result.id ?? null }, { status: 200 });
});

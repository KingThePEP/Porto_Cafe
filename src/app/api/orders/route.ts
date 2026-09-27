import { NextResponse } from "next/server";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site-config";
import { notifyOrder } from "@/lib/notify";
import { firstIssueMessage, orderPayloadSchema } from "@/lib/validation/orders";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload tidak valid." }, { status: 400 });
  }

  const parsed = orderPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 400 },
    );
  }

  const { items, ...order } = parsed.data;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        orderId: null,
        code: "SUPABASE_NOT_CONFIGURED",
        error: `Database belum terhubung, jadi pesanan belum tersimpan. Konfirmasi via WhatsApp ${siteConfig.whatsapp.display} agar pesanmu tetap tercatat.`,
      },
      { status: 503 },
    );
  }

  const supabase = createClient();
  const orderId = crypto.randomUUID();
  const { error: orderError } = await supabase.from("orders").insert({
    id: orderId,
    customer_name: order.customerName,
    customer_phone: order.customerPhone,
    order_type: order.orderType,
    address: order.address ?? null,
    notes: order.notes ? `${order.notes} [ukuran: ${items.map((item) => item.sizeLabel).join(", ")}]` : null,
    total: order.total,
    status: "pending",
  });

  if (orderError) {
    return NextResponse.json({ error: "Pesanan gagal disimpan. Coba lagi sebentar." }, { status: 500 });
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    items.map((item) => ({
      order_id: orderId,
      product_name: `${item.productName} (${item.sizeLabel})`,
      price: item.price,
      qty: item.qty,
      subtotal: item.price * item.qty,
    })),
  );

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", orderId);
    return NextResponse.json({ error: "Detail pesanan gagal disimpan. Coba lagi sebentar." }, { status: 500 });
  }

  const notification = await notifyOrder({
    kind: "order",
    orderId,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    orderType: order.orderType,
    address: order.address ?? null,
    notes: order.notes ?? null,
    total: order.total,
    items,
  });

  if (notification.error) {
    console.error("[notify] pesanan:", notification.error);
  }

  return NextResponse.json({ orderId, notified: Boolean(notification.delivered) }, { status: 201 });
}

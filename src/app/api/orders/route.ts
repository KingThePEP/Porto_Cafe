import { NextResponse } from "next/server";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site-config";
import { notifyOrder } from "@/lib/notify";
import { firstIssueMessage, orderPayloadSchema } from "@/lib/validation/orders";

type CreateOrderItem = {
  productId: string | null;
  productName: string;
  sizeLabel: string;
  price: number;
  qty: number;
  subtotal: number;
};

type CreateOrderResult = {
  order: { id: string; total: number | string };
  items: CreateOrderItem[] | null;
};

// Postgres melempar pesan yang aman untuk ditampilkan ke pembeli, misalnya
// "Menu tidak ditemukan" atau "Cappuccino sedang tidak tersedia". Sisanya
// dibikin generik supaya detail internal tidak bocor ke browser.
function friendlyDatabaseError(message: string) {
  if (
    /tidak ditemukan|tidak tersedia|tidak valid|masih kosong|terlalu banyak/i.test(message)
  ) {
    return message;
  }

  return "Pesanan gagal disimpan. Coba lagi sebentar.";
}

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

  // Harga dan total tidak pernah diambil dari client. Fungsi create_order()
  // menghitung ulang dari tabel products, menulis orders + order_items dalam
  // satu transaksi, dan mengembalikan nilai yang benar-benar tersimpan.
  const { data, error } = await supabase.rpc("create_order", {
    p_customer_name: order.customerName,
    p_customer_phone: order.customerPhone,
    p_order_type: order.orderType,
    p_address: order.address ?? null,
    p_notes: order.notes ?? null,
    p_items: items.map((item) => ({
      productId: item.productId,
      size: item.size,
      qty: item.qty,
    })),
  });

  if (error || !data) {
    const message = friendlyDatabaseError(error?.message ?? "create_order gagal");

    // 400 untuk input yang tidak valid, 500 untuk masalah lain.
    const isUserError = /tidak ditemukan|tidak tersedia|tidak valid|masih kosong|terlalu banyak/i.test(
      error?.message ?? "",
    );

    return NextResponse.json(
      { error: message },
      { status: isUserError ? 400 : 500 },
    );
  }

  const result = data as CreateOrderResult;
  const orderId = result.order.id;
  const total = Number(result.order.total);
  const savedItems = (result.items ?? []).map((item) => ({
    productName: item.productName,
    sizeLabel: item.sizeLabel,
    price: Number(item.price),
    qty: Number(item.qty),
  }));

  const notification = await notifyOrder({
    kind: "order",
    orderId,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    orderType: order.orderType,
    address: order.address ?? null,
    notes: order.notes ?? null,
    total,
    items: savedItems,
  });

  if (notification.error) {
    console.error("[notify] pesanan:", notification.error);
  }

  // total dikembalikan dari server supaya halaman konfirmasi menampilkan
  // angka yang sama dengan yang tersimpan di database.
  return NextResponse.json(
    { orderId, total, notified: Boolean(notification.delivered) },
    { status: 201 },
  );
}

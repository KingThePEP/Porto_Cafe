const FUNCTION_PATH = "/functions/v1/notify-admin";
const TIMEOUT_MS = 4000;

type NotifyResult = { delivered?: boolean; skipped?: boolean; error?: string };

type OrderNotification = {
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

type MessageNotification = {
  kind: "message";
  name: string;
  message: string;
  type: string;
  email?: string | null;
  phone?: string | null;
  subject?: string | null;
};

export function isNotifyConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NOTIFY_SECRET);
}

async function send(payload: OrderNotification | MessageNotification): Promise<NotifyResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.NOTIFY_SECRET;

  if (!url || !secret) {
    return { skipped: true };
  }

  try {
    const response = await fetch(`${url}${FUNCTION_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-notify-secret": secret,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      return { error: `Edge Function merespons ${response.status}` };
    }

    return (await response.json()) as NotifyResult;
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menghubungi Edge Function" };
  }
}

export function notifyOrder(payload: OrderNotification) {
  return send(payload);
}

export function notifyMessage(payload: MessageNotification) {
  return send(payload);
}

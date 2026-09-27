import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MessageList } from "@/components/admin/message-list";
import { getMessages } from "@/lib/data/admin";
import { requireAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  await requireAdmin();
  const messages = await getMessages();
  const unread = messages.filter((message) => !message.isRead).length;

  return (
    <>
      <AdminPageHeader
        title="Pesan & Reservasi"
        description={
          unread > 0
            ? `${unread} pesan belum dibaca. Balas pelanggan lewat WhatsApp atau email.`
            : "Semua pesan sudah dibaca."
        }
      />
      <MessageList messages={messages} />
    </>
  );
}

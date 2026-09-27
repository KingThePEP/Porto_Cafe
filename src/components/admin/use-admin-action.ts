"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import type { ActionResult, Feedback } from "@/lib/admin/types";

export function useAdminAction() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<Feedback>(null);

  const run = useCallback(
    (action: () => Promise<ActionResult>, options?: { onSuccess?: () => void }) =>
      () => {
        setFeedback(null);

        startTransition(async () => {
          const result = await action();

          if (result.ok) {
            setFeedback(result.message ? { tone: "success", text: result.message } : null);
            options?.onSuccess?.();
            router.refresh();
            return;
          }

          setFeedback({ tone: "error", text: result.error });
        });
      },
    [router],
  );

  return { run, isPending, feedback, setFeedback };
}

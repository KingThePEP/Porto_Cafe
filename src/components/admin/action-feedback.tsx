import type { Feedback } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

export function ActionFeedback({ feedback }: { feedback: Feedback }) {
  if (!feedback) {
    return null;
  }

  return (
    <p
      role="status"
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm",
        feedback.tone === "success"
          ? "border-[#b7d7c1] bg-[#eef7f0] text-[#2f6b41]"
          : "border-[#e2b7a8] bg-[#fdeee9] text-[#a4462f]",
      )}
    >
      {feedback.text}
    </p>
  );
}

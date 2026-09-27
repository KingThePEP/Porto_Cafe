import { Loader2 } from "lucide-react";
import { adminPrimaryButton } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export function SubmitButton({
  isPending,
  children,
  pendingLabel = "Menyimpan...",
  className,
}: {
  isPending: boolean;
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  return (
    <button type="submit" disabled={isPending} className={cn(adminPrimaryButton, className)}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}

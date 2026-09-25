import { cn } from "@/lib/cn";
import { ToastState } from "@/hooks/useToast";

interface ToastProps {
  toast: ToastState | null;
  onDismiss: () => void;
}

export default function Toast({ toast, onDismiss }: ToastProps) {
  if (!toast) return null;

  return (
    <div
      className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2"
      role="status"
      aria-live="polite"
    >
      <div
        className={cn(
          "flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium shadow-modal",
          toast.tone === "success" ? "bg-ink text-paper" : "bg-danger text-white"
        )}
      >
        <span>{toast.message}</span>
        <button
          onClick={onDismiss}
          className="text-xs opacity-70 hover:opacity-100"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

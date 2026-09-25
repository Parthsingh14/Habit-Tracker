import { cn } from "@/lib/cn";

interface LoadingProps {
  label?: string;
  className?: string;
}

export default function Loading({ label = "Loading…", className }: LoadingProps) {
  return (
    <div className={cn("flex items-center gap-2 py-6 text-sm text-ink-muted", className)}>
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-accent"
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}

import { cn } from "@/lib/cn";

interface TrackerCellProps {
  completed: boolean;
  isToday: boolean;
  isPending: boolean;
  taskName: string;
  dateLabel: string;
  onToggle: () => void;
}

export default function TrackerCell({
  completed,
  isToday,
  isPending,
  taskName,
  dateLabel,
  onToggle,
}: TrackerCellProps) {
  return (
    <td className={cn("border-b border-r border-line p-0 text-center", isToday && "bg-today-tint")}>
      <button
        type="button"
        onClick={onToggle}
        disabled={isPending}
        aria-label={`${taskName}, ${dateLabel}, ${completed ? "completed" : "not completed"}`}
        aria-pressed={completed}
        className={cn(
          "flex h-10 w-10 items-center justify-center text-sm transition-colors disabled:cursor-wait",
          completed ? "text-accent" : "text-transparent hover:text-line",
          isPending && "opacity-50"
        )}
      >
        {completed ? "✓" : "•"}
      </button>
    </td>
  );
}

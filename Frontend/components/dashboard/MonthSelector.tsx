import { getMonthLabel } from "@/utils/date";

interface MonthSelectorProps {
  month: number;
  year: number;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function MonthSelector({ month, year, onPrevious, onNext, onToday }: MonthSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous month"
        className="rounded-md border border-line bg-paper-surface px-2.5 py-1.5 text-sm text-ink hover:bg-paper"
      >
        ‹
      </button>
      <h1 className="min-w-[10rem] text-center font-display text-lg font-semibold text-ink">
        {getMonthLabel(month, year)}
      </h1>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next month"
        className="rounded-md border border-line bg-paper-surface px-2.5 py-1.5 text-sm text-ink hover:bg-paper"
      >
        ›
      </button>
      <button
        type="button"
        onClick={onToday}
        className="ml-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-ink-muted hover:bg-paper"
      >
        Today
      </button>
    </div>
  );
}

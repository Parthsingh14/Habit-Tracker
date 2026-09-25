import { cn } from "@/lib/cn";
import { getWeekdayLabel } from "@/utils/date";

interface TrackerHeaderProps {
  month: number;
  year: number;
  dayNumbers: number[];
  todayDay: number | null;
}

export default function TrackerHeader({ month, year, dayNumbers, todayDay }: TrackerHeaderProps) {
  return (
    <thead>
      <tr>
        <th
          scope="col"
          className="sticky left-0 z-10 min-w-[160px] border-b border-r border-line bg-paper-surface px-3 py-2 text-left text-sm font-semibold text-ink"
        >
          Task
        </th>
        {dayNumbers.map((day) => (
          <th
            key={day}
            scope="col"
            className={cn(
              "min-w-10 border-b border-r border-line px-1 py-1.5 text-center align-bottom",
              day === todayDay && "bg-today-tint"
            )}
          >
            <div
              className={cn(
                "font-display text-sm leading-none",
                day === todayDay ? "font-semibold text-today" : "text-ink"
              )}
            >
              {day}
            </div>
            <div className="mt-0.5 text-[10px] leading-none text-ink-faint">
              {getWeekdayLabel(year, month, day)}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}

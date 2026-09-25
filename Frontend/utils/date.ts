const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Days in `month` (1-12) of `year`, correctly handling leap years. */
export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

export function getMonthName(month: number): string {
  return MONTH_NAMES[month - 1] ?? "";
}

export function getMonthLabel(month: number, year: number): string {
  return `${getMonthName(month)} ${year}`;
}

/** Formats a single day of a given month/year as "YYYY-MM-DD". */
export function formatDateISO(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

export function getWeekdayLabel(year: number, month: number, day: number): string {
  const date = new Date(year, month - 1, day);
  return WEEKDAY_LABELS[date.getDay()];
}

export function getTodayISO(): string {
  const now = new Date();
  return formatDateISO(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/** Returns { month, year } for the current month by default, or the
 * month `delta` steps away (negative = previous, positive = next),
 * correctly rolling over into adjacent years. */
export function shiftMonth(
  month: number,
  year: number,
  delta: number
): { month: number; year: number } {
  const zeroIndexed = month - 1 + delta;
  const newYear = year + Math.floor(zeroIndexed / 12);
  const newMonth = ((zeroIndexed % 12) + 12) % 12;
  return { month: newMonth + 1, year: newYear };
}

export function getCurrentMonthYear(): { month: number; year: number } {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

/** Builds the ordered list of day numbers [1..daysInMonth] for rendering
 * tracker columns / chart x-axis labels. */
export function getDayNumbers(month: number, year: number): number[] {
  const days = getDaysInMonth(month, year);
  return Array.from({ length: days }, (_, i) => i + 1);
}

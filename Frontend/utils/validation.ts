export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidTaskName(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= 100;
}

/** Sleep duration must be strictly positive and no more than 24 hours. */
export function isValidDurationMinutes(minutes: number): boolean {
  return Number.isFinite(minutes) && minutes > 0 && minutes <= 1440;
}

export function hoursMinutesToTotalMinutes(hours: number, minutes: number): number {
  return Math.round(hours * 60 + minutes);
}

export function totalMinutesToHoursLabel(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export function isValidTimeString(value: string): boolean {
  return TIME_PATTERN.test(value);
}

/** Given HH:MM start/end (end may be after midnight), returns duration
 * in minutes, or null if either time is malformed. */
export function computeDurationFromTimes(start: string, end: string): number | null {
  if (!isValidTimeString(start) || !isValidTimeString(end)) return null;
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  const startTotal = startH * 60 + startM;
  let endTotal = endH * 60 + endM;
  if (endTotal <= startTotal) endTotal += 24 * 60; // crossed midnight
  return endTotal - startTotal;
}

export interface SleepRecord {
  id: string;
  date: string; // ISO "YYYY-MM-DD"
  sleepStart: string | null; // "HH:MM"
  sleepEnd: string | null; // "HH:MM"
  durationMinutes: number;
}

export interface SaveSleepPayload {
  date: string;
  sleepStart?: string;
  sleepEnd?: string;
  durationMinutes: number;
}

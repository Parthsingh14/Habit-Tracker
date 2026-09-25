export interface TrackerEntry {
  id: string;
  taskId: string;
  date: string; // ISO "YYYY-MM-DD"
  completed: boolean;
}

export interface MonthlyTracker {
  month: number;
  year: number;
  daysInMonth: number;
  entries: TrackerEntry[];
}

export interface ToggleEntryPayload {
  taskId: string;
  date: string;
}

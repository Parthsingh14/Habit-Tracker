export const API_ENDPOINTS = {
  TASKS: "/api/tasks",
  TRACKER: "/api/tracker",
  TRACKER_TOGGLE: "/api/tracker/toggle",
  SLEEP: "/api/sleep",
  NOTES: "/api/notes",
} as const;

/** How many trailing days of sleep history to show on the chart. */
export const SLEEP_HISTORY_DAYS = 15;

/** Debounce delay (ms) before auto-saving monthly notes. */
export const NOTES_AUTOSAVE_DELAY_MS = 1200;

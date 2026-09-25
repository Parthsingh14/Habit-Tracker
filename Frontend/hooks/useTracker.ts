"use client";

import { useCallback, useEffect, useState } from "react";
import { trackerService } from "@/services/trackerService";
import { TrackerEntry } from "@/types/tracker";
import { getDaysInMonth } from "@/utils/date";

export function useTracker(month: number, year: number) {
  const [entries, setEntries] = useState<TrackerEntry[]>([]);
  const [daysInMonth, setDaysInMonth] = useState<number>(getDaysInMonth(month, year));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Cells currently mid-toggle, so the UI can disable them and avoid
  // duplicate submissions from repeated clicking.
  const [pendingCells, setPendingCells] = useState<Set<string>>(new Set());

  const fetchTracker = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await trackerService.getMonthlyTracker(month, year);
      setEntries(data.entries);
      setDaysInMonth(data.daysInMonth);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchTracker();
  }, [fetchTracker]);

  const cellKey = (taskId: string, date: string) => `${taskId}:${date}`;

  const isCompleted = useCallback(
    (taskId: string, date: string) =>
      entries.some((entry) => entry.taskId === taskId && entry.date === date && entry.completed),
    [entries]
  );

  const isPending = useCallback(
    (taskId: string, date: string) => pendingCells.has(cellKey(taskId, date)),
    [pendingCells]
  );

  const toggleCell = useCallback(
    async (taskId: string, date: string) => {
      const key = cellKey(taskId, date);
      if (pendingCells.has(key)) return; // ignore rapid repeated clicks

      setPendingCells((prev) => new Set(prev).add(key));
      setError(null);

      // Optimistic update - the UI flips immediately.
      const existing = entries.find((e) => e.taskId === taskId && e.date === date);
      const snapshot = entries;
      setEntries((prev) => {
        if (existing) {
          return prev.map((e) => (e === existing ? { ...e, completed: !e.completed } : e));
        }
        return [...prev, { id: `optimistic:${key}`, taskId, date, completed: true }];
      });

      try {
        const updated = await trackerService.toggleEntry({ taskId, date });
        setEntries((prev) => {
          const withoutStale = prev.filter((e) => !(e.taskId === taskId && e.date === date));
          return [...withoutStale, updated];
        });
      } catch (err) {
        // Network failure while toggling: revert to the last known-good
        // state and surface the error rather than leaving a false state.
        setEntries(snapshot);
        setError((err as Error).message);
      } finally {
        setPendingCells((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
    },
    [entries, pendingCells]
  );

  return {
    entries,
    daysInMonth,
    loading,
    error,
    isCompleted,
    isPending,
    toggleCell,
    refetch: fetchTracker,
  };
}

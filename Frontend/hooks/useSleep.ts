"use client";

import { useCallback, useEffect, useState } from "react";
import { sleepService } from "@/services/sleepService";
import { SaveSleepPayload, SleepRecord } from "@/types/sleep";
import { SLEEP_HISTORY_DAYS } from "@/constants/api";

export function useSleep(days: number = SLEEP_HISTORY_DAYS) {
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sleepService.getRecentSleep(days);
      setRecords(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchRecent();
  }, [fetchRecent]);

  const saveSleep = useCallback(async (payload: SaveSleepPayload) => {
    setSaving(true);
    setError(null);
    try {
      const saved = await sleepService.saveSleep(payload);
      setRecords((prev) => {
        const withoutSameDate = prev.filter((r) => r.date !== saved.date);
        return [...withoutSameDate, saved].sort((a, b) => a.date.localeCompare(b.date));
      });
      return saved;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return { records, loading, saving, error, saveSleep, refetch: fetchRecent };
}

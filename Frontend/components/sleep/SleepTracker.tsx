"use client";

import { useSleep } from "@/hooks/useSleep";
import SleepInput from "@/components/sleep/SleepInput";
import SleepChart from "@/components/sleep/SleepChart";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";
import { getTodayISO } from "@/utils/date";
import { SLEEP_HISTORY_DAYS } from "@/constants/api";

interface SleepTrackerProps {
  onFeedback: (message: string, tone?: "success" | "error") => void;
}

export default function SleepTracker({ onFeedback }: SleepTrackerProps) {
  const { records, loading, error, saveSleep, refetch } = useSleep(SLEEP_HISTORY_DAYS);

  const handleSave = async (durationMinutes: number) => {
    try {
      await saveSleep({ date: getTodayISO(), durationMinutes });
      onFeedback("Sleep logged");
    } catch (err) {
      onFeedback((err as Error).message, "error");
      throw err;
    }
  };

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-line bg-paper-surface p-4 shadow-panel">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Sleep</h2>
        <span className="text-xs text-ink-faint">Last {SLEEP_HISTORY_DAYS} days</span>
      </div>

      {error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : loading ? (
        <Loading label="Loading sleep history…" />
      ) : (
        <SleepChart records={records} days={SLEEP_HISTORY_DAYS} />
      )}

      <div className="border-t border-line pt-3">
        <SleepInput onSave={handleSave} />
      </div>
    </section>
  );
}

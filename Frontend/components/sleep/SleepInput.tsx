import { FormEvent, useState } from "react";
import Button from "@/components/common/Button";
import { hoursMinutesToTotalMinutes, isValidDurationMinutes } from "@/utils/validation";
import { getTodayISO } from "@/utils/date";

interface SleepInputProps {
  onSave: (durationMinutes: number) => Promise<void>;
}

export default function SleepInput({ onSave }: SleepInputProps) {
  const [hours, setHours] = useState("7");
  const [minutes, setMinutes] = useState("30");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    const total = hoursMinutesToTotalMinutes(Number(hours) || 0, Number(minutes) || 0);
    if (!isValidDurationMinutes(total)) {
      setError("Enter a duration between 0 and 24 hours.");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onSave(total);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <p className="text-xs text-ink-muted">Log last night&apos;s sleep for {getTodayISO()}</p>
      <div className="flex items-end gap-2">
        <label className="flex flex-col text-xs text-ink-muted">
          Hours
          <input
            type="number"
            min={0}
            max={24}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            disabled={isSaving}
            className="mt-1 w-16 rounded-md border border-line bg-paper-surface px-2 py-1.5 text-sm text-ink"
          />
        </label>
        <label className="flex flex-col text-xs text-ink-muted">
          Minutes
          <input
            type="number"
            min={0}
            max={59}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            disabled={isSaving}
            className="mt-1 w-16 rounded-md border border-line bg-paper-surface px-2 py-1.5 text-sm text-ink"
          />
        </label>
        <Button type="submit" isLoading={isSaving}>
          Save
        </Button>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </form>
  );
}

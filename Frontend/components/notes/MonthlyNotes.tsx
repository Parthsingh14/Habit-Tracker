"use client";

import { useMonthlyNotes } from "@/hooks/useMonthlyNotes";
import NotesEditor from "@/components/notes/NotesEditor";
import Loading from "@/components/common/Loading";
import { cn } from "@/lib/cn";
import { getMonthLabel } from "@/utils/date";

interface MonthlyNotesProps {
  month: number;
  year: number;
}

const STATUS_LABEL: Record<string, string> = {
  idle: "",
  saving: "Saving…",
  saved: "Saved",
  error: "Couldn't save - changes are kept locally, try editing again",
};

export default function MonthlyNotes({ month, year }: MonthlyNotesProps) {
  const { content, setContent, status } = useMonthlyNotes(month, year);

  return (
    <section className="flex flex-col gap-3 rounded-lg border border-line bg-paper-surface p-4 shadow-panel">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">{getMonthLabel(month, year)} notes</h2>
        <span
          className={cn(
            "text-xs",
            status === "error" ? "text-danger" : "text-ink-faint"
          )}
        >
          {STATUS_LABEL[status]}
        </span>
      </div>

      {status === "loading" ? (
        <Loading label="Loading notes…" />
      ) : (
        <NotesEditor value={content} onChange={setContent} disabled={status === "loading"} />
      )}
    </section>
  );
}

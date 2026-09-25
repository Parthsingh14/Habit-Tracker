"use client";

import { useEffect, useRef, useState } from "react";
import { notesService } from "@/services/notesService";
import { useDebounce } from "@/hooks/useDebounce";
import { NOTES_AUTOSAVE_DELAY_MS } from "@/constants/api";

export type NotesSaveStatus = "loading" | "idle" | "saving" | "saved" | "error";

/**
 * Auto-save (debounced) was chosen over an explicit Save button: notes
 * here are informal goals/reminders edited in short bursts, so removing
 * the extra click keeps the UX lightweight, while the debounce still
 * avoids firing a request on every keystroke.
 */
export function useMonthlyNotes(month: number, year: number) {
  const [content, setContentState] = useState("");
  const [status, setStatus] = useState<NotesSaveStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const dirtyRef = useRef(false);
  const debouncedContent = useDebounce(content, NOTES_AUTOSAVE_DELAY_MS);

  // Load notes whenever the selected month changes, and make sure any
  // pending auto-save from the *previous* month can no longer fire.
  useEffect(() => {
    let cancelled = false;
    dirtyRef.current = false;
    setStatus("loading");
    setError(null);

    notesService
      .getNotes(month, year)
      .then((notes) => {
        if (cancelled) return;
        setContentState(notes.content);
        setStatus("idle");
      })
      .catch((err) => {
        if (cancelled) return;
        setError((err as Error).message);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [month, year]);

  // Auto-save once the debounce window elapses - but only if the change
  // was a real user edit (dirtyRef), not the initial fetch settling in.
  useEffect(() => {
    if (!dirtyRef.current) return;
    let cancelled = false;
    setStatus("saving");

    notesService
      .updateNotes({ month, year, content: debouncedContent })
      .then(() => {
        if (cancelled) return;
        dirtyRef.current = false;
        setStatus("saved");
      })
      .catch((err) => {
        if (cancelled) return;
        setError((err as Error).message);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContent]);

  const setContent = (value: string) => {
    dirtyRef.current = true;
    setContentState(value);
  };

  return { content, setContent, status, error };
}

"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/common/Button";
import { isValidTaskName } from "@/utils/validation";

interface AddTaskFormProps {
  onAdd: (name: string) => Promise<void>;
}

export default function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // guards against duplicate submits
    if (!isValidTaskName(name)) {
      setError("Enter a task name (up to 100 characters).");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await onAdd(name.trim());
      setName("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-2 px-3 py-2">
      <div className="flex-1">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add a task, e.g. Read"
          disabled={isSubmitting}
          maxLength={100}
          className="w-full max-w-xs rounded-md border border-line bg-paper-surface px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-faint disabled:opacity-60"
        />
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>
      <Button type="submit" variant="secondary" isLoading={isSubmitting}>
        + Add task
      </Button>
    </form>
  );
}

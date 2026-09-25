"use client";

import { useState } from "react";
import { Task } from "@/types/task";
import TrackerCell from "@/components/tracker/TrackerCell";
import TaskActions from "@/components/tracker/TaskActions";
import { formatDateISO, getMonthName } from "@/utils/date";

interface TrackerRowProps {
  task: Task;
  month: number;
  year: number;
  dayNumbers: number[];
  todayDay: number | null;
  isCompleted: (taskId: string, date: string) => boolean;
  isPending: (taskId: string, date: string) => boolean;
  onToggle: (taskId: string, date: string) => void;
  onRename: (taskId: string, name: string) => Promise<void>;
  onRequestDelete: (task: Task) => void;
}

export default function TrackerRow({
  task,
  month,
  year,
  dayNumbers,
  todayDay,
  isCompleted,
  isPending,
  onToggle,
  onRename,
  onRequestDelete,
}: TrackerRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(task.name);
  const [isSaving, setIsSaving] = useState(false);

  const commitRename = async () => {
    const trimmed = draftName.trim();
    if (!trimmed || trimmed === task.name) {
      setDraftName(task.name);
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await onRename(task.id, trimmed);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <tr className="group">
      <th
        scope="row"
        className="sticky left-0 z-10 border-b border-r border-line bg-paper-surface px-3 py-1.5 text-left"
      >
        <div className="flex items-center justify-between gap-2">
          {isEditing ? (
            <input
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") {
                  setDraftName(task.name);
                  setIsEditing(false);
                }
              }}
              disabled={isSaving}
              maxLength={100}
              className="w-full rounded border border-line bg-paper-surface px-1.5 py-1 text-sm text-ink"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="truncate text-left text-sm font-medium text-ink hover:text-accent"
              title={`Edit "${task.name}"`}
            >
              {task.name}
            </button>
          )}
          <TaskActions onDelete={() => onRequestDelete(task)} />
        </div>
      </th>
      {dayNumbers.map((day) => {
        const date = formatDateISO(year, month, day);
        return (
          <TrackerCell
            key={day}
            completed={isCompleted(task.id, date)}
            isToday={day === todayDay}
            isPending={isPending(task.id, date)}
            taskName={task.name}
            dateLabel={`${getMonthName(month)} ${day}, ${year}`}
            onToggle={() => onToggle(task.id, date)}
          />
        );
      })}
    </tr>
  );
}

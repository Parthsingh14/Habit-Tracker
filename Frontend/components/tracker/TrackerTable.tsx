"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useTracker } from "@/hooks/useTracker";
import { Task } from "@/types/task";
import TrackerHeader from "@/components/tracker/TrackerHeader";
import TrackerRow from "@/components/tracker/TrackerRow";
import AddTaskForm from "@/components/tracker/AddTaskForm";
import DeleteTaskModal from "@/components/tracker/DeleteTaskModal";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";
import EmptyState from "@/components/common/EmptyState";
import { getDayNumbers, getTodayISO } from "@/utils/date";

interface TrackerTableProps {
  month: number;
  year: number;
  onFeedback: (message: string, tone?: "success" | "error") => void;
}

export default function TrackerTable({ month, year, onFeedback }: TrackerTableProps) {
  const { tasks, loading: tasksLoading, error: tasksError, addTask, editTask, removeTask } =
    useTasks();
  const {
    loading: trackerLoading,
    error: trackerError,
    isCompleted,
    isPending,
    toggleCell,
    refetch: refetchTracker,
  } = useTracker(month, year);
  const [taskPendingDelete, setTaskPendingDelete] = useState<Task | null>(null);

  const dayNumbers = getDayNumbers(month, year);
  const todayISO = getTodayISO();
  const [todayYear, todayMonth, todayDayStr] = todayISO.split("-");
  const todayDay =
    Number(todayYear) === year && Number(todayMonth) === month ? Number(todayDayStr) : null;

  const handleAddTask = async (name: string) => {
    await addTask(name);
    onFeedback(`"${name}" added`);
  };

  const handleRename = async (taskId: string, name: string) => {
    await editTask(taskId, name);
    onFeedback("Task updated");
  };

  const handleConfirmDelete = async (task: Task) => {
    await removeTask(task.id);
    setTaskPendingDelete(null);
    onFeedback(`"${task.name}" deleted`);
  };

  const loading = tasksLoading || trackerLoading;
  const error = tasksError || trackerError;

  return (
    <section className="rounded-lg border border-line bg-paper-surface shadow-panel">
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <h2 className="text-sm font-semibold text-ink">Monthly tracker</h2>
      </div>

      {error && (
        <div className="px-3 pt-3">
          <ErrorMessage message={error} onRetry={refetchTracker} />
        </div>
      )}

      {loading && tasks.length === 0 ? (
        <Loading label="Loading tracker…" className="justify-center" />
      ) : tasks.length === 0 ? (
        <div className="p-4">
          <EmptyState
            title="No tasks yet"
            description="Add your first habit, chore, or routine to start tracking it day by day."
          />
          <div className="mt-3">
            <AddTaskForm onAdd={handleAddTask} />
          </div>
        </div>
      ) : (
        <>
          <div className="scrollbar-thin max-h-[60vh] overflow-auto">
            <table className="w-full border-collapse text-sm">
              <TrackerHeader month={month} year={year} dayNumbers={dayNumbers} todayDay={todayDay} />
              <tbody>
                {tasks.map((task) => (
                  <TrackerRow
                    key={task.id}
                    task={task}
                    month={month}
                    year={year}
                    dayNumbers={dayNumbers}
                    todayDay={todayDay}
                    isCompleted={isCompleted}
                    isPending={isPending}
                    onToggle={toggleCell}
                    onRename={handleRename}
                    onRequestDelete={setTaskPendingDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-line">
            <AddTaskForm onAdd={handleAddTask} />
          </div>
        </>
      )}

      <DeleteTaskModal
        task={taskPendingDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskPendingDelete(null)}
      />
    </section>
  );
}

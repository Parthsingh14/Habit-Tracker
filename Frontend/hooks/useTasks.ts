"use client";

import { useCallback, useEffect, useState } from "react";
import { taskService } from "@/services/taskService";
import { Task } from "@/types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (name: string): Promise<Task> => {
    const newTask = await taskService.createTask({ name });
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  }, []);

  const editTask = useCallback(async (id: string, name: string): Promise<Task> => {
    const updated = await taskService.updateTask(id, { name });
    setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
    return updated;
  }, []);

  const removeTask = useCallback(async (id: string): Promise<void> => {
    await taskService.deleteTask(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  return { tasks, loading, error, addTask, editTask, removeTask, refetch: fetchTasks };
}

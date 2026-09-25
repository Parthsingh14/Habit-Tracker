import { apiClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api";
import { CreateTaskPayload, Task, UpdateTaskPayload } from "@/types/task";

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const { data } = await apiClient.get<Task[]>(API_ENDPOINTS.TASKS);
    return data;
  },

  async createTask(payload: CreateTaskPayload): Promise<Task> {
    const { data } = await apiClient.post<Task>(API_ENDPOINTS.TASKS, payload);
    return data;
  },

  async updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
    const { data } = await apiClient.put<Task>(`${API_ENDPOINTS.TASKS}/${id}`, payload);
    return data;
  },

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.TASKS}/${id}`);
  },
};

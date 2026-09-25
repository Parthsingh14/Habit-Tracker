export interface Task {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  name: string;
}

export interface UpdateTaskPayload {
  name: string;
}

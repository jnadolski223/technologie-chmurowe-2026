import { config } from '../config/config.ts';
import type { ApiError, ApiResponse, Task, TaskCreateRequest, TaskUpdateRequest } from '../models';

const TASKS_BASE_URL = `${config.apiBaseUrl}/tasks`;

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorBody: ApiError = await response.json();
    throw new Error(`[${response.status} - ${errorBody.status}] ${errorBody.message}: ${errorBody.reason}`);
  }

  if (response.status === 204) return {} as T;
  const result: ApiResponse<T> = await response.json();
  return result.data;
};

export const taskService = {
  async getAll(): Promise<Task[]> {
    const response: Response = await fetch(TASKS_BASE_URL);
    return handleResponse<Task[]>(response);
  },

  async create(request: TaskCreateRequest): Promise<Task> {
    const response: Response = await fetch(TASKS_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    return handleResponse<Task>(response);
  },

  async updateStatus(id: number, request: TaskUpdateRequest): Promise<Task> {
    const response: Response = await fetch(`${TASKS_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    return handleResponse<Task>(response);
  },

  async delete(id: number): Promise<void> {
    const response: Response = await fetch(`${TASKS_BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    return handleResponse<void>(response);
  }
};

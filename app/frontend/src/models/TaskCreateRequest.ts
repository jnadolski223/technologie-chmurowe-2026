import type { Priority } from './Priority.ts';

export interface TaskCreateRequest {
  content: string;
  priority: Priority
}

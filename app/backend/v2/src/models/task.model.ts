import type { Priority } from './priority.model.js';

export interface Task {
  id: number;
  content: string;
  priority: Priority
  completed: boolean;
}

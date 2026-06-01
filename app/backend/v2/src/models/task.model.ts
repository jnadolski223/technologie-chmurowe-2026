import type { Priority } from '../types/priority.types.js';

export interface Task {
  id: number;
  content: string;
  priority: Priority
  completed: boolean;
}

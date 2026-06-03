import type { Priority } from './Priority.ts';

export interface Task {
  id: number;
  content: string;
  priority?: Priority;
  completed: boolean
}

import type { Task } from '../models';
import './components.css';

interface TaskCardProps {
  task: Task;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}

export default function TaskCard({ task, onToggle, onRemove }: TaskCardProps) {
  const priorityClass: string = `priority-badge ${task.priority?.toLowerCase() || 'low'}`;

  const contentClass: string = `task-content ${task.completed ? 'completed' : ''}`;

  return (
    <div className="task-card">
      <div className="task-card-left">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          onChange={(): void => onToggle(task.id)}
        />
        <span className={contentClass}>{task.content}</span>
      </div>

      <div className="task-card-right">
        <span className={priorityClass}>{task.priority}</span>
        <button className="btn-danger" onClick={(): void => onRemove(task.id)}>Usuń</button>
      </div>
    </div>
  );
}

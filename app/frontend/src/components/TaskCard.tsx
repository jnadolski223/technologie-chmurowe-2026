import type { Task } from '../models';

interface TaskCardProps {
  task: Task;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}

export default function TaskCard({ task, onToggle, onRemove }: TaskCardProps) {
  return (
    <div>
      <input type="checkbox" checked={task.completed} onChange={(): void => onToggle(task.id)}/>
      <span>{task.content}</span>
      <span>{task.priority?.toUpperCase()}</span>
      <button onClick={(): void => onRemove(task.id)}>Usuń</button>
    </div>
  );
}

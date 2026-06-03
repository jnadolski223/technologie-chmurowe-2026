import type { Task } from '../models';
import TaskCard from './TaskCard.tsx';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}

export default function TaskList({ tasks, onToggle, onRemove }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div>
        <p>Lista zadań jest pusta.</p>
      </div>
    );
  }

  return (
    <div>
      {tasks.map((task: Task) => (
        <TaskCard key={task.id} task={task} onToggle={onToggle} onRemove={onRemove}/>
      ))}
    </div>
  );
}

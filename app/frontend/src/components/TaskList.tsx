import type { Task } from '../models';
import TaskCard from './TaskCard.tsx';
import './components.css';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}

export default function TaskList({ tasks, onToggle, onRemove }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="empty-list">
        <p>Lista zadań jest pusta.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task: Task) => (
        <TaskCard key={task.id} task={task} onToggle={onToggle} onRemove={onRemove}/>
      ))}
    </div>
  );
}

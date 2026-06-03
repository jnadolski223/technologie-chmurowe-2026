import type { SubmitEvent } from 'react';
import { ALLOWED_PRIORITIES, type Priority } from '../models';
import './components.css';

interface TaskFormProps {
  content: string;
  priority: Priority | '';
  onContent: (val: string) => void;
  onPriority: (val: Priority) => void;
  onSubmit: () => void;
  onClear: () => void;
}

export default function TaskForm({ content, priority, onContent, onPriority, onSubmit, onClear }: TaskFormProps) {
  const handleSubmit = (event: SubmitEvent): void => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label htmlFor="content">Treść zadania:</label>
        <input
          id="content"
          type="text"
          className="form-input"
          value={content}
          onChange={(e): void => onContent(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="priority">Priorytet zadania:</label>
        <select
          id="priority"
          className="form-select"
          value={priority}
          onChange={(e): void => onPriority(e.target.value as Priority)}
          required
        >
          <option value="" disabled hidden>Wybierz priorytet</option>
          {ALLOWED_PRIORITIES.map((p: Priority) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="button-group">
        <button type="submit" className="btn btn-primary">Dodaj zadanie</button>
        <button type="button" className="btn btn-secondary" onClick={onClear}>Wyczyść</button>
      </div>
    </form>
  );
}

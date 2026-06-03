import type { SubmitEvent } from 'react';
import { ALLOWED_PRIORITIES, type Priority } from '../models';

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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="content">Treść zadania:</label>
        <input
          id="content"
          type="text"
          value={content}
          onChange={(e): void => onContent(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="priority">Priorytet zadania:</label>
        <select
          id="priority"
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

      <div>
        <button type="submit">Dodaj zadanie</button>
        <button type="button" onClick={onClear}>Wyczyść</button>
      </div>
    </form>
  );
}

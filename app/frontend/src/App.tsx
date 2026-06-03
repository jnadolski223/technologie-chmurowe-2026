import { useEffect, useReducer } from 'react';
import type { Priority, Task } from './models';
import { taskService } from './services/taskService.ts';
import TaskForm from './components/TaskForm.tsx';
import TaskList from './components/TaskList.tsx';

interface AppState {
  tasks: Task[];
  formContent: string;
  formPriority: Priority | '';
  error: string | null;
}

type AppAction =
  | { type: 'SET_CONTENT'; payload: string; }
  | { type: 'SET_PRIORITY'; payload: Priority; }
  | { type: 'CLEAR_FORM'; }
  | { type: 'FETCH_SUCCESS'; payload: Task[]; }
  | { type: 'ADD_SUCCESS'; payload: Task; }
  | { type: 'TOGGLE_SUCCESS'; payload: Task; }
  | { type: 'REMOVE_SUCCESS', payload: number; }
  | { type: 'SET_ERROR', payload: string | null; };

const initialState: AppState = {
  tasks: [],
  formContent: '',
  formPriority: '',
  error: null
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CONTENT': {
      return { ...state, formContent: action.payload };
    }

    case 'SET_PRIORITY': {
      return { ...state, formPriority: action.payload };
    }

    case 'CLEAR_FORM': {
      return { ...state, formContent: '', formPriority: '' };
    }

    case 'FETCH_SUCCESS': {
      return { ...state, tasks: action.payload, error: null };
    }

    case 'ADD_SUCCESS': {
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        formContent: '',
        formPriority: '',
        error: null
      };
    }

    case 'TOGGLE_SUCCESS': {
      return {
        ...state,
        tasks: state.tasks.map((t: Task): Task => t.id === action.payload.id ? action.payload : t),
        error: null
      };
    }

    case 'REMOVE_SUCCESS': {
      return {
        ...state,
        tasks: state.tasks.filter((t: Task): boolean => t.id !== action.payload),
        error: null
      };
    }

    case 'SET_ERROR': {
      return { ...state, error: action.payload };
    }

    default: {
      return state;
    }
  }
};

export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect((): void => {
    taskService.getAll()
      .then((tasks: Task[]): void => dispatch({ type: 'FETCH_SUCCESS', payload: tasks }))
      .catch((err: unknown): void => {
        const errorMessage: string = err instanceof Error ? err.message : 'Wystąpił nieznany błąd';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      });
  }, []);

  const handleAddTask = async (): Promise<void> => {
    if (!state.formContent || !state.formPriority) return;
    try {
      const createdTask: Task = await taskService.create({
        content: state.formContent,
        priority: state.formPriority
      });
      dispatch({ type: 'ADD_SUCCESS', payload: createdTask });
    } catch (err: unknown) {
      const errorMessage: string = err instanceof Error ? err.message : 'Wystąpił nieznany błąd';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const handleToggleTask = async (id: number): Promise<void> => {
    const currentTask: Task | undefined = state.tasks.find((t: Task): boolean => t.id === id);
    if (!currentTask) return;
    try {
      const updatedTask: Task = await taskService.updateStatus(id, { completed: !currentTask.completed });
      dispatch({ type: 'TOGGLE_SUCCESS', payload: updatedTask });
    } catch (err: unknown) {
      const errorMessage: string = err instanceof Error ? err.message : 'Wystąpił nieznany błąd';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const handleRemoveTask = async (id: number): Promise<void> => {
    const currentTask: Task | undefined = state.tasks.find((t: Task): boolean => t.id === id);
    if (!currentTask) return;
    try {
      await taskService.delete(id);
      dispatch({ type: 'REMOVE_SUCCESS', payload: id });
    } catch (err: unknown) {
      const errorMessage: string = err instanceof Error ? err.message : 'Wystąpił nieznany błąd';
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
    }
  };

  return (
    <div className="app-container">
      <h1>Menedżer Zadań</h1>

      {state.error && <div className="error-banner"><strong>Błąd:</strong> {state.error}</div>}

      <h2>Dodaj nowe zadanie</h2>
      <TaskForm
        content={state.formContent}
        priority={state.formPriority}
        onContent={(val: string): void => dispatch({ type: 'SET_CONTENT', payload: val })}
        onPriority={(val: Priority): void => dispatch({ type: 'SET_PRIORITY', payload: val })}
        onSubmit={handleAddTask}
        onClear={(): void => dispatch({ type: 'CLEAR_FORM' })}
      />

      <hr/>

      <h2>Lista zadań</h2>
      <TaskList
        tasks={state.tasks}
        onToggle={handleToggleTask}
        onRemove={handleRemoveTask}
      />
    </div>
  );
}

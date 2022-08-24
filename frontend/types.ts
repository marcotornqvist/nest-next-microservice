export interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
  userId: string;
  createdAt: Date | undefined;
  updatedAt: Date | null;
}

export interface ITodo {
  id: number;
  title: string;
  description: string;
  status: boolean;
}

export interface TodoContextType {
  title: string;
  currentTodo: Todo | null;
  setTitle: (title: string) => void;
  updateTodo: (todo: Todo | null) => void;
}

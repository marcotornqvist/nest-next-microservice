import { FC, useContext } from 'react';
import type { Todo, TodoContextType } from '../types';
import { useQuery } from '@tanstack/react-query';
import { TodoContext } from '../context/todoContext';
import { getAllTodos } from '../react-query-hooks/todo-hooks';
import TodoItem from './TodoItem';

const Todos: FC = () => {
  const { currentTodo, updateTodo } = useContext(
    TodoContext,
  ) as TodoContextType;

  const { data, isLoading, error } = useQuery(['todos'], getAllTodos);
  // if (isLoading) return <div>Loading</div>;
  // if (error) return <div>An error has occurred: {error}</div>;

  return (
    <ul className="todos">
      {data?.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          currentTodoId={currentTodo?.id}
          updateTodo={updateTodo}
        />
      ))}
    </ul>
  );
};

export default Todos;

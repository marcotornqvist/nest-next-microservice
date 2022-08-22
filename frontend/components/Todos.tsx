import type { Todo } from '../types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import TodoItem from './TodoItem';

// Fetcher function
const getTodos = async () => {
  const res = await fetch('http://localhost:4000/todos');
  return res.json();
};

const Todos = () => {
  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const { data, isLoading, error } = useQuery(['todos'], getTodos);

  if (isLoading) return <div>Loading</div>;

  // if (error) return <div>An error has occurred: {error}</div>;

  // // Mutations
  // const mutation = useMutation(postTodo, {
  //   onSuccess: () => {
  //     // Invalidate and refetch
  //     queryClient.invalidateQueries(['todos']);
  //   },
  // });

  return (
    <ul className="todos">
      {data?.map((item: Todo) => (
        <TodoItem
          key={item.id}
          title={item.title}
          id={item.id}
          isCompleted={item.isCompleted}
          userId={item.userId}
          createdAt={item.createdAt}
          updatedAt={item.updatedAt}
        />
      ))}
    </ul>
  );
};

export default Todos;

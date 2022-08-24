import { useContext, FC } from 'react';
import { TodoContext } from '../context/todoContext';
import { Todo, TodoContextType } from '../types';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createTodo } from '../query-hooks/todo';
import axios from 'axios';
import styles from '../styles/modules/Button.module.scss';
import inputStyles from '../styles/modules/Input.module.scss';

// ------IMPORTANT------- implement below logic as hooks in query-hooks folder: https://tkdodo.eu/blog/mastering-mutations-in-react-query

const Form: FC = () => {
  const { title, setTitle, currentTodo, updateTodo } = useContext(
    TodoContext,
  ) as TodoContextType;
  const queryClient = useQueryClient();

  const addTodoMutation = useMutation(
    (title) => axios.post('http://localhost:4000/todos', { title }),
    {
      onMutate: async (title: string) => {
        setTitle('');
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(['todos']);

        // Create optimistic todo
        const optimisticTodo = {
          id: Math.random().toString(36).substring(4),
          title,
        };

        // Optimistically update to the new value
        queryClient.setQueryData<Todo[]>(['todos'], (previous: any) => [
          optimisticTodo,
          ...previous,
        ]);

        return { optimisticTodo };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onSuccess: (result, variables, context) => {
        // Replace optimistic todo in the todos list with the result
        queryClient.setQueryData(['todos'], (previous: any) =>
          previous.map((todo: any) =>
            todo.id === context?.optimisticTodo.id ? result.data : todo,
          ),
        );
      },
      onError: (error, variables, context) => {
        // Remove optimistic todo from the todos list
        queryClient.setQueryData(['todos'], (previous: any) => {
          return previous.filter(
            (todo: any) => todo.id !== context?.optimisticTodo.id,
          );
        });
      },
    },
  );

  return (
    <div className="form-container">
      <div className={inputStyles.inputGroup}>
        <label>Todo Name</label>
        <div className="input-container">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g. Buy Groceries"
          />
          <svg
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="122.881px"
            height="122.88px"
            viewBox="0 0 122.881 122.88"
            enableBackground="new 0 0 122.881 122.88"
            onClick={() => updateTodo(null)}
          >
            <g>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M61.44,0c33.933,0,61.441,27.507,61.441,61.439 c0,33.933-27.508,61.44-61.441,61.44C27.508,122.88,0,95.372,0,61.439C0,27.507,27.508,0,61.44,0L61.44,0z M81.719,36.226 c1.363-1.363,3.572-1.363,4.936,0c1.363,1.363,1.363,3.573,0,4.936L66.375,61.439l20.279,20.278c1.363,1.363,1.363,3.573,0,4.937 c-1.363,1.362-3.572,1.362-4.936,0L61.44,66.376L41.162,86.654c-1.362,1.362-3.573,1.362-4.936,0c-1.363-1.363-1.363-3.573,0-4.937 l20.278-20.278L36.226,41.162c-1.363-1.363-1.363-3.573,0-4.936c1.363-1.363,3.573-1.363,4.936,0L61.44,56.504L81.719,36.226 L81.719,36.226z"
              />
            </g>
          </svg>
        </div>
      </div>
      <button
        className={styles.button}
        onClick={() => {
          addTodoMutation.mutate(title);
          updateTodo(null);
        }}
      >
        {currentTodo ? 'Update' : 'Submit'}
      </button>
    </div>
  );
};

export default Form;

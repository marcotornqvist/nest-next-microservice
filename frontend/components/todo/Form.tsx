import { useContext, SyntheticEvent, FC, useState, useEffect } from 'react';
import { TodoContext } from '../../context/todoContext';
import { TodoContextType } from '../../types';
import {
  useCreateTodo,
  useUpdateTodo,
} from '../../react-query-hooks/todo-hooks';
import styles from '../../styles/modules/Button.module.scss';
import inputStyles from '../../styles/modules/Input.module.scss';

// ------IMPORTANT------- implement below logic as hooks in query-hooks folder: https://tkdodo.eu/blog/mastering-mutations-in-react-query

const Form: FC = () => {
  const { title, setTitle, currentTodo, updateTodo } = useContext(
    TodoContext,
  ) as TodoContextType;
  const [error, setError] = useState('');
  const updateTodoMutation = useUpdateTodo();
  const createTodoMutation = useCreateTodo();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    if (title.length > 0) {
      if (currentTodo) {
        updateTodoMutation.mutate({ title, id: currentTodo.id });
        updateTodo(null);
      } else {
        createTodoMutation.mutate(title);
      }
    } else {
      setError('Title is too short.');
    }
  };

  useEffect(() => {
    setError('');
  }, [title]);

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className={inputStyles.inputGroup}>
        <div className="top-message">
          <label>Todo Name</label>
          <span>{error}</span>
        </div>
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
      <button className={styles.button} onClick={handleSubmit}>
        {currentTodo ? 'Update' : 'Submit'}
      </button>
    </form>
  );
};

export default Form;

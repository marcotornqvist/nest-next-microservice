import type { Todo, TodoContextType } from '../types';
import styles from '../styles/modules/TodoItem.module.scss';
import buttonStyles from '../styles/modules/Button.module.scss';
import { FC, useContext } from 'react';

const TodoItem: FC<{
  todo: Todo;
  currentTodoId?: string;
  updateTodo: (currentTodo: Todo | null) => void;
}> = ({ todo, currentTodoId, updateTodo }) => {
  return (
    <li className={'todo-item ' + styles.todo}>
      <h4>{todo.title}</h4>
      <div className="wrapper">
        <button className={'danger ' + buttonStyles.button}>
          {todo.isCompleted ? 'Completed' : 'Complete'}
        </button>
        <button className={'danger ' + buttonStyles.button}>Delete</button>
        <button
          className={'success ' + buttonStyles.button}
          onClick={() => updateTodo(currentTodoId === todo.id ? null : todo)}
        >
          {currentTodoId === todo.id ? 'Cancel' : 'Edit'}
        </button>
      </div>
    </li>
  );
};

export default TodoItem;

import type { Todo } from '../types';
import { Button } from '@mantine/core';

const TodoItem = ({ title }: Todo) => {
  return (
    <li className="todo-item">
      <h4>{title}</h4>
      <div className="wrapper">
        <Button color="red">Delete</Button>
        <Button color="teal">Edit</Button>
      </div>
    </li>
  );
};

export default TodoItem;

// Fetches all todos
export const getAllTodos = async () => {
  const res = await fetch('http://localhost:4000/todos');
  return res.json();
};

// Creates a new todo
export const createTodo = async () => {
  // const res = await fetch('http://localhost:4000/todos');
  // return res.json();
  const response = await fetch('http://localhost:4000/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Loremaus' }),
  });
  const { data } = await response.json();
  return data;
};

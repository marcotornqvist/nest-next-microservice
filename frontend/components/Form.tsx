import { useState } from 'react';
import { Input, Button } from '@mantine/core';

const Form = () => {
  const [input, setInput] = useState<string>('');

  return (
    <div className="form-container">
      <Input
        value={input}
        onChange={(e: any) => setInput(e.target.value)}
        placeholder="E.g. Buy Groceries"
      />
      <Button>Submit</Button>
    </div>
  );
};

export default Form;

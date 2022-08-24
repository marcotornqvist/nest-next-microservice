import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../styles/app.scss';
import TodoProvider from '../context/todoContext';

// Create a client
const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoProvider>
        <Component {...pageProps} />
      </TodoProvider>
    </QueryClientProvider>
  );
} 

export default App;

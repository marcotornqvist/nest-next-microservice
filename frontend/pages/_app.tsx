import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TodoProvider from '../context/todoContext';
import Navbar from '../components/layout/Navbar';
import '../styles/app.scss';

// Create a client
const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoProvider>
        <Navbar />
        <Component {...pageProps} />
      </TodoProvider>
    </QueryClientProvider>
  );
}

export default App;
